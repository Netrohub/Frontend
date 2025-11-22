import { useCallback, type ReactNode } from "react";
import Persona from "persona";
import { useAuth } from "@/contexts/AuthContext";

type PersonaKycButtonProps = {
  userId?: number | string;
  hasCompletedKyc?: boolean;
  onCompleted?: () => void;
  className?: string;
  children?: ReactNode;
};

export function PersonaKycButton({
  userId,
  hasCompletedKyc,
  onCompleted,
  className,
  children,
}: PersonaKycButtonProps) {
  const { refreshUser } = useAuth();
  const referenceId = userId ? `user_${userId}` : undefined;

  const handleClick = useCallback(() => {
    if (hasCompletedKyc) {
      console.warn("PersonaKycButton: user already verified");
      return;
    }

    if (!userId) {
      console.warn("PersonaKycButton: missing userId, cannot open flow");
      return;
    }

    const templateId = import.meta.env.VITE_PERSONA_TEMPLATE_ID;
    const environmentId = import.meta.env.VITE_PERSONA_ENV_ID;

    if (!templateId || !environmentId) {
      console.error("PersonaKycButton: missing template or environment IDs");
      return;
    }

    let client: Persona.Client | null = null;

    const destroyClient = () => {
      client?.destroy();
      client = null;
    };

    client = new Persona.Client({
      templateId,
      environmentId,
      referenceId,
      onReady: () => client?.open(),
      onComplete: async ({ inquiryId, status }) => {
        let completedSuccessfully = false;

        try {
          // Import and use the API client
          const { kycApi } = await import('@/lib/api');
          
          const data = await kycApi.complete({ inquiryId, status, userId });
          console.log("PersonaKycButton: KYC completion response", data);
          
          completedSuccessfully = true;
          
          // Refresh user data to get latest KYC status
          try {
            await refreshUser();
            console.log("PersonaKycButton: User data refreshed");
          } catch (error) {
            console.error("PersonaKycButton: Failed to refresh user", error);
          }
          
          // Trigger user refresh if callback provided
          if (onCompleted) {
            // Small delay to allow webhook to process
            setTimeout(() => {
              onCompleted();
            }, 2000);
          }
        } catch (error) {
          console.error("PersonaKycButton: failed to report completion", error);
        } finally {
          destroyClient();
        }

        if (completedSuccessfully && !onCompleted) {
          // If no callback, at least log success
          console.log("PersonaKycButton: KYC completion reported successfully");
        }
      },
      onCancel: () => {
        destroyClient();
      },
      onError: (err) => {
        console.error("PersonaKycButton: Persona error", err);
        destroyClient();
      },
    });
  }, [userId, hasCompletedKyc, onCompleted, referenceId]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      disabled={!userId || Boolean(hasCompletedKyc)}
    >
      {children ?? "Verify identity"}
    </button>
  );
}

