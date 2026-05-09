import { useAuth } from "@/providers/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, ShieldCheck, User as UserIcon } from "lucide-react";
import { ROLE_LABELS } from "@/auth/roles";
import { useNavigate } from "react-router-dom";

export function UserMenu() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const initials =
    (user.user_metadata?.full_name as string | undefined)
      ?.split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-3 rounded-full glass px-2 py-1.5 pr-4 hover:bg-primary/10 transition">
        <Avatar className="h-8 w-8 ring-2 ring-primary/40">
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-xs font-medium text-foreground truncate max-w-[140px]">
            {(user.user_metadata?.full_name as string | undefined) ?? user.email}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-primary">
            {role ? ROLE_LABELS[role] : "—"}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 glass-card">
        <DropdownMenuLabel className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>{role ? ROLE_LABELS[role] : "No role assigned"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <UserIcon className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Settings className="h-4 w-4" /> Account settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={async () => {
            await signOut();
            navigate("/login", { replace: true });
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
