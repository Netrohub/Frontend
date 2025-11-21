import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatLocalizedDate } from "@/utils/date";

const AdminKyc = () => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-kyc", search, page],
    queryFn: () => adminApi.kyc({ search: search || undefined, page }),
    keepPreviousData: true,
    staleTime: 30_000,
  });

  const kycs = data?.data || [];
  const pagination = data
    ? {
        current: data.current_page,
        last: data.last_page,
      }
    : { current: 1, last: 1 };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">{t('admin.kyc.title')}</h1>
        <p className="text-white/60 mt-1">{t('admin.kyc.subtitle')}</p>
      </div>

      <Card className="p-4 bg-white/5 border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="ابحث بواسطة اسم المستخدم أو البريد أو رقم الاستفسار"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
        <Button
          variant="ghost"
          className="text-white/70 border-white/10 gap-2"
          onClick={() => setSearch("")}
        >
          مسح البحث
        </Button>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      ) : (
        <div className="space-y-4">
          {kycs.map((kyc) => (
            <Card key={kyc.id} className="p-4 bg-white/5 border-white/10 flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-white/70">المستخدم</p>
                  <p className="text-lg font-semibold text-white">
                    {kyc.user?.name || "—"} ({kyc.user?.email || "—"})
                  </p>
                </div>
                <Badge className="text-white/70 border-white/30">
                  {t(`kyc.${kyc.status || "pending"}`)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white/70">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">رقم الاستفسار</p>
                  <p>{kyc.persona_inquiry_id || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">تاريخ الإنشاء</p>
                  <p>{formatLocalizedDate(kyc.created_at, language)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">حدث آخر</p>
                  <p>{formatLocalizedDate(kyc.updated_at, language)}</p>
                </div>
              </div>
            </Card>
          ))}

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">
              {t('common.page')} {pagination.current} {t('common.of')} {pagination.last}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                disabled={pagination.current <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                {t('common.previous')}
              </Button>
              <Button
                variant="ghost"
                disabled={pagination.current >= pagination.last}
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.last))}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isFetching && (
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-white/50" />
        </div>
      )}
    </div>
  );
};

export default AdminKyc;

