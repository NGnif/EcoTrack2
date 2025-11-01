import { LayoutDashboard, PenSquare, History, Lightbulb, Settings, type LucideIcon } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_LINKS: NavLink[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/log',
    label: 'Log Activity',
    icon: PenSquare,
  },
  {
    href: '/history',
    label: 'History',
    icon: History,
  },
  {
    href: '/tips',
    label: 'Tips',
    icon: Lightbulb,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];
