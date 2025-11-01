'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { NAV_LINKS } from '@/lib/constants';
import { useAuth } from '@/lib/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { SheetClose } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  }

  return (
    <>
    <div className="md:hidden flex items-center justify-between p-2 border-b">
       <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="https://picsum.photos/seed/logo/100/100" alt="EcoTrack Logo" width={32} height={32} className="rounded-lg" data-ai-hint="leaf logo" />
          <span className="font-bold text-lg text-primary">EcoTrack</span>
        </Link>
      <SidebarTrigger />
    </div>
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="https://picsum.photos/seed/logo/100/100" alt="EcoTrack Logo" width={32} height={32} className="rounded-lg" data-ai-hint="leaf logo" />
          <span className="font-bold text-xl text-primary group-data-[collapsible=icon]:hidden">EcoTrack</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {NAV_LINKS.map((link) => (
            <SidebarMenuItem key={link.href}>
              {isMobile ? (
                <SheetClose asChild>
                  <Link href={link.href} passHref>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(link.href)}
                      tooltip={link.label}
                      className="justify-start"
                      onClick={() => setOpenMobile(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SheetClose>
              ) : (
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(link.href)}
                    tooltip={link.label}
                    className="justify-start"
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full p-2 h-auto">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
    </>
  );
}
