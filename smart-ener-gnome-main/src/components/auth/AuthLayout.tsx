import type { ReactNode } from "react";
import { Leaf } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Aurora + grid background */}
      <div className="absolute inset-0 grid-eco opacity-40" />
      <div className="absolute inset-0 animate-aurora pointer-events-none" />

      {/* Floating energy particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="animate-float absolute h-1.5 w-1.5 rounded-full bg-primary/60 blur-[1px]"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 8) * 0.7}s`,
              animationDuration: `${5 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        {/* Left brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary animate-pulse-glow">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                EcoMind
              </div>
              <div className="text-base font-semibold text-foreground">
                Smart Infrastructure Platform
              </div>
            </div>
          </div>

          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-semibold leading-tight tracking-tight">
              The neural grid for{" "}
              <span className="text-gradient">smart malls</span> and connected infrastructure.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Real-time energy optimization, predictive maintenance, and AI-driven
              security intelligence — unified into one operations cortex.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { v: "−38%", l: "Energy use" },
                { v: "99.97%", l: "Uptime" },
                { v: "240+", l: "AI signals/s" },
              ].map((s) => (
                <div key={s.l} className="glass-card rounded-xl p-4">
                  <div className="text-2xl font-semibold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} EcoMind. Enterprise infrastructure intelligence.
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* mobile brand */}
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  EcoMind
                </div>
                <div className="text-sm font-semibold">Smart Infrastructure</div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 sm:p-10">
              <div className="mb-8 space-y-2">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
              {children}
            </div>

            {footer && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}