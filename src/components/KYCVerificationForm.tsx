import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, IdCard, ArrowRight, Loader2 } from "lucide-react";

interface KYCVerificationFormProps {
  onStart: () => void;
  isLoading: boolean;
  isRefetching: boolean;
  canStart: boolean;
  personaLoaded: boolean;
  buttonText?: string;
}

export const KYCVerificationForm = ({
  onStart,
  isLoading,
  isRefetching,
  canStart,
  personaLoaded,
  buttonText = "بدء التحقق عبر Persona"
}: KYCVerificationFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <IdCard className="h-6 w-6 text-[hsl(195,80%,70%)]" />
        <h3 className="text-xl font-bold text-white">التحقق من الهوية - Persona</h3>
      </div>
      <p className="text-white/60 mb-4">
        سنستخدم نظام Persona المعتمد عالمياً للتحقق من هويتك ورقم هاتفك بشكل آمن وسريع
      </p>
      
      <Card className="p-6 bg-white/5 border-white/10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] rounded-full flex items-center justify-center">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">خطوات التحقق</h4>
            <ul className="text-sm text-white/60 text-right space-y-2">
              <li>• التقط صورة لهويتك الوطنية أو الإقامة</li>
              <li>• التقط صورة سيلفي للتحقق</li>
              <li>• تحقق من رقم هاتفك</li>
              <li>• سيتم التحقق تلقائياً خلال دقائق</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-[hsl(195,80%,50%,0.1)] border-[hsl(195,80%,70%,0.3)]">
        <div className="flex gap-2">
          <ShieldCheck className="h-5 w-5 text-[hsl(195,80%,70%)] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/80">
            <p className="font-bold mb-1">آمن ومشفر</p>
            <p>نظام Persona معتمد من أكبر الشركات العالمية ويضمن حماية كاملة لبياناتك</p>
          </div>
        </div>
      </Card>

      <Button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStart();
        }}
        disabled={isLoading || isRefetching || !canStart}
        className="w-full gap-2 bg-gradient-to-r from-[hsl(195,80%,50%)] to-[hsl(280,70%,50%)] hover:from-[hsl(195,80%,60%)] hover:to-[hsl(280,70%,60%)] text-white border-0 py-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            جاري إنشاء طلب التحقق...
          </>
        ) : (
          <>
            <IdCard className="h-5 w-5" />
            {personaLoaded || (window as any).Persona ? buttonText : 'جاري التحميل...'}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>

      <p className="text-xs text-center text-white/60">
        بالضغط على "بدء التحقق" ستفتح نافذة Persona للتحقق من هويتك ورقم هاتفك
      </p>
    </div>
  );
};

