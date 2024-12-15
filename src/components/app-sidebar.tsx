// src/components/app-sidebar.tsx
import * as React from "react"
import { Link, useLocation } from 'react-router-dom'


import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DAS_METHODS } from '@/lib/das-types'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  // Group DAS methods by category if needed
  const groupedMethods = [
    {
      title: "DAS API Methods",
      items: DAS_METHODS.map(method => ({
        title: method.name,
        url: method.path,
        isActive: location.pathname === method.path
      }))
    }
  ]

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={["v1.0.0"]}
          defaultVersion="v1.0.0"
        />

      </SidebarHeader>
      <SidebarContent>
        {groupedMethods.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.isActive}
                      className="w-full"
                    >
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
