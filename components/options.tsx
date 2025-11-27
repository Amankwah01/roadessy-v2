"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { menuItems } from "./data/dropdown_data";
import { ChevronDown } from "lucide-react";

export default function Options() {
  const [checkedItems, setCheckedItems] = React.useState<
    Record<string, boolean>
  >({});

  const handleToggle = (key: string | number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="grid grid-cols-6 gap-x-4 w-full">
      {menuItems.map((menu) => (
        <DropdownMenu key={menu.id}>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-between" variant="outline">
              {menu.label}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="col-span-6 w-auto">
            <DropdownMenuLabel>{menu.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {menu.children?.map((child) => (
              <DropdownMenuCheckboxItem
                key={child.id}
                checked={!!checkedItems[child.id]}
                onCheckedChange={() => handleToggle(child.id)}
              >
                {child.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}

      {/* Optional: show selections */}
      {/* <div className="ml-6 border rounded-lg p-4 w-60 bg-muted/20">
        <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
          Selected Items:
        </h3>
        <ul className="text-sm space-y-1">
          {Object.entries(checkedItems)
            .filter(([_, value]) => value)
            .map(([key]) => {
              const found = menuItems
                .flatMap((m) => m.children ?? [])
                .find((c) => c.id.toString() === key);
              return <li key={key}>• {found?.label}</li>;
            })}
        </ul>
      </div>*/}
    </div>
  );
}
