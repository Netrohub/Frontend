import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme="dark"
      position="top-center"
      className="toaster group"
      style={{
        width: '100%',
        maxWidth: '100%',
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-[hsl(220,30%,12%)] group-[.toaster]:via-[hsl(220,30%,15%)] group-[.toaster]:to-[hsl(220,30%,12%)] group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/20 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-xl group-[.toaster]:p-5 group-[.toaster]:w-full group-[.toaster]:max-w-[896px] group-[.toaster]:mx-auto group-[.toaster]:ring-1 group-[.toaster]:ring-white/10 group-[.toaster]:dir-rtl",
          description: "group-[.toast]:text-white/80 group-[.toast]:text-sm group-[.toast]:mt-2 group-[.toast]:leading-relaxed",
          title: "group-[.toast]:text-white group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:mb-1",
          actionButton: 
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-[hsl(200,85%,55%)] group-[.toast]:to-[hsl(200,90%,65%)] group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:px-5 group-[.toast]:py-2.5 group-[.toast]:rounded-lg group-[.toast]:hover:from-[hsl(200,85%,60%)] group-[.toast]:hover:to-[hsl(200,90%,70%)] group-[.toast]:transition-all group-[.toast]:shadow-lg group-[.toast]:shadow-[hsl(200,85%,55%)]/30 group-[.toast]:hover:shadow-xl group-[.toast]:hover:shadow-[hsl(200,85%,55%)]/40 group-[.toast]:hover:scale-105",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white/70 group-[.toast]:hover:bg-white/20",
          closeButton: "group-[.toast]:text-white/60 group-[.toast]:hover:text-white group-[.toast]:hover:bg-white/10 group-[.toast]:rounded-lg group-[.toast]:transition-all",
          icon: "group-[.toast]:text-[hsl(200,85%,55%)] group-[.toast]:mr-3",
        },
        style: {
          background: "linear-gradient(135deg, hsl(220,30%,12%) 0%, hsl(220,30%,15%) 50%, hsl(220,30%,12%) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "0.75rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 30px rgba(200, 85%, 55%, 0.1)",
          direction: "rtl",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
