import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Clock, Gavel, Users, Sparkles } from 'lucide-react'
import { auctionsApi } from '@/lib/api'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { SEO } from '@/components/SEO'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatDistanceToNow } from 'date-fns'

interface AuctionListing {
  id: number
  listing_id: number
  user_id: number
  status: 'pending_approval' | 'approved' | 'live' | 'ended' | 'cancelled'
  starting_bid: number
  current_bid: number
  current_bidder_id: number | null
  starts_at: string | null
  ends_at: string | null
  bid_count: number
  is_maxed_account: boolean
  listing?: {
    id: number
    title: string
    description: string
    price: number
    category: string
    images: string[]
  }
  current_bidder?: {
    id: number
    name: string
    username: string
  }
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = Date.now()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  if (!timeLeft) {
    return <span>Calculating...</span>
  }

  const { days, hours, minutes, seconds } = timeLeft
  const isUrgent = days === 0 && hours < 1

  return (
    <div className="flex items-center gap-1 text-sm">
      {days > 0 && (
        <span className={isUrgent ? 'text-red-400' : 'text-white/80'}>
          {String(days).padStart(2, '0')}d
        </span>
      )}
      <span className={isUrgent ? 'text-red-400' : 'text-white/80'}>
        {String(hours).padStart(2, '0')}h
      </span>
      <span className={isUrgent ? 'text-red-400' : 'text-white/80'}>
        {String(minutes).padStart(2, '0')}m
      </span>
      <span className={isUrgent ? 'text-red-400' : 'text-white/80'}>
        {String(seconds).padStart(2, '0')}s
      </span>
    </div>
  )
}

export default function Auctions() {
  const { t, language } = useLanguage()

  const { data, isLoading } = useQuery({
    queryKey: ['auctions'],
    queryFn: () => auctionsApi.list({ status: 'live' }),
    refetchInterval: 5000,
  })

  const auctions = data?.data || []

  return (
    <>
      <SEO
        title={t('auctions.title') || 'Premium Auctions - NXOLand'}
        description={t('auctions.description') || 'Bid on exclusive maxed-out Whiteout Survival accounts'}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />
        
        <section className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-[hsl(195,80%,70%,0.3)] mb-4">
              <Sparkles className="h-4 w-4 text-[hsl(195,80%,70%)] animate-pulse" />
              <span className="text-sm font-medium text-[hsl(195,80%,70%)]">
                {t('auctions.badge') || 'Premium Maxed Accounts'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-white drop-shadow-[0_0_30px_rgba(148,209,240,0.5)]">
              {t('auctions.title') || 'Premium Auctions'}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {t('auctions.subtitle') || 'Bid on exclusive maxed-out Whiteout Survival accounts. Only the finest accounts make it here.'}
            </p>
          </div>

          {/* Auctions Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-white/10 rounded-xl mb-4" />
                  <div className="h-6 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-20">
              <Gavel className="w-24 h-24 text-white/20 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white/60 mb-2">
                {t('auctions.noAuctions') || 'No Live Auctions'}
              </h2>
              <p className="text-white/40">
                {t('auctions.checkBack') || 'Check back soon for premium maxed accounts!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => {
                const image = auction.listing?.images?.[0] || '/placeholder.jpg'
                const isLive = auction.status === 'live' && auction.ends_at

                return (
                  <Link
                    key={auction.id}
                    to={`/auction/${auction.id}`}
                    className="glass-strong rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={image}
                        alt={auction.listing?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Status Badge */}
                      {isLive && (
                        <div className="absolute top-4 right-4 px-3 py-1 glass rounded-full flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-xs font-bold text-white">LIVE</span>
                        </div>
                      )}

                      {/* Maxed Badge */}
                      {auction.is_maxed_account && (
                        <div className="absolute top-4 left-4 px-3 py-1 glass rounded-full">
                          <span className="text-xs font-bold text-[hsl(195,80%,70%)] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            MAXED
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[hsl(195,80%,70%)] transition-colors">
                        {auction.listing?.title}
                      </h3>
                      
                      {/* Current Bid */}
                      <div className="mb-4">
                        <div className="text-sm text-white/60 mb-1">Current Bid</div>
                        <div className="text-3xl font-black text-[hsl(195,80%,70%)]">
                          ${auction.current_bid?.toLocaleString() || auction.starting_bid?.toLocaleString()}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{auction.bid_count || 0} bids</span>
                        </div>
                        {auction.current_bidder && (
                          <div className="text-xs">
                            Leading: {auction.current_bidder.username || auction.current_bidder.name}
                          </div>
                        )}
                      </div>

                      {/* Countdown */}
                      {isLive && auction.ends_at && (
                        <div className="pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Clock className="w-4 h-4 text-[hsl(195,80%,70%)]" />
                            <CountdownTimer endDate={auction.ends_at} />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <BottomNav />
      </div>
    </>
  )
}

