'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  IconHome, 
  IconUsers, 
  IconPrescription, 
  IconKey, 
  IconTimeline, 
  IconSettings,
  IconChevronDown, 
  IconLogout,
  IconPlus,
  IconArchive
} from '@tabler/icons-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@workspace/ui/components/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { useAuth } from '@/components/auth-provider'
import { signOut } from '@/lib/auth/actions'
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: IconHome,
  },
  {
    title: 'Profiles',
    href: '/dashboard/profiles',
    icon: IconUsers,
  },
  {
    title: 'Archives',
    href: '/dashboard/prescriptions',
    icon: IconArchive,
  },
  {
    title: 'Medical Keys',
    href: '/dashboard/access',
    icon: IconKey,
  },
  {
    title: 'History',
    href: '/dashboard/timeline',
    icon: IconTimeline,
  },
]

const secondaryNavItems = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: IconSettings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'U'

  return (
    <Sidebar variant="inset" className="border-r border-slate-200/40 bg-[#fcfbf8]/50 overflow-hidden font-sans">
      <SidebarHeader className="pt-8 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="flex items-center gap-3 px-4">
              <div className="relative z-10 scale-110">
                <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                  <Image 
                    src="/images/Logo.png" 
                    alt="PITALRECORD Logo" 
                    width={22} 
                    height={22} 
                    className="rounded-lg grayscale opacity-60 contrast-125"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-900 tracking-tight">PTIALRECORD</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">Clinical Layer</span>
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 px-4 py-6">
            Core Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "h-11 rounded-2xl transition-all font-semibold text-[13px] px-4",
                      pathname === item.href 
                        ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-blue-600 border border-slate-100" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("size-4.5 transition-colors", pathname === item.href ? "text-blue-600" : "text-slate-400")} />
                      <span className="ml-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 px-4 py-6">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="h-11 rounded-2xl font-semibold text-[13px] text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-all px-4"
                >
                  <Link href="/dashboard/profiles/new">
                    <IconPlus className="size-4.5 text-slate-400" />
                    <span className="ml-1">Create Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  className="h-11 rounded-2xl font-semibold text-[13px] text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 transition-all px-4"
                >
                  <Link href="/dashboard/prescriptions/upload">
                    <IconPlus className="size-4.5 text-slate-400" />
                    <span className="ml-1">Upload Archive</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 px-4 py-6">
            Configuration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "h-11 rounded-2xl transition-all font-semibold text-[13px] text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 px-4",
                      pathname === item.href && "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-blue-600 border border-slate-100"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4.5 text-slate-400" />
                      <span className="ml-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-2xl transition-all hover:bg-white data-[state=open]:bg-white data-[state=open]:shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                >
                  <Avatar className="h-9 w-9 rounded-xl border border-slate-100 shadow-sm">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                    <AvatarFallback className="rounded-xl bg-slate-100 text-[11px] font-bold text-slate-400">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight ml-2">
                    <span className="truncate font-bold text-slate-900">
                      {user?.user_metadata?.full_name || 'Authorized User'}
                    </span>
                    <span className="truncate text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Session Active
                    </span>
                  </div>
                  <IconChevronDown className="ml-auto size-3.5 text-slate-300" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100 p-2"
                side="bottom"
                align="end"
                sideOffset={12}
              >
                <DropdownMenuItem asChild className="rounded-xl focus:bg-slate-50">
                  <Link href="/dashboard/settings" className="w-full flex items-center font-medium">
                    <IconSettings className="mr-3 size-4 text-slate-400" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                <DropdownMenuItem onClick={() => signOut()} className="rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700">
                  <div className="w-full flex items-center font-bold">
                    <IconLogout className="mr-3 size-4" />
                    Sign Out
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
