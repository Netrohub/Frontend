import { useEffect, useRef } from "react";

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

      const client = new window.Persona.Client({
        templateId: TEMPLATE_ID,
        environmentId: ENVIRONMENT_ID,
        onReady: () => {
          client.open();
        },
        onComplete: ({ inquiryId, status, fields }: any) => {
          console.log(`Completed inquiry ${inquiryId} with status ${status}`);
          console.log("fields:", fields);
          // TODO: send the inquiryId + status to the backend with your API
        },
      });

      clientRef.current = client;
    };

    document.body.appendChild(script);

    return () => {
      clientRef.current?.close?.();
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading verification flow…</p>
    </div>
  );
};

export default KycPage;

