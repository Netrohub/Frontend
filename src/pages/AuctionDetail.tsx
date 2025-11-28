import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Gavel, Users, Sparkles, Shield, ArrowLeft, TrendingUp, Info } from 'lucide-react'
import { auctionsApi } from '@/lib/api'
import { toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { SEO } from '@/components/SEO'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
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
    <div className="flex items-center gap-2">
      {days > 0 && (
        <span className={`font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
          {String(days).padStart(2, '0')}d
        </span>
      )}
      <span className={`font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
        {String(hours).padStart(2, '0')}h
      </span>
      <span className={`font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
        {String(minutes).padStart(2, '0')}m
      </span>
      <span className={`font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
        {String(seconds).padStart(2, '0')}s
      </span>
    </div>
  )
}

export default function AuctionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [isBidding, setIsBidding] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')

  const { data: auction, isLoading } = useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionsApi.get(Number(id)),
    refetchInterval: (data) => {
      if (data?.status === 'live' && data?.ends_at) {
        const endsAt = new Date(data.ends_at).getTime()
        const now = Date.now()
        return endsAt > now ? 2000 : false
      }
      return false
    },
  })

  const { data: bidsData } = useQuery({
    queryKey: ['auction-bids', id],
    queryFn: () => auctionsApi.getBids(Number(id)),
    enabled: !!id,
    refetchInterval: 3000,
  })

  const placeBidMutation = useMutation({
    mutationFn: ({ amount, depositAmount }: { amount: number; depositAmount: number }) =>
      auctionsApi.placeBid(Number(id), amount, depositAmount),
    onSuccess: () => {
      toast.success('Bid placed successfully!', {
        description: 'Your bid has been recorded.',
      })
      queryClient.invalidateQueries({ queryKey: ['auction', id] })
      queryClient.invalidateQueries({ queryKey: ['auction-bids', id] })
      setIsBidding(false)
      setBidAmount('')
      setDepositAmount('')
    },
    onError: (error: any) => {
      toast.error('Failed to place bid', {
        description: error?.response?.data?.message || 'Please try again.',
      })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white/60">Auction not found</h2>
          <Link to="/auctions" className="text-[hsl(195,80%,70%)] hover:text-[hsl(195,80%,60%)]">
            Back to auctions
          </Link>
        </div>
      </div>
    )
  }

  const isLive = auction.status === 'live' && auction.ends_at && new Date(auction.ends_at) > new Date()
  const image = auction.listing?.images?.[0] || '/placeholder.jpg'
  const bids = bidsData?.data || []
  const minBid = auction.current_bid ? auction.current_bid + 1 : auction.starting_bid || 0

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(bidAmount)
    const deposit = parseFloat(depositAmount)

    if (amount < minBid) {
      toast.error(`Minimum bid is $${minBid}`)
      return
    }

    if (deposit <= 0) {
      toast.error('Deposit amount must be greater than 0')
      return
    }

    placeBidMutation.mutate({ amount, depositAmount: deposit })
  }

  return (
    <>
      <SEO
        title={`${auction.listing?.title} - Auction | NXOLand`}
        description={auction.listing?.description}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" />
        <Navbar />

        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Auctions</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={image}
                    alt={auction.listing?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {isLive && (
                    <div className="absolute top-4 left-4 px-4 py-2 glass rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold text-white">LIVE AUCTION</span>
                    </div>
                  )}
                  {auction.is_maxed_account && (
                    <div className="absolute top-4 right-4 px-4 py-2 glass rounded-full">
                      <span className="text-sm font-bold text-[hsl(195,80%,70%)] flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        MAXED ACCOUNT
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="glass-strong rounded-2xl p-6">
                <h1 className="text-3xl font-black mb-4 bg-gradient-to-r from-[hsl(195,80%,70%)] to-[hsl(195,80%,50%)] bg-clip-text text-transparent">
                  {auction.listing?.title}
                </h1>
                <p className="text-white/80 leading-relaxed whitespace-pre-line">
                  {auction.listing?.description}
                </p>

                {/* Account Metadata */}
                {auction.listing?.account_metadata && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[hsl(195,80%,70%)]" />
                      Account Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(auction.listing.account_metadata).map(([key, value]) => {
                        if (key === 'bill_images' || key === 'delivery_description') return null
                        return (
                          <div key={key} className="glass rounded-lg p-3">
                            <div className="text-xs text-white/60 mb-1 capitalize">
                              {key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-sm font-semibold text-white">
                              {String(value)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bid History */}
              <div className="glass-strong rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[hsl(195,80%,70%)]" />
                  Bid History
                </h3>
                {bids.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No bids yet. Be the first to bid!</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bids.map((bid: any) => (
                      <div
                        key={bid.id}
                        className={`glass rounded-xl p-4 flex items-center justify-between ${
                          bid.is_winning_bid ? 'border-2 border-[hsl(195,80%,70%)]/50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            bid.is_winning_bid 
                              ? 'bg-[hsl(195,80%,50%)]/20 text-[hsl(195,80%,70%)]' 
                              : 'bg-white/10 text-white/60'
                          }`}>
                            {bid.user?.username?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">
                              {bid.user?.username || bid.user?.name || 'Anonymous'}
                              {bid.is_winning_bid && (
                                <span className="ml-2 text-xs px-2 py-0.5 bg-[hsl(195,80%,50%)]/20 text-[hsl(195,80%,70%)] rounded-full">
                                  Winning
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-white/60">
                              {new Date(bid.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[hsl(195,80%,70%)]">
                            ${bid.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Bid Card */}
              <div className="glass-strong rounded-2xl p-6 border-2 border-[hsl(195,80%,70%)]/30">
                <div className="text-center mb-6">
                  <div className="text-sm text-white/60 mb-2">Current Bid</div>
                  <div className="text-5xl font-black text-[hsl(195,80%,70%)] mb-2">
                    ${auction.current_bid?.toLocaleString() || auction.starting_bid?.toLocaleString()}
                  </div>
                  {auction.current_bidder && (
                    <div className="text-sm text-white/70">
                      Leading: <span className="font-semibold">{auction.current_bidder.username || auction.current_bidder.name}</span>
                    </div>
                  )}
                </div>

                {/* Countdown */}
                {isLive && auction.ends_at && (
                  <div className="mb-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 text-sm text-white/80 mb-2">
                      <Clock className="w-4 h-4 text-[hsl(195,80%,70%)]" />
                      <span>Time Remaining</span>
                    </div>
                    <div className="text-center">
                      <CountdownTimer endDate={auction.ends_at} />
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Starting Bid</span>
                    <span className="font-semibold">${auction.starting_bid?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Total Bids
                    </span>
                    <span className="font-semibold">{auction.bid_count || 0}</span>
                  </div>
                </div>

                {/* Bid Button */}
                {isLive && user?.is_verified && (
                  <Button
                    onClick={() => setIsBidding(true)}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(195,80%,40%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(195,80%,50%)] text-white font-bold"
                  >
                    <Gavel className="w-5 h-5 mr-2" />
                    Place Bid
                  </Button>
                )}

                {!isLive && (
                  <div className="mt-6 py-4 text-center text-white/60 rounded-xl glass">
                    {auction.status === 'ended' ? 'Auction Ended' : 'Auction Not Live'}
                  </div>
                )}

                {!user?.is_verified && (
                  <div className="mt-6 py-4 text-center text-white/60 rounded-xl glass">
                    <p className="text-sm mb-2">Verification Required</p>
                    <Link to="/kyc" className="text-[hsl(195,80%,70%)] hover:underline text-sm">
                      Complete KYC to bid
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <BottomNav />

        {/* Bid Dialog */}
        <Dialog open={isBidding} onOpenChange={setIsBidding}>
          <DialogContent className="glass-strong border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-[hsl(195,80%,70%)]" />
                Place Your Bid
              </DialogTitle>
              <DialogDescription>
                Enter your bid amount and deposit. Deposit is refundable if you're outbid.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleBid} className="space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-white/60 mb-1">Current Highest Bid</div>
                <div className="text-2xl font-bold text-[hsl(195,80%,70%)]">
                  ${auction.current_bid?.toLocaleString() || auction.starting_bid?.toLocaleString()}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Minimum bid: ${minBid.toLocaleString()}
                </div>
              </div>

              <div>
                <Label htmlFor="bidAmount">Your Bid Amount *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">$</span>
                  <Input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    step="1"
                    required
                    className="pl-8"
                    placeholder={minBid.toString()}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="depositAmount">Deposit Amount (Refundable) *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">$</span>
                  <Input
                    id="depositAmount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="1"
                    step="1"
                    required
                    className="pl-8"
                    placeholder="Enter deposit amount"
                  />
                </div>
                <div className="mt-2 flex items-start gap-2 text-xs text-white/60">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Your deposit will be held in escrow. If you're outbid, it will be automatically refunded.
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={placeBidMutation.isPending}
                className="w-full bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(195,80%,40%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(195,80%,50%)]"
              >
                {placeBidMutation.isPending ? 'Placing Bid...' : 'Place Bid'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

