import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  ShieldCheck, 
  Loader2, 
  User, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Filter,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";
import type { KycVerification } from "@/types/api";

interface KycWithUser extends KycVerification {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  persona_data?: any; // Persona response data stored as JSON
}

const AdminKYC = () => {
  const { t, language } = useLanguage();
  const [selectedKyc, setSelectedKyc] = useState<KycWithUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: kycResponse, isLoading } = useQuery({
    queryKey: ['admin-kyc', statusFilter, searchTerm],
    queryFn: () => adminApi.kyc(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const kycs: KycWithUser[] = kycResponse?.data || [];

  // Filter by status and search
  const filteredKycs = kycs.filter((kyc) => {
    const matchesStatus = !statusFilter || kyc.status === statusFilter;
    const matchesSearch = !searchTerm || 
      kyc.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kyc.persona_inquiry_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleViewDetails = (kyc: KycWithUser) => {
    setSelectedKyc(kyc);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return formatLocalizedDate(dateString, language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          label: language === 'ar' ? 'متحقق' : 'Verified',
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: CheckCircle2
        };
      case 'failed':
        return {
          label: language === 'ar' ? 'فشل' : 'Failed',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: XCircle
        };
      case 'expired':
        return {
          label: language === 'ar' ? 'منتهي' : 'Expired',
          className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
          icon: AlertCircle
        };
      case 'pending':
      default:
        return {
          label: language === 'ar' ? 'قيد الانتظار' : 'Pending',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: Clock
        };
    }
  };

  const getPersonaDashboardUrl = (inquiryId?: string) => {
    if (!inquiryId) return null;
    // Persona dashboard URL format (adjust based on your Persona environment)
    const baseUrl = process.env.REACT_APP_PERSONA_DASHBOARD_URL || 'https://app.withpersona.com';
    return `${baseUrl}/inquiries/${inquiryId}`;
  };

  const statusCounts = {
    pending: kycs.filter(k => k.status === 'pending').length,
    verified: kycs.filter(k => k.status === 'verified').length,
    failed: kycs.filter(k => k.status === 'failed').length,
    expired: kycs.filter(k => k.status === 'expired').length,
  };

  const totalKycs = kycs.length;

  return (
    <div className="p-4 md:p-6 bg-gradient-to-b from-[hsl(200,70%,15%)] via-[hsl(195,60%,25%)] to-[hsl(200,70%,15%)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
          {language === 'ar' ? 'إدارة التحقق من الهوية' : 'KYC Management'}
        </h1>
        <p className="text-white/60">
          {language === 'ar' 
            ? `عرض وإدارة جميع طلبات التحقق من الهوية (${totalKycs} طلب)` 
            : `View and manage all KYC verifications (${totalKycs} total)`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <span className="text-2xl font-bold text-white">{statusCounts.pending}</span>
          </div>
          <p className="text-sm text-white/70">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</p>
        </Card>
        <Card className="p-4 bg-green-500/10 border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span className="text-2xl font-bold text-white">{statusCounts.verified}</span>
          </div>
          <p className="text-sm text-white/70">{language === 'ar' ? 'متحقق' : 'Verified'}</p>
        </Card>
        <Card className="p-4 bg-red-500/10 border-red-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="h-5 w-5 text-red-400" />
            <span className="text-2xl font-bold text-white">{statusCounts.failed}</span>
          </div>
          <p className="text-sm text-white/70">{language === 'ar' ? 'فشل' : 'Failed'}</p>
        </Card>
        <Card className="p-4 bg-orange-500/10 border-orange-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="h-5 w-5 text-orange-400" />
            <span className="text-2xl font-bold text-white">{statusCounts.expired}</span>
          </div>
          <p className="text-sm text-white/70">{language === 'ar' ? 'منتهي' : 'Expired'}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 bg-white/5 border-white/10 backdrop-blur-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input 
              placeholder={language === 'ar' ? "البحث بالاسم أو البريد الإلكتروني أو معرف Persona..." : "Search by name, email, or Persona ID..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-white/60" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
              <option value="verified">{language === 'ar' ? 'متحقق' : 'Verified'}</option>
              <option value="failed">{language === 'ar' ? 'فشل' : 'Failed'}</option>
              <option value="expired">{language === 'ar' ? 'منتهي' : 'Expired'}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* KYC List */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      ) : filteredKycs.length === 0 ? (
        <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-sm text-center">
          <ShieldCheck className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60">
            {language === 'ar' 
              ? 'لا توجد طلبات تحقق مطابقة للبحث' 
              : 'No KYC verifications match your search'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredKycs.map((kyc) => {
            const statusBadge = getStatusBadge(kyc.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <Card 
                key={kyc.id} 
                className="p-4 bg-white/5 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-white/60" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {kyc.user?.name || language === 'ar' ? 'مستخدم غير معروف' : 'Unknown User'}
                        </h3>
                        <p className="text-sm text-white/60">{kyc.user?.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{language === 'ar' ? 'تاريخ الطلب:' : 'Requested:'} {formatDate(kyc.created_at)}</span>
                      </div>
                      {kyc.verified_at && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{language === 'ar' ? 'تاريخ التحقق:' : 'Verified:'} {formatDate(kyc.verified_at)}</span>
                        </div>
                      )}
                      {kyc.persona_inquiry_id && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span className="font-mono text-xs">ID: {kyc.persona_inquiry_id.substring(0, 8)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusBadge.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusBadge.label}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(kyc)}
                      className="border-white/20 text-white hover:bg-white/30"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {language === 'ar' ? 'التفاصيل' : 'Details'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-[hsl(200,70%,18%)] border-white/20 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {language === 'ar' ? 'تفاصيل التحقق من الهوية' : 'KYC Verification Details'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {language === 'ar' 
                ? 'معلومات كاملة عن طلب التحقق من الهوية' 
                : 'Complete information about the KYC verification request'}
            </DialogDescription>
          </DialogHeader>

          {selectedKyc && (
            <div className="space-y-6 mt-4">
              {/* User Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === 'ar' ? 'معلومات المستخدم' : 'User Information'}
                </h3>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">{language === 'ar' ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-medium">{selectedKyc.user?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                    <span className="font-medium">{selectedKyc.user?.email || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">{language === 'ar' ? 'معرف المستخدم:' : 'User ID:'}</span>
                    <span className="font-mono text-sm">#{selectedKyc.user_id}</span>
                  </div>
                </div>
              </div>

              {/* KYC Status */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  {language === 'ar' ? 'حالة التحقق' : 'Verification Status'}
                </h3>
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                    <Badge className={getStatusBadge(selectedKyc.status).className}>
                      {getStatusBadge(selectedKyc.status).label}
                    </Badge>
                  </div>
                  {selectedKyc.persona_inquiry_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">{language === 'ar' ? 'معرف Persona:' : 'Persona Inquiry ID:'}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{selectedKyc.persona_inquiry_id}</span>
                        {getPersonaDashboardUrl(selectedKyc.persona_inquiry_id) && (
                          <a
                            href={getPersonaDashboardUrl(selectedKyc.persona_inquiry_id)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">{language === 'ar' ? 'تاريخ الطلب:' : 'Requested:'}</span>
                    <span>{formatDate(selectedKyc.created_at)}</span>
                  </div>
                  {selectedKyc.verified_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">{language === 'ar' ? 'تاريخ التحقق:' : 'Verified At:'}</span>
                      <span>{formatDate(selectedKyc.verified_at)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">{language === 'ar' ? 'آخر تحديث:' : 'Last Updated:'}</span>
                    <span>{formatDate(selectedKyc.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Persona Data (if available) */}
              {selectedKyc.persona_data && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    {language === 'ar' ? 'بيانات Persona' : 'Persona Data'}
                  </h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <pre className="text-xs text-white/80 overflow-x-auto">
                      {JSON.stringify(selectedKyc.persona_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Note */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  {language === 'ar' 
                    ? '💡 ملاحظة: يتم التحقق من الهوية تلقائياً عبر Persona. يمكنك عرض التفاصيل الكاملة في لوحة تحكم Persona باستخدام معرف الاستعلام أعلاه.'
                    : '💡 Note: Identity verification is handled automatically via Persona. You can view full details in the Persona dashboard using the inquiry ID above.'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminKYC;

