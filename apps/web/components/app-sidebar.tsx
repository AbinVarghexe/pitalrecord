'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  IconHome,
  IconUsers,
  IconFileText,
  IconPrescription,
  IconPill,
  IconStethoscope,
  IconSearch,
  IconBell,
  IconSettings,
  IconHelpCircle,
  IconLogout,
  IconChevronDown,
  IconTimeline,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@workspace/ui/components/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import { useAuth } from '@/components/auth-provider'
import { signOut } from '@/lib/auth/actions'
import { cn } from '@workspace/ui/lib/utils'
import React, { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChildNavItem {
  title: string
  href: string
  icon: React.ElementType
}

interface NavItemDef {
  title: string
  href?: string
  icon: React.ElementType
  exact?: boolean
  children?: ChildNavItem[]
}

// ─── Nav Definitions ─────────────────────────────────────────────────────────

const mainNavItems: NavItemDef[] = [
  { title: 'Dashboard',       href: '/dashboard',              icon: IconHome,            exact: true },
  {
    title: 'My Records',
    icon: IconFileText,
    children: [
      { title: 'Timeline',      href: '/dashboard/timeline',      icon: IconTimeline },
      { title: 'Prescriptions', href: '/dashboard/prescriptions', icon: IconPrescription },
      { title: 'Medicines',     href: '/dashboard/medicines',     icon: IconPill },
    ],
  },
  { title: 'Family Profiles', href: '/dashboard/profiles',      icon: IconUsers },
  { title: 'Doctor Access',   href: '/dashboard/access',        icon: IconStethoscope },
  { title: 'Notifications',   href: '/dashboard/notifications', icon: IconBell },
]

const bottomNavItems: NavItemDef[] = [
  { title: 'Settings',       href: '/dashboard/settings', icon: IconSettings },
  { title: 'Help & Support', href: '/dashboard/help',     icon: IconHelpCircle },
]

// ─── Sub Nav Item ─────────────────────────────────────────────────────────────

function SubNavItem({ item, pathname }: { item: ChildNavItem; pathname: string }) {
  const isActive = pathname === item.href
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={isActive}
        className={cn(
          'h-9 rounded-xl text-[13px] font-medium transition-all duration-200 relative overflow-hidden',
          isActive
            ? 'text-black! border border-slate-300/50 shadow-sm'
            : 'text-black/70 hover:text-black hover:bg-slate-100/50'
        )}
      >
        <Link href={item.href} className="flex items-center gap-2 pl-6 relative z-10">
          {isActive && (
            <div
              className="absolute inset-0 z-[-1] opacity-90 mix-blend-multiply"
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                backgroundColor: '#e2ddd3'
              }}
            />
          )}
          <item.icon
            className={cn(
              'shrink-0 size-5 transition-colors',
              isActive ? 'text-blue-600' : 'text-black'
            )}
            stroke={isActive ? 2 : 1.5}
          />
          <span className={cn(isActive && "text-black")}>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({
  item,
  pathname,
  collapsed,
  defaultOpen,
}: {
  item: NavItemDef
  pathname: string
  collapsed: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  const isActive = item.href
    ? item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href)
    : item.children?.some((c) => pathname.startsWith(c.href)) ?? false

  const buttonBase = cn(
    'h-12 rounded-xl font-medium text-[14px] px-3 transition-all duration-200 group w-full relative overflow-hidden',
    isActive
      ? 'text-black! border border-slate-300/50 shadow-sm'
      : 'text-black/80 hover:text-black hover:bg-slate-100/50',
    collapsed && 'justify-center px-0 flex items-center mx-auto'
  )

  if (item.children) {
    return (
      <SidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              onClick={() => !collapsed && setOpen((p) => !p)}
              className={buttonBase}
            >
              {isActive && (
                <div
                  className="absolute inset-0 z-[-1] opacity-90 mix-blend-multiply"
                  style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                    backgroundColor: '#e2ddd3'
                  }}
                />
              )}
              <item.icon
                className={cn(
                  'shrink-0 transition-colors',
                  collapsed ? 'size-[32px]' : 'size-[26px]',
                  isActive ? 'text-blue-600' : 'text-black'
                )}
                stroke={isActive ? 2.2 : 1.5}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left ml-1">{item.title}</span>
                  <IconChevronDown
                    className={cn(
                      'size-3.5 text-slate-400 transition-transform duration-300',
                      open && 'rotate-180'
                    )}
                    stroke={1.5}
                  />
                </>
              )}
            </SidebarMenuButton>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="font-medium text-sm">
              {item.title}
            </TooltipContent>
          )}
        </Tooltip>

        {!collapsed && (
          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ maxHeight: open ? `${item.children.length * 44 + 8}px` : '0px' }}
          >
            <SidebarMenuSub className="ml-2 mt-0.5 border-l border-blue-100 pl-0">
              {item.children.map((child) => (
                <SubNavItem key={child.href} item={child} pathname={pathname} />
              ))}
            </SidebarMenuSub>
          </div>
        )}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton asChild isActive={isActive} className={buttonBase}>
            <Link href={item.href!} className={cn('flex items-center gap-3 relative z-10 w-full', collapsed && 'justify-center')}>
              {isActive && (
                <div
                  className="absolute inset-0 z-[-1] opacity-90 mix-blend-multiply"
                  style={{
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                    backgroundColor: '#e2ddd3'
                  }}
                />
              )}
              <item.icon
                className={cn(
                  'shrink-0 transition-colors',
                  collapsed ? 'size-[32px]' : 'size-[26px]',
                  isActive ? 'text-blue-600' : 'text-black'
                )}
                stroke={isActive ? 2.2 : 1.5}
              />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          </SidebarMenuButton>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="font-medium text-sm">
            {item.title}
          </TooltipContent>
        )}
      </Tooltip>
    </SidebarMenuItem>
  )
}

