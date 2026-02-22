"use client";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn("page-gradient w-full", className)}>
      {/* Floating decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/8 rounded-full blur-3xl animate-float will-change-transform" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-amber-200/10 rounded-full blur-3xl animate-float-slow will-change-transform" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl animate-float will-change-transform" style={{ animationDelay: '3s' }} />
      </div>
      {children}
    </main>
  );
}
