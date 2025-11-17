import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Star, Users, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { SEO } from "@/components/SEO";
import { publicApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import type { User } from "@/types/api";

const Members = () => {
  const { t, tAr, language } = useLanguage();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const { data: membersResponse, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: () => publicApi.members(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: selectedMemberDetails } = useQuery({
    queryKey: ['member', selectedMemberId],
    queryFn: () => publicApi.member(selectedMemberId!),
    enabled: !!selectedMemberId,
  });

  const allMembers: User[] = membersResponse?.data || [];

  // Filter members based on search and filters
  const members = useMemo(() => {
    return allMembers.filter((member) => {
      // Search filter
      const matchesSearch = !searchQuery || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter (currently all members are sellers, so this is placeholder)
      const matchesRole = roleFilter === "all" || true;

      // Rating filter (TODO: when backend adds rating system)
      const matchesRating = ratingFilter === "all" || true;

      return matchesSearch && matchesRole && matchesRating;
    });
  }, [allMembers, searchQuery, roleFilter, ratingFilter]);

  // Memoize snow particles for performance
  const snowParticles = useMemo(() => 
    [...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/40 rounded-full animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-${Math.random() * 20}%`,
          animationDuration: `${10 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    )), []
  );

  const handleViewProfile = (memberId: number) => {
    setSelectedMemberId(memberId);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => formatLocalizedDate(dateString, language);

  return (
    <>
      <SEO 
        title={`${tAr('members.title')} - NXOLand`}
        description={tAr('members.description')}
      />
      <div className="min-h-screen relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" aria-hidden="true" />
        
        {/* Skip link for keyboard navigation */}
        <a 
          href="#members-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[hsl(195,80%,50%)] focus:text-white focus:rounded-md focus:shadow-lg"
        >
          {t('members.skipToMembers')}
        </a>
        
        {/* Snow particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {snowParticles}
        </div>

        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <div id="members-content" className="relative z-10 container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">{t('members.title')}</h1>
            <p className="text-white/60">{t('members.subtitle', { count: members.length })}</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                <Input 
                  type="search"
                  inputMode="search"
                  autoComplete="off"
                  placeholder={t('members.searchPlaceholder')}
                  className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[hsl(195,80%,70%,0.5)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={t('members.searchLabel')}
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white" aria-label={t('members.filterByRole')}>
                    <SelectValue placeholder={t('members.role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="seller">{t('members.sellers')}</SelectItem>
                    <SelectItem value="buyer">{t('members.buyers')}</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white" aria-label={t('members.filterByRating')}>
                    <SelectValue placeholder={t('members.rating')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('members.allRatings')}</SelectItem>
                    <SelectItem value="5">{t('members.5stars')}</SelectItem>
                    <SelectItem value="4">{t('members.4plusStars')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-white/60" aria-hidden="true" />
            </div>
          )}

          {/* Members Grid */}
          {!isLoading && members.length === 0 && (
            <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-white/20" aria-hidden="true" />
              <p className="text-white/60">
                {searchQuery ? t('members.noResults', { query: searchQuery }) : t('members.noMembers')}
              </p>
            </Card>
          )}

          {!isLoading && members.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card 
                key={member.id}
                className="p-6 bg-white/5 border-white/10 hover:border-[hsl(195,80%,70%,0.5)] transition-all hover:-translate-y-1 backdrop-blur-sm"
              >
                {/* Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Users className="h-8 w-8 text-white" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        {member.name}
                        {member.kyc_verified && (
                          <CheckCircle2 className="h-5 w-5 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" aria-label="موثق" />
                        )}
                      </h3>
                      {member.kyc_verified && (
                        <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)] text-xs">
                          {t('members.trustedMember')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

              {/* Bio */}
              {member.bio && (
                <div className="mb-4">
                  <p className="text-white/70 text-sm line-clamp-2">{member.bio}</p>
                </div>
              )}

              {/* Join Date */}
              <div className="text-sm text-white/60 mb-4">
                {t('members.memberSince', { date: formatDate(member.created_at) })}
              </div>

                {/* Action Button */}
                <Button 
                  onClick={() => handleViewProfile(member.id)}
                  className="w-full bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] text-white border-0"
                >
                  {t('members.viewProfile')}
                </Button>
              </Card>
            ))}
          </div>
          )}
        </div>

        {/* Profile Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[hsl(217,33%,17%)] border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {t('members.profile')}
              </DialogTitle>
            </DialogHeader>
            {selectedMemberDetails && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(200,70%,40%)] flex items-center justify-center">
                      {selectedMemberDetails.avatar ? (
                        <img src={selectedMemberDetails.avatar} alt={selectedMemberDetails.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Users className="h-10 w-10 text-white" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                      {selectedMemberDetails.name}
                      {selectedMemberDetails.kyc_verified && (
                        <CheckCircle2 className="h-6 w-6 text-[hsl(195,80%,70%)] fill-[hsl(195,80%,70%)]" aria-label="موثق" />
                      )}
                    </h3>
                    {selectedMemberDetails.kyc_verified && (
                      <Badge className="bg-[hsl(195,80%,50%,0.2)] text-[hsl(195,80%,70%)] border-[hsl(195,80%,70%,0.3)]">
                        {t('members.trustedMember')}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedMemberDetails.bio && (
                  <Card className="p-4 bg-white/5 border-white/10">
                    <h4 className="font-bold text-white mb-2">{t('members.aboutMember')}</h4>
                    <p className="text-white/70 text-sm">{selectedMemberDetails.bio}</p>
                  </Card>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl font-bold text-[hsl(195,80%,70%)] mb-1">{selectedMemberDetails.listings_count || 0}</div>
                    <div className="text-xs text-white/60">{t('members.listings')}</div>
                  </Card>
                  <Card className="p-4 bg-white/5 border-white/10 text-center">
                    <div className="text-2xl font-bold text-[hsl(40,90%,55%)] mb-1">{selectedMemberDetails.orders_as_seller_count || 0}</div>
                    <div className="text-xs text-white/60">{t('members.sales')}</div>
                  </Card>
                </div>

                {/* Member Info */}
                <Card className="p-4 bg-white/5 border-white/10">
                  <h4 className="font-bold text-white mb-3">{t('members.memberInfo')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">{t('members.joinDate')}</span>
                      <span className="text-[hsl(195,80%,80%)]">{formatDate(selectedMemberDetails.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">{t('members.totalListings')}</span>
                      <span className="text-[hsl(195,80%,80%)]">{selectedMemberDetails.listings_count || 0} {t('members.listings')}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[hsl(195,80%,50%,0.1)] rounded-full blur-[120px] animate-pulse pointer-events-none" aria-hidden="true" />
      </div>

      <BottomNav />
    </>
  );
};

export default Members;
