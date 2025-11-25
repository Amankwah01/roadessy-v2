import { Calendar, ChartBar, Home, Inbox, InspectIcon, LayoutDashboard, Map, MapIcon, MapPinCheck, Search, Settings, Sheet, Text, Upload } from "lucide-react";

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

// Menu items.
const items = [
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
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartBar,
  },

  {
    title: "Upload",
    url: "#",
    icon: Upload,
  },

  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex text-xl gap-x-2 pt-1 items-center">
            <MapPinCheck />
            Roadessy
          </SidebarGroupLabel>
          <Separator className="my-3" />
          <SidebarGroupContent>
            <SidebarMenu className="">
              {items.map((item) => (
                <div key={item.title}>
                  <SidebarMenuItem className="" >
                    <SidebarMenuButton asChild className="py-6">
                      <a href={item.url} className="text-xl">
                        <item.icon />
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
  );
}
