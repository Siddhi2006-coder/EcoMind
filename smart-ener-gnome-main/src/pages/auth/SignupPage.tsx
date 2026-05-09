import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordStrength, passwordScore } from "@/components/auth/PasswordStrength";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, type AppRole } from "@/auth/roles";
import { Loader2, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from "lucide-react";

const SIGNUP_ROLES: AppRole[] = ROLES.filter((r) => r !== "admin");

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<AppRole>("demo_viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError("Passwords don't match");
    if (passwordScore(password) < 2) return setError("Choose a stronger password");
    setLoading(true);
    try {
      await signUp({ email, password, fullName, role });
      setDone(true);
      setTimeout(() => navigate("/login", { replace: true }), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthLayout title="Account provisioned" subtitle="Routing you to the operations console…">
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircle2 className="h-12 w-12 text-success animate-pulse-glow" />
          <p className="text-sm text-muted-foreground">Welcome to EcoMind.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Request access"
      subtitle="Provision an EcoMind operator account."
      footer={
        <>
          Already onboarded?{" "}
          <Link to="/login" className="text-primary hover:text-accent transition">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Avery Chen"
              className="pl-9 h-11 bg-input/60"
            />
          </div>
        </div>

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
              placeholder="operator@ecomind.io"
              className="pl-9 h-11 bg-input/60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Operational role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
            <SelectTrigger className="h-11 bg-input/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIGNUP_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  <div className="flex flex-col">
                    <span>{ROLE_LABELS[r]}</span>
                    <span className="text-xs text-muted-foreground">
                      {ROLE_DESCRIPTIONS[r]}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="pl-9 h-11 bg-input/60"
            />
          </div>
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pl-9 h-11 bg-input/60"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-gradient-primary text-primary-foreground glow-primary font-medium"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
