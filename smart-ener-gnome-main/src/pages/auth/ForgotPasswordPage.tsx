import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll email you a secure recovery link."
      footer={
        <Link to="/login" className="text-primary hover:text-accent transition">
          ← Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="text-foreground font-medium">{email}</span>,
            a recovery link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-11 bg-input/60"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-primary text-primary-foreground glow-primary font-medium"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send recovery link"}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
