import { Card } from "@/components/ui/card";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export type PaymentMethod = "MADA" | "VISA" | "MASTERCARD";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
  className?: string;
}

export const PaymentMethodSelector = ({
  selectedMethod,
  onSelect,
  className,
}: PaymentMethodSelectorProps) => {
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  const paymentMethods: {
    id: PaymentMethod;
    name: string;
    nameAr: string;
    logo: string;
    color: string;
    description: string;
    descriptionAr: string;
  }[] = [
    {
      id: "MADA",
      name: "MADA",
      nameAr: "مدى",
      logo: "/images/payment-methods/mada-logo.png",
      color: "from-green-500/20 to-emerald-500/20 border-green-500/40",
      description: "Saudi Arabia's national payment network",
      descriptionAr: "شبكة الدفع الوطنية السعودية",
    },
    {
      id: "VISA",
      name: "Visa",
      nameAr: "فيزا",
      logo: "/images/payment-methods/visa-logo.png",
      color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40",
      description: "Accepted worldwide",
      descriptionAr: "مقبولة في جميع أنحاء العالم",
    },
    {
      id: "MASTERCARD",
      name: "Mastercard",
      nameAr: "ماستركارد",
      logo: "/images/payment-methods/mastercard-logo.png",
      color: "from-red-500/20 to-orange-500/20 border-red-500/40",
      description: "Accepted worldwide",
      descriptionAr: "مقبولة في جميع أنحاء العالم",
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[hsl(195,80%,50%,0.15)] border border-[hsl(195,80%,70%,0.3)]">
          <CreditCard className="h-5 w-5 text-[hsl(195,80%,70%)]" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          {t("checkout.selectPaymentMethod") || "Select Payment Method"}
        </h2>
      </div>

      <div className="grid gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <Card
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                "p-5 cursor-pointer transition-all duration-300 border-2",
                "bg-white/5 backdrop-blur-sm",
                "hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg",
                isSelected
                  ? `bg-gradient-to-r ${method.color} border-2 shadow-lg scale-[1.02]`
                  : "border-white/10 hover:border-white/20",
                isRTL && "text-right"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Logo */}
                <div
                  className={cn(
                    "w-20 h-16 rounded-xl flex items-center justify-center relative",
                    "bg-white/10 border border-white/20 overflow-hidden",
                    isSelected && "bg-white/20 border-white/40 shadow-lg"
                  )}
                >
                  <img
                    src={method.logo}
                    alt={isRTL ? method.nameAr : method.name}
                    className="h-10 w-auto object-contain max-w-full"
                    onError={(e) => {
                      // Fallback: hide image and show text
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (!target.parentElement?.querySelector('.logo-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'logo-fallback text-lg font-bold text-white';
                        fallback.textContent = method.name.substring(0, 2);
                        target.parentElement?.appendChild(fallback);
                      }
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">
                      {isRTL ? method.nameAr : method.name}
                    </h3>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-white/70">
                    {isRTL ? method.descriptionAr : method.description}
                  </p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected
                      ? "border-green-400 bg-green-400/20"
                      : "border-white/30"
                  )}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedMethod && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {isRTL
              ? `تم اختيار ${paymentMethods.find((m) => m.id === selectedMethod)?.nameAr}`
              : `${paymentMethods.find((m) => m.id === selectedMethod)?.name} selected`}
          </p>
        </div>
      )}
    </div>
  );
};

