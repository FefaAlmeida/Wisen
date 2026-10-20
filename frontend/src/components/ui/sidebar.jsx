"use client"

import {
  Home,
  Search,
  Newspaper,
  Bookmark,
  GraduationCap,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Início",
    icon: Home,
  },
  {
    title: "Explorar",
    icon: Search,
  },
  {
    title: "Notícias",
    icon: Newspaper,
    active: true,
  },
  {
    title: "Conceitos",
    icon: Bookmark,
  },
  {
    title: "Aprendizado",
    icon: GraduationCap,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="none">

      {/* LOGO */}
      <SidebarHeader>
        <div className="text-xl font-bold text-white">
          Wisen
          <span className="text-[9px] align-top">
            ®
          </span>
        </div>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>

              {items.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem
                    key={item.title}
                  >
                    <SidebarMenuButton
                      isActive={item.active}
                      tooltip={item.title}
                    >
                      <Icon />
                      <span>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* CONFIGURAÇÕES */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Configurações"
            >
              <Settings />
              <span>
                Configurações
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  )
}