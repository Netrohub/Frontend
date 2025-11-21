import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { kycApi } from "@/lib/api";
import { toast } from "sonner";
import type { KycStartResponse } from "@/types/api";

declare global {
  interface Window {
    Persona?: any;
  }
}

const PERSONA_TEMPLATE_ID = import.meta.env.VITE_PERSONA_TEMPLATE_ID;
const PERSONA_ENVIRONMENT_ID = import.meta.env.VITE_PERSONA_ENVIRONMENT_ID;

const KYC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const clientRef = useRef<any>(null);

  const startMutation = useMutation<KycStartResponse, Error>({
    mutationFn: () => kycApi.start(),
    onSuccess: (data) => {
      if (!data.session_token) {
        toast.error(t("common.error"));
        return;
      }
      setSessionToken(data.session_token);
      setInquiryId(data.inquiry_id);
    },
    onError: () => {
      toast.error(t("common.error"));
    },
  });

  useEffect(() => {
    if (window.Persona) {
      setSdkLoaded(true);
      return;
    }

    const existing = document.getElementById("persona-sdk") as HTMLScriptElement | null;
    if (existing) {
      const handleLoad = () => {
        setSdkLoaded(true);
        existing.setAttribute("data-loaded", "true");
      };

      if (existing.getAttribute("data-loaded") === "true") {
        setSdkLoaded(true);
        return;
      }

      existing.addEventListener("load", handleLoad);
      return () => existing.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.id = "persona-sdk";
    script.src = "https://cdn.withpersona.com/dist/persona-v5.1.2.js";
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
      script.setAttribute("data-loaded", "true");
    };
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !sessionToken || !inquiryId) {
      return;
    }

    if (!window.Persona) {
      toast.error(t("common.error"));
      return;
    }

    clientRef.current?.close?.();

    const client = new window.Persona.Client({
      templateId: PERSONA_TEMPLATE_ID,
      environmentId: PERSONA_ENVIRONMENT_ID,
      sessionToken,
      inquiryId,
      onReady: () => {
        client.open();
      },
      onComplete: ({ status }: { status: string }) => {
        toast.success(t("kyc.status") + ": " + status);
      },
      onExit: ({ status }: { status: string }) => {
        if (status === "cancelled") {
          toast.info(t("kyc.notStarted"));
        }
      },
    });

    clientRef.current = client;

    return () => {
      client.close?.();
    };
  }, [sdkLoaded, sessionToken, inquiryId, t]);

  const handleStart = () => {
    if (!PERSONA_TEMPLATE_ID || !PERSONA_ENVIRONMENT_ID) {
      toast.error(t("common.error"));
      return;
    }

    startMutation.mutate();
  };

  const statusLabel = user?.kyc_verification?.status
    ? t(`kyc.${user.kyc_verification.status}`)
    : t("kyc.notStarted");

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white">{t("kyc.title")}</h1>
        <p className="text-white/70 mt-1">{t("kyc.subtitle")}</p>
      </div>

      <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-white/70">{t("kyc.status")}</p>
            <p className="text-lg font-semibold text-white">{statusLabel}</p>
          </div>
          <Badge variant="outline" className="text-white/70 border-white/30">
            {user?.is_verified ? t("kyc.verified") : t("kyc.pending")}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            onClick={handleStart}
            disabled={startMutation.isPending || !sdkLoaded}
            className="flex-1 gap-2 bg-[hsl(195,80%,50%)] hover:bg-[hsl(195,80%,60%)] border-transparent text-white"
          >
            {startMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("common.processing")}
              </>
            ) : (
              t("kyc.startVerification")
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white/80">{t("kyc.benefits")}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-white/60">
              <li>{t("kyc.benefit1")}</li>
              <li>{t("kyc.benefit2")}</li>
              <li>{t("kyc.benefit3")}</li>
              <li>{t("kyc.benefit4")}</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white/80">{t("kyc.requiredDocs")}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-white/60">
              <li>{t("kyc.nationalId")}</li>
              <li>{t("kyc.proofOfAddress")}</li>
              <li>{t("kyc.selfie")}</li>
            </ul>
            {!sdkLoaded && (
              <p className="text-xs text-red-400">
                Persona SDK is still loading. Please wait a moment before starting the verification.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KYC;

