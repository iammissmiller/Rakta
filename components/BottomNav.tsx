"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  MessageCircle,
  BookOpen,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/tracker", icon: Calendar, label: "Track" },
  { path: "/saheli", icon: MessageCircle, label: "Saheli" },
  { path: "/learn", icon: BookOpen, label: "Learn" },
  { path: "/family", icon: Users, label: "Family" },
];

/** Mobile bottom bar — hidden on desktop */
export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around border-t border-crimson/10 bg-background/95 backdrop-blur-sm py-2 pb-5 md:hidden">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
        const isActive = pathname === path;
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            aria-label={label}
            className="flex flex-1 flex-col items-center gap-1 py-1"
          >
            <Icon
              size={22}
              color={isActive ? "#B8000A" : "#9A7A60"}
              strokeWidth={2}
            />
            {isActive && <div className="h-1 w-1 rounded-full bg-crimson" />}
          </button>
        );
      })}
    </nav>
  );
}

/** Desktop sidebar — hidden on mobile */
export function SideNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="hidden md:flex sticky top-0 h-screen w-14 shrink-0 flex-col items-center justify-between py-7"
      style={{ background: "linear-gradient(180deg, #B8000A 0%, #880008 100%)" }}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-1">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              aria-label={label}
              title={label}
              className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] transition-colors ${
                isActive
                  ? "bg-white/22 text-white"
                  : "text-white/45 hover:bg-white/10 hover:text-white/85"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => router.push("/settings")}
          aria-label="Settings"
          title="Settings"
          className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] transition-colors ${
            pathname === "/settings"
              ? "bg-white/22 text-white"
              : "text-white/45 hover:bg-white/10 hover:text-white/85"
          }`}
        >
          <Settings size={18} strokeWidth={2} />
        </button>
      </div>
    </nav>
  );
}