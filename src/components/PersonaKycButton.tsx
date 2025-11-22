import { useCallback, type ReactNode } from "react";
import Persona from "persona";

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
          const response = await fetch("/api/kyc/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ inquiryId, status, userId }),
          });

          if (!response.ok) {
            console.error("PersonaKycButton: /api/kyc/complete returned error", response.status, await response.text());
            return;
          }

          completedSuccessfully = true;
        } catch (error) {
          console.error("PersonaKycButton: failed to report completion", error);
        } finally {
          destroyClient();
        }

        if (completedSuccessfully) {
          onCompleted?.();
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

