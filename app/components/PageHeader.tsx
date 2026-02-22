"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: React.ReactNode;
  onBack?: () => void;
  backHref?: string;
  rightSlot?: React.ReactNode;
  showLogo?: boolean;
}

export function PageHeader({ title, onBack, backHref, rightSlot, showLogo }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backHref) router.push(backHref);
  };

  return (
    <header className="sticky top-0 z-10 w-full glass-header">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {(onBack || backHref) ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="glass-button rounded-full h-10 w-10 flex items-center justify-center text-orange-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}

        <h1 className="font-display text-xl md:text-2xl font-bold text-white drop-shadow-md tracking-tight">
          {title}
        </h1>

        {rightSlot ? (
          <div className="flex items-center gap-2">{rightSlot}</div>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </header>
  );
}