// ─── Root Sidebar Component ───────────────────────────────────────────────────

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U'
  const userName = user?.user_metadata?.full_name || 'Authorized User'

  const hasRecordsChild =
    mainNavItems
      .find((i) => i.title === 'My Records')
      ?.children?.some((c) => pathname.startsWith(c.href)) ?? false

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="font-sans border-r-0"
      style={{
        background: 'transparent',
      }}
    >


      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <SidebarHeader className="relative z-10 pt-5 pb-4 border-b border-slate-200/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/dashboard"
              className={cn('flex items-center gap-3 px-2 py-1', collapsed && 'justify-center')}
            >
              <div className="shrink-0 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                <Image
                  src="/images/Logo.png"
                  alt="PITALRECORD Logo"
                  width={22}
                  height={22}
                  className="rounded-lg"
                />
              </div>
              {!collapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-sm text-slate-900 tracking-tight leading-none">
                    PTIALRECORD
                  </span>
                  <span className="text-[9px] font-medium text-blue-500/70 uppercase tracking-[0.25em] leading-none mt-1.5">
                    Clinical Layer
                  </span>
                </div>
              )}
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <SidebarContent className="relative z-10 px-2 py-3 scrollbar-none">
        {/* Primary Nav */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400 px-2 pb-2 pt-0">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNavItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  defaultOpen={item.title === 'My Records' && hasRecordsChild}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="my-2 mx-2 border-t border-slate-200/60" />

        {/* Account Nav */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400 px-2 pb-2 pt-0">
              Account
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {bottomNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            'h-12 rounded-xl font-medium text-[14px] px-3 transition-all duration-200 group relative overflow-hidden',
                            isActive
                              ? 'text-black! border border-slate-300/50 shadow-sm'
                              : 'text-black/80 hover:text-black hover:bg-slate-100/50',
                            collapsed && 'justify-center px-0 flex items-center mx-auto'
                          )}
                        >
                          <Link
                            href={item.href!}
                            className={cn('flex items-center gap-3 relative z-10 w-full', collapsed && 'justify-center')}
                          >
                            {isActive && (
                              <div
                                className="absolute inset-0 z-[-1] opacity-90 mix-blend-multiply"
                                style={{
                                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                                  backgroundColor: '#e2ddd3'
                                }}
                              />
                            )}
                            <item.icon
                              className={cn(
                                'shrink-0 transition-colors',
                                collapsed ? 'size-[32px]' : 'size-[26px]',
                                isActive ? 'text-blue-600' : 'text-black'
                              )}
                              stroke={isActive ? 2.2 : 1.5}
                            />
                            {!collapsed && <span>{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="font-medium text-sm">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                )
              })}

              {/* Logout */}
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => signOut()}
                      className={cn(
                        'h-10 rounded-xl font-medium text-[14px] px-3 transition-all duration-200 group cursor-pointer',
                        'text-black hover:text-red-600 hover:bg-red-50',
                        collapsed && 'justify-center px-0 mx-auto'
                      )}
                    >
                      <IconLogout
                        className={cn("shrink-0 transition-colors group-hover:text-red-500", collapsed ? "size-[26px]" : "size-[22px]")}
                        stroke={1.5}
                      />
                      {!collapsed && <span className="ml-1">Logout</span>}
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="font-medium text-sm">
                      Logout
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <SidebarFooter className="relative z-10 p-3 border-t border-slate-200/60">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50/50 border border-blue-200/50 flex items-center justify-center text-[11px] font-medium text-blue-600 shadow-sm cursor-default select-none mx-auto">
                  {userInitials}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium text-sm">
              {userName}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/80 border border-slate-200/60 shadow-sm">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[11px] font-medium text-blue-600">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-900 truncate leading-tight">{userName}</p>
              <p className="text-[10px] text-blue-500/70 font-medium uppercase tracking-widest mt-0.5">
                Session Active
              </p>
            </div>
            <div className="w-2 h-2 shrink-0 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)] animate-pulse" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
