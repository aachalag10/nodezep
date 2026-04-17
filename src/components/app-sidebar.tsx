"use client";

import {
  CreditCardIcon,
  FolderOpen,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./ui/sidebar";
import { title } from "process";
import { ur } from "zod/v4/locales";
import { group } from "console";

const menuItems = [
  {
    title: "Workflows",
    items: [
      {
        title: "All Workflows",
        icon: FolderOpen,
        url: "/workflows",
      },
    ],
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              {" "}
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={false}
                    asChild
                    className="gap-x-4 h-10 px-4"
                  >
                    <Link href={item.url} prefetch>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
