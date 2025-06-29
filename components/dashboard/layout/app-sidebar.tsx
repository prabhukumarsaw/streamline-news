'use client';
import React from 'react';
import {
  BarChart3,
  FileText,
  FolderOpen,
  Home,
  MessageSquare,
  Settings,
  Tags,
  Users,
  Calendar,
  ImageIcon,
  LogOut,
  User,
  Ghost,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

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
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define roles
const ROLES = {
  SUPER_ADMIN: ['super_admin', 'Super Administrator'],
  EDITOR: ['editor', 'Editor'],
  AUTHOR: ['author', 'Author'],
};

// Menu config per role
const MENU_CONFIG = [
  {
    title: 'Dashboard',
    url: '/dashboard/workbench',
    icon: Home,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR, ...ROLES.AUTHOR],
  },
  {
    title: 'Content',
    url: '/dashboard/workbench/content',
    icon: FileText,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR, ...ROLES.AUTHOR],
  },
  {
    title: 'Content Editor',
    url: '/dashboard/workbench/content/editor',
    icon: FileText,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Media Library',
    url: '/dashboard/workbench/media',
    icon: ImageIcon,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Comments',
    url: '/dashboard/workbench/comments',
    icon: MessageSquare,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Users',
    url: '/dashboard/workbench/users',
    icon: Users,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Categories',
    url: '/dashboard/workbench/categories',
    icon: FolderOpen,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Tags',
    url: '/dashboard/workbench/tags',
    icon: Tags,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Analytics',
    url: '/dashboard/workbench/analytics',
    icon: BarChart3,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Editorial Calendar',
    url: '/dashboard/workbench/editorial',
    icon: Calendar,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR],
  },
  {
    title: 'Settings',
    url: '/dashboard/workbench/settings',
    icon: Settings,
    roles: [...ROLES.SUPER_ADMIN, ...ROLES.EDITOR, ...ROLES.AUTHOR],
  },
];

interface AppSidebarProps {
  userRole: string;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  // Only show menu items allowed for this role
  const filteredMenu = MENU_CONFIG.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">News CMS</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <SidebarMenuButton
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
