"use client";
// typescript
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { menuItems } from "./data/dropdown_data";
import { ChevronDown } from "lucide-react";

type Props = {
  onSelectionChange?: (menuId: string | number, childId: string | number) => void;
};

export default function Options({ onSelectionChange }: Props) {
  const [selectedOptions, setSelectedOptions] = React.useState<
      Record<string | number, string | number | null>
  >({});

  const handleSelect = (menuId: string | number, childId: string | number) => {
    setSelectedOptions((prev) => {
      const next = { ...prev, [menuId]: childId };
      return next;
    });
    onSelectionChange?.(menuId, childId);
  };

  return (
      <div className="h-fit">
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
                          checked={selectedOptions[menu.id] === child.id}
                          onCheckedChange={() => handleSelect(menu.id, child.id)}
                      >
                        {child.label}
                      </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
          ))}
        </div>

        {/* show selections */}
        <div className="mt-2 border rounded-lg p-4 w-60 bg-muted/20">
          <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
            Selected Items:
          </h3>
          <ul className="text-sm space-y-1">
            {Object.entries(selectedOptions).map(([menuId, childId]) => {
              const found = menuItems
                  .find((m) => m.id.toString() === menuId)
                  ?.children?.find((c) => c.id.toString() === (childId ?? "").toString());
              return (
                  <li key={menuId}>
                    <strong>{menuItems.find((m) => m.id.toString() === menuId)?.label}:</strong>{" "}
                    {found?.label ?? "None"}
                  </li>
              );
            })}
          </ul>
        </div>
      </div>
  );
}
