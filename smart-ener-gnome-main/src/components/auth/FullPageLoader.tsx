import { Loader2 } from "lucide-react";

export function FullPageLoader({ label = "Initializing operations console…" }: { label?: string }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 grid-eco opacity-30" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-primary blur-xl opacity-60 animate-pulse-glow" />
          <Loader2 className="relative h-10 w-10 animate-spin text-primary" />
        </div>
        <p className="text-sm text-muted-foreground tracking-wide">{label}</p>
      </div>
    </div>
  );
}