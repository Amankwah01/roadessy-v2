"use client";

import {
  Calendar,
  ChartBar,
  Home,
  Inbox,
  InspectIcon,
  LayoutDashboard,
  Map,
  MapIcon,
  MapPinCheck,
  Search,
  Settings,
  Sheet,
  Text,
  Upload,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { SettingsDialog } from "./settings-dialog";
import React from "react";

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}



export function AppSidebar() {
  // Hook MUST be inside the component
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  // Items array also inside so it can access component state
  const items: SidebarItem[] = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Map",
      url: "/map",
      icon: Map,
    },
    {
      title: "Road Segments",
      url: "/road-segments",
      icon: Upload,
    },
    {
      title: "Inspections",
      url: "/inspections",
      icon: InspectIcon,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: Text,
    },
    // {
    //   title: "Analytics",
    //   url: "/analytics",
    //   icon: ChartBar,
    // },
    {
      title: "Upload",
      url: "/upload",
      icon: Upload,
    },
    {
      title: "Settings",
      onClick: () => setSettingsOpen(true),
      url: "#",
      icon: Settings,
    },
  ];

  return (
    <>
      <Sidebar className="border-none shadow-none h-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex text-xl gap-x-2 pt-9 pb-10 justify-center items-center">
              <MapPinCheck className="scale-150" />
              Roadessy
            </SidebarGroupLabel>
            <Separator className="" />
            <SidebarGroupContent>
              <SidebarMenu className="">
                {items.map((item) => (
                  <div key={item.title}>
                    <SidebarMenuItem className="">
                      <SidebarMenuButton
                        asChild
                        className="py-9 px-3 hover:bg-transparent rounded-lg hover:underline hover:underline-offset-4"
                      >
                        <a
                          href={item.url}
                          className="text-[20px]"
                          onClick={item.onClick}
                        >
                          <item.icon className="scale-150" />
                          <span className="">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <Separator />
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
