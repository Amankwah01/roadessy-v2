"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BellDot, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { AIAssistantSheet } from "./ai/ai-assistant-sheet";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];
export function Navigation() {
  const isMobile = useIsMobile();
  return (
    <nav className="sticky top-0 overflow-hidden w-full flex justify-end items-center bg-background px-2 gap-x-2 z-0000">
      {/* Right Side */}
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="flex-wrap">
          {/* <NavigationMenuItem className="bg-transparent focus:outline-none focus:ring-0 focus:shadow-none">
            <SearchInput />
          </NavigationMenuItem> */}
          <NavigationMenuItem className="bg-transparent focus:outline-none focus:ring-0 focus:shadow-none">
            <NavigationMenuLink asChild>
              <Link href="/docs">
                <BellDot />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="bg-transparent focus:outline-none focus:ring-0 focus:shadow-none">
            <NavigationMenuLink asChild>
              <Link href="/docs">
                <User />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="bg-transparent focus:outline-none focus:ring-0 focus:shadow-none">
            <ModeToggle />
          </NavigationMenuItem>
          <NavigationMenuItem className="bg-transparent focus:outline-none focus:ring-0 focus:shadow-none">
            <AIAssistantSheet />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
