"use client";
// typescript
// File: `components/data/data-table-client.tsx`
import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { menuItems } from "./dropdown_data";

/* Local types for the dropdown data */
type MenuChild = {
  id: string | number;
  label: string;
  value?: string | number;
};

type Menu = {
  id: string | number;
  label: string;
  children?: MenuChild[];
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function DataTableClient<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // track multiple selected children per menu (menu.id -> array of child ids)
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string | number, Array<string | number>>
  >({});

  // typed child parameter so child.id / child.value / child.label are available
  const handleSelect = (
    menuId: string | number,
    child: MenuChild,
    checked = true
  ) => {
    setSelectedOptions((prev) => {
      const prevArr = prev[menuId] ?? [];
      let nextArr: Array<string | number>;
      if (checked) {
        // add if not present
        nextArr = prevArr.includes(child.id) ? prevArr : [...prevArr, child.id];
      } else {
        // remove
        nextArr = prevArr.filter((v) => v !== child.id);
      }
      return { ...prev, [menuId]: nextArr };
    });

    // derive filter values from the menu's selected children labels/values
    // we will compute the full selected set for this menu and apply it
    const menuKey = menuId.toString();
    const targetColumnId =
      typeof child.value === "string" && child.value.length > 0
        ? child.value
        : menuToColumnMap[menuKey] ?? menuKey;

    // compute the new selected labels for this menu after applying the change
    const prevSelected = selectedOptions[menuId] ?? [];
    const willBeSelected = checked
      ? Array.from(new Set([...prevSelected, child.id]))
      : prevSelected.filter((v) => v !== child.id);

    // map ids to labels/values for filter comparison
    const labelValues = willBeSelected.map((id) => {
      // try to find the child's label from menuItems
      for (const m of typedMenuItems) {
        if (m.id === menuId && m.children) {
          const found = m.children.find((c) => c.id === id);
          if (found)
            return typeof found.value === "string" && found.value.length > 0
              ? found.value
              : String(found.label);
        }
      }
      return String(id);
    });

    const column = table.getColumn(targetColumnId);
    if (column) {
      // if none selected -> clear filter
      if (!labelValues.length) column.setFilterValue("");
      else if (labelValues.length === 1)
        column.setFilterValue(labelValues[0] as any);
      else column.setFilterValue(labelValues as any);
    }
  };

  // assert the imported menuItems shape to our Menu[] type so mapping is typed
  const typedMenuItems = menuItems as Menu[];

  // central mapping so both the dropdown handler and the input can resolve column ids
  const menuToColumnMap: Record<string, string> = {
    region: "region",
    road_type: "road_type",
    surface_type: "surface_type",
    condition: "road_condition",
  };

  // resolve which column the free-text input should target:
  // prefer the first menu with a selected option, otherwise default to 'road_name'
  const resolveInputTarget = () => {
    for (const m of typedMenuItems) {
      const sel = selectedOptions[m.id];
      if (sel !== null && sel !== undefined) {
        const key = m.id.toString();
        return (menuToColumnMap[key] ?? key) as string;
      }
    }
    return "road_name";
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-x-1 py-4">
        <Input
          placeholder={`Filter ...`}
          value={
            (table
              .getColumn('road_name')
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn('road_name')
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="grid grid-cols-6 gap-x-4 w-full">
          {typedMenuItems.map((menu) => (
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
                    checked={selectedOptions[menu.id]?.includes(child.id) ?? false}
                    onCheckedChange={(checked) =>
                      handleSelect(menu.id, child, !!checked)
                    }
                  >
                    {child.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
