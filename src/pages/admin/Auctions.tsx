import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Eye, CheckCircle, XCircle, Gavel, Clock, Users, DollarSign, Loader2, Sparkles, Calendar, Edit, Ban, Pause, Play, X } from "lucide-react";
import { useState, useEffect } from "react";
import { adminApi, auctionsApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import { Link } from "react-router-dom";

const AdminAuctions = () => {
  const { t, language } = useLanguage();
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [actionAuctionId, setActionAuctionId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending_approval");
  
  // Debug: Log status filter changes
  useEffect(() => {
    console.log('Status filter changed:', statusFilter);
  }, [statusFilter]);
  const queryClient = useQueryClient();

  // Approval form state
  const [startingBid, setStartingBid] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isMaxedAccount, setIsMaxedAccount] = useState(false);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartingBid, setEditStartingBid] = useState("");
  const [editCurrentBid, setEditCurrentBid] = useState("");
  const [editStartsAt, setEditStartsAt] = useState("");
  const [editEndsAt, setEditEndsAt] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [editIsMaxedAccount, setEditIsMaxedAccount] = useState(false);
  
  // Action reason state
  const [rejectionReason, setRejectionReason] = useState("");
  const [pauseReason, setPauseReason] = useState("");
  const [stopReason, setStopReason] = useState("");

  const { data: auctionsResponse, isLoading, error } = useQuery({
    queryKey: ['admin-auctions', searchTerm, statusFilter],
    queryFn: async () => {
      const params: { status?: string } = {};
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      console.log('Fetching auctions with params:', params);
      const result = await auctionsApi.list(params);
      console.log('Auctions API response:', result);
      return result;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Debug logging
  console.log('Admin Auctions Debug:', {
    statusFilter,
    auctionsResponse,
    error,
    data: auctionsResponse?.data,
    meta: auctionsResponse?.meta,
  });

  const auctions = auctionsResponse?.data || [];

  // Filter by search term
  const filteredAuctions = auctions.filter((auction: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      auction.title?.toLowerCase().includes(search) ||
      auction.description?.toLowerCase().includes(search) ||
      auction.user?.username?.toLowerCase().includes(search) ||
      auction.user?.name?.toLowerCase().includes(search)
    );
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      auctionsApi.approve(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction approved successfully");
      setIsApproveDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve auction");
    },
  });

  const endAuctionMutation = useMutation({
    mutationFn: (id: number) =>
      auctionsApi.endAuction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction ended successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to end auction");
    },
  });

  const updateAuctionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      auctionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction updated successfully");
      setIsEditDialogOpen(false);
      resetEditForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update auction");
    },
  });

  const rejectAuctionMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      auctionsApi.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction rejected successfully");
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setActionAuctionId(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject auction");
    },
  });

  const pauseAuctionMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      auctionsApi.pause(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction paused successfully");
      setIsPauseDialogOpen(false);
      setPauseReason("");
      setActionAuctionId(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to pause auction");
    },
  });

  const resumeAuctionMutation = useMutation({
    mutationFn: (id: number) =>
      auctionsApi.resume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction resumed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to resume auction");
    },
  });

  const stopAuctionMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      auctionsApi.stop(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      toast.success("Auction stopped successfully");
      setIsStopDialogOpen(false);
      setStopReason("");
      setActionAuctionId(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to stop auction");
    },
  });

  const resetForm = () => {
    setStartingBid("");
    setStartsAt("");
    setEndsAt("");
    setAdminNotes("");
    setIsMaxedAccount(false);
    setSelectedAuction(null);
  };

  const resetEditForm = () => {
    setEditTitle("");
    setEditDescription("");
    setEditStartingBid("");
    setEditCurrentBid("");
    setEditStartsAt("");
    setEditEndsAt("");
    setEditAdminNotes("");
    setEditIsMaxedAccount(false);
    setSelectedAuction(null);
  };

  const handleEditClick = (auction: any) => {
    setSelectedAuction(auction);
    setEditTitle(auction.title || "");
    setEditDescription(auction.description || "");
    setEditStartingBid(auction.starting_bid?.toString() || "");
    setEditCurrentBid(auction.current_bid?.toString() || "");
    setEditStartsAt(auction.starts_at ? new Date(auction.starts_at).toISOString().slice(0, 16) : "");
    setEditEndsAt(auction.ends_at ? new Date(auction.ends_at).toISOString().slice(0, 16) : "");
    setEditAdminNotes(auction.admin_notes || "");
    setEditIsMaxedAccount(auction.is_maxed_account || false);
    setIsEditDialogOpen(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    const data: any = {};
    
    if (editTitle) data.title = editTitle;
    if (editDescription) data.description = editDescription;
    if (editStartingBid) data.starting_bid = parseFloat(editStartingBid);
    if (editCurrentBid) data.current_bid = parseFloat(editCurrentBid);
    if (editStartsAt) data.starts_at = editStartsAt;
    if (editEndsAt) data.ends_at = editEndsAt;
    if (editAdminNotes !== undefined) data.admin_notes = editAdminNotes;
    data.is_maxed_account = editIsMaxedAccount;

    updateAuctionMutation.mutate({ id: selectedAuction.id, data });
  };

  const handleApproveClick = (auction: any) => {
    setSelectedAuction(auction);
    setStartingBid(auction.price?.toString() || "");
    setIsApproveDialogOpen(true);
  };

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    const data: any = {
      starting_bid: parseFloat(startingBid),
      ends_at: endsAt,
      is_maxed_account: isMaxedAccount,
    };

    if (startsAt) {
      data.starts_at = startsAt;
    }

    if (adminNotes) {
      data.admin_notes = adminNotes;
    }

    approveMutation.mutate({ id: selectedAuction.id, data });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending_approval: { label: "Pending Approval", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
      approved: { label: "Approved", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
      live: { label: "Live", className: "bg-green-500/20 text-green-400 border-green-500/30" },
      ended: { label: "Ended", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
      cancelled: { label: "Cancelled", className: "bg-red-500/20 text-red-400 border-red-500/30" },
      paused: { label: "Paused", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
      rejected: { label: "Rejected", className: "bg-red-500/20 text-red-400 border-red-500/30" },
    };
    const badge = badges[status] || badges.pending_approval;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
            <Gavel className="w-8 h-8 text-[hsl(195,80%,70%)]" />
            Auction Management
          </h1>
          <p className="text-white/60">Manage and approve auction listings</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white/5 border-white/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              console.log('Status filter changed from', statusFilter, 'to', e.target.value);
              setStatusFilter(e.target.value);
            }}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
          >
            <option value="all">All Status</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="live">Live</option>
            <option value="paused">Paused</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Auctions List */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      ) : filteredAuctions.length === 0 ? (
        <Card className="p-12 text-center bg-white/5 border-white/10">
          <Gavel className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 mb-2">No auctions found</p>
          <p className="text-white/40 text-sm">
            Status filter: <strong>{statusFilter}</strong> | 
            Total in response: <strong>{auctions.length}</strong> | 
            Search term: <strong>{searchTerm || 'none'}</strong>
          </p>
          {error && (
            <p className="text-red-400 text-sm mt-2">Error: {error.message}</p>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAuctions.map((auction: any) => (
            <Card key={auction.id} className="p-6 bg-white/5 border-white/10 hover:border-[hsl(195,80%,70%,0.3)] transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                {auction.images?.[0] && (
                  <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={auction.images[0]}
                      alt={auction.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(auction.status)}
                        {auction.is_maxed_account && (
                          <Badge className="bg-[hsl(195,80%,50%)]/20 text-[hsl(195,80%,70%)] border-[hsl(195,80%,50%)]/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Maxed
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {auction.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2">
                        {auction.description}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-white/60 mb-1">Seller</div>
                      <div className="text-white font-semibold">
                        {auction.user?.username || auction.user?.name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Starting Bid</div>
                      <div className="text-white font-semibold">
                        {auction.starting_bid ? `$${auction.starting_bid.toLocaleString()}` : 'Not set'}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Current Bid</div>
                      <div className="text-[hsl(195,80%,70%)] font-semibold">
                        {auction.current_bid ? `$${auction.current_bid.toLocaleString()}` : 'No bids'}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/60 mb-1">Bids</div>
                      <div className="text-white font-semibold flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {auction.bid_count || 0}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-wrap gap-4 text-xs text-white/60">
                    {auction.starts_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Starts: {formatLocalizedDate(auction.starts_at)}
                      </div>
                    )}
                    {auction.ends_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Ends: {formatLocalizedDate(auction.ends_at)}
                      </div>
                    )}
                    {auction.approved_at && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved: {formatLocalizedDate(auction.approved_at)}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                    <Link to={`/auction/${auction.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleEditClick(auction)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    {auction.status === 'pending_approval' && (
                      <>
                        <Button
                          onClick={() => handleApproveClick(auction)}
                          size="sm"
                          className="gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            setActionAuctionId(auction.id);
                            setIsRejectDialogOpen(true);
                          }}
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {(auction.status === 'live' || auction.status === 'approved') && (
                      <>
                        <Button
                          onClick={() => {
                            setActionAuctionId(auction.id);
                            setIsPauseDialogOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="gap-2 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Pause className="w-4 h-4" />
                          Pause
                        </Button>
                        <Button
                          onClick={() => {
                            if (confirm('Are you sure you want to end this auction?')) {
                              endAuctionMutation.mutate(auction.id);
                            }
                          }}
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          End
                        </Button>
                        <Button
                          onClick={() => {
                            setActionAuctionId(auction.id);
                            setIsStopDialogOpen(true);
                          }}
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          Stop
                        </Button>
                      </>
                    )}
                    {auction.status === 'paused' && (
                      <>
                        <Button
                          onClick={() => {
                            resumeAuctionMutation.mutate(auction.id);
                          }}
                          size="sm"
                          className="gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                        >
                          <Play className="w-4 h-4" />
                          Resume
                        </Button>
                        <Button
                          onClick={() => {
                            setActionAuctionId(auction.id);
                            setIsStopDialogOpen(true);
                          }}
                          size="sm"
                          variant="destructive"
                          className="gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          Stop
                        </Button>
                      </>
                    )}
                    {!['pending_approval', 'live', 'approved', 'paused'].includes(auction.status) && (
                      <Button
                        onClick={() => {
                          setActionAuctionId(auction.id);
                          setIsStopDialogOpen(true);
                        }}
                        size="sm"
                        variant="destructive"
                        className="gap-2"
                        disabled={['ended', 'cancelled', 'rejected'].includes(auction.status)}
                      >
                        <Ban className="w-4 h-4" />
                        Stop
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="glass-strong border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-[hsl(195,80%,70%)]" />
              Approve Auction
            </DialogTitle>
            <DialogDescription>
              Set the auction parameters and approve this listing
            </DialogDescription>
          </DialogHeader>

          {selectedAuction && (
            <form onSubmit={handleApprove} className="space-y-4">
              {/* Listing Info */}
              <div className="glass rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-white">Auction Information</h4>
                <div className="text-sm text-white/80">
                  <div><strong>Title:</strong> {selectedAuction.title}</div>
                  <div><strong>Category:</strong> {selectedAuction.category}</div>
                  <div><strong>Original Price:</strong> ${selectedAuction.price?.toLocaleString()}</div>
                  <div><strong>Seller:</strong> {selectedAuction.user?.username || selectedAuction.user?.name}</div>
                </div>
              </div>

              {/* Starting Bid */}
              <div>
                <Label htmlFor="startingBid">Starting Bid *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">$</span>
                  <Input
                    id="startingBid"
                    type="number"
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    className="pl-8"
                    placeholder="Enter starting bid"
                  />
                </div>
              </div>

              {/* Start Date (Optional) */}
              <div>
                <Label htmlFor="startsAt">Start Date (Optional)</Label>
                <Input
                  id="startsAt"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-white/60 mt-1">Leave empty to start immediately after approval</p>
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="endsAt">End Date *</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  required
                  className="bg-white/5 border-white/10"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Maxed Account */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isMaxedAccount"
                  checked={isMaxedAccount}
                  onCheckedChange={(checked) => setIsMaxedAccount(checked === true)}
                />
                <Label htmlFor="isMaxedAccount" className="flex items-center gap-2 cursor-pointer">
                  <Sparkles className="w-4 h-4 text-[hsl(195,80%,70%)]" />
                  This is a maxed account
                </Label>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="bg-white/5 border-white/10"
                  rows={3}
                  placeholder="Internal notes about this auction..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsApproveDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={approveMutation.isPending}
                  className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
                >
                  {approveMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Auction
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-strong border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-[hsl(195,80%,70%)]" />
              Edit Auction
            </DialogTitle>
            <DialogDescription>
              Update auction details and settings
            </DialogDescription>
          </DialogHeader>

          {selectedAuction && (
            <form onSubmit={handleEdit} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-white/5 border-white/10"
                  placeholder="Auction title"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-white/5 border-white/10"
                  rows={4}
                  placeholder="Auction description"
                />
              </div>

              {/* Starting Bid */}
              <div>
                <Label htmlFor="editStartingBid">Starting Bid</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">$</span>
                  <Input
                    id="editStartingBid"
                    type="number"
                    value={editStartingBid}
                    onChange={(e) => setEditStartingBid(e.target.value)}
                    min="0"
                    step="0.01"
                    className="pl-8 bg-white/5 border-white/10"
                    placeholder="Starting bid amount"
                  />
                </div>
              </div>

              {/* Current Bid */}
              <div>
                <Label htmlFor="editCurrentBid">Current Bid</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">$</span>
                  <Input
                    id="editCurrentBid"
                    type="number"
                    value={editCurrentBid}
                    onChange={(e) => setEditCurrentBid(e.target.value)}
                    min="0"
                    step="0.01"
                    className="pl-8 bg-white/5 border-white/10"
                    placeholder="Current bid amount"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="editStartsAt">Start Date</Label>
                <Input
                  id="editStartsAt"
                  type="datetime-local"
                  value={editStartsAt}
                  onChange={(e) => setEditStartsAt(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="editEndsAt">End Date</Label>
                <Input
                  id="editEndsAt"
                  type="datetime-local"
                  value={editEndsAt}
                  onChange={(e) => setEditEndsAt(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Maxed Account */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="editIsMaxedAccount"
                  checked={editIsMaxedAccount}
                  onCheckedChange={(checked) => setEditIsMaxedAccount(checked === true)}
                />
                <Label htmlFor="editIsMaxedAccount" className="flex items-center gap-2 cursor-pointer">
                  <Sparkles className="w-4 h-4 text-[hsl(195,80%,70%)]" />
                  Maxed Account
                </Label>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="editAdminNotes">Admin Notes</Label>
                <Textarea
                  id="editAdminNotes"
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  className="bg-white/5 border-white/10"
                  rows={3}
                  placeholder="Internal notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    resetEditForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateAuctionMutation.isPending}
                  className="bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)]"
                >
                  {updateAuctionMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Auction
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent className="glass-strong border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Auction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this auction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Rejection Reason (Optional)</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-white/5 border-white/10 mt-2"
                rows={3}
                placeholder="Enter reason for rejection..."
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason("");
                setActionAuctionId(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (actionAuctionId) {
                    rejectAuctionMutation.mutate({ 
                      id: actionAuctionId, 
                      reason: rejectionReason || undefined 
                    });
                  }
                }}
                disabled={rejectAuctionMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                {rejectAuctionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Auction"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pause Dialog */}
      <AlertDialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
        <AlertDialogContent className="glass-strong border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Pause Auction</AlertDialogTitle>
            <AlertDialogDescription>
              Pause this auction temporarily. You can resume it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pauseReason">Pause Reason (Optional)</Label>
              <Textarea
                id="pauseReason"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="bg-white/5 border-white/10 mt-2"
                rows={3}
                placeholder="Enter reason for pausing..."
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setIsPauseDialogOpen(false);
                setPauseReason("");
                setActionAuctionId(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (actionAuctionId) {
                    pauseAuctionMutation.mutate({ 
                      id: actionAuctionId, 
                      reason: pauseReason || undefined 
                    });
                  }
                }}
                disabled={pauseAuctionMutation.isPending}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {pauseAuctionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Pausing...
                  </>
                ) : (
                  "Pause Auction"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stop Dialog */}
      <AlertDialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
        <AlertDialogContent className="glass-strong border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Auction</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently stop this auction. All active bids will be refunded. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="stopReason">Stop Reason (Optional)</Label>
              <Textarea
                id="stopReason"
                value={stopReason}
                onChange={(e) => setStopReason(e.target.value)}
                className="bg-white/5 border-white/10 mt-2"
                rows={3}
                placeholder="Enter reason for stopping..."
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setIsStopDialogOpen(false);
                setStopReason("");
                setActionAuctionId(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (actionAuctionId) {
                    stopAuctionMutation.mutate({ 
                      id: actionAuctionId, 
                      reason: stopReason || undefined 
                    });
                  }
                }}
                disabled={stopAuctionMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                {stopAuctionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Stopping...
                  </>
                ) : (
                  "Stop Auction"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAuctions;

