import { useEffect, useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { kycApi } from "@/lib/api";
import type { KycStartResponse } from "@/types/api";

declare global {
  interface Window {
    Persona?: any;
  }
}

const TEMPLATE_ID =
  import.meta.env.VITE_PERSONA_TEMPLATE_ID ?? "itmpl_Gs2293eGGpvnUaRG6a6uMvaXUP95";
const ENVIRONMENT_ID =
  import.meta.env.VITE_PERSONA_ENVIRONMENT_ID ?? "env_DDF3BCje6bnwnowdzgL5DqRxyMjd";

const KycPage = () => {
  const clientRef = useRef<any>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [inquiryId, setInquiryId] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const { user } = useAuth();
  const referenceId = user ? `user_${user.id}` : undefined;

  const startMutation = useMutation<KycStartResponse, Error>({
    mutationFn: () => kycApi.start(),
    onSuccess: (data) => {
      if (!data.session_token || !data.inquiry_id) {
        toast.error("Unable to start verification flow.");
        return;
      }

      setSessionToken(data.session_token);
      setInquiryId(data.inquiry_id);
    },
    onError: () => {
      toast.error("Unable to initiate Persona verification. Try again later.");
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    startMutation.mutate();
  }, [user, startMutation.mutate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.withpersona.com/dist/persona-v5.1.2.js";
    script.integrity =
      "sha384-nuMfOsYXMwp5L13VJicJkSs8tObai/UtHEOg3f7tQuFWU5j6LAewJbjbF5ZkfoDo";
    script.crossOrigin = "anonymous";

    script.onload = () => {
      if (!window.Persona) {
        console.error("Persona SDK not loaded");
        return;
      }

      setSdkLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      clientRef.current?.close?.();
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !sessionToken || !inquiryId || !window.Persona) {
      return;
    }

    clientRef.current?.close?.();

    const client = new window.Persona.Client({
      templateId: TEMPLATE_ID,
      environmentId: ENVIRONMENT_ID,
      sessionToken,
      inquiryId,
      referenceId,
      onReady: () => client.open(),
      onComplete: () => {
        toast.success("Persona verification flow completed.");
      },
    });

    clientRef.current = client;

    return () => {
      client.close?.();
    };
  }, [sdkLoaded, sessionToken, inquiryId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>{startMutation.isPending ? "Preparing verification…" : "Verify your identity…"}</p>
    </div>
  );
};

export default KycPage;

