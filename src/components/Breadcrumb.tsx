import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav className={cn("flex items-center gap-2 text-sm mb-6", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-white/60 hover:text-[hsl(195,80%,70%)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-white font-medium" : "text-white/60"}>
                {item.label}
              </span>
            )}
            
            {!isLast && (
              <ChevronLeft className="h-4 w-4 text-white/40 rotate-180" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

