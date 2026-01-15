"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DataColumn = {
  id?: string;
  // table-specific fields used by the columns below
  road_name?: string;
  iri?: number | string;
  iri_inst?: number | string;
  iri_smartphone?: number | string;
  speed_3?: number | string;
  speed_12?: number | string;
  vert_displacement?: number | string;
  travel_distance?: number | string;
  road_condition?: string;
};

// export const columns: ColumnDef<DataColumn>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//   },
//   {
//     accessorKey: "date_uplodaded",
//     header: "Date Uploaded",
//   },
//   {
//     accessorKey: "total_distance",
//     header: "Total Distance",
//   },
//   {
//     accessorKey: "user",
//     header: "User",
//   },
//   {
//     accessorKey: "road_type",
//     header: "Road Type",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "ave_iri",
//     header: "Average IRI",
//   },
// ];

export const columns: ColumnDef<DataColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "road_name",
    header: "Road Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("road_name")}</div>
    ),
  },
  {
    accessorKey: "iri",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          IRI
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("iri")}</div>
    ),
  },
  {
    accessorKey: "iri_inst",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          IRI Inst
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("iri_inst")}</div>
    ),
  },
  {
    accessorKey: "iri_smartphone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          IRI Smart Phone
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">
        {row.getValue("iri_smartphone")}
      </div>
    ),
  },
  // {
  //   accessorKey: "speed",
  //   header: () => <div className="text-right">Speed</div>,
  //   cell: ({ row }) => {
  //     const ave_speed = parseFloat(row.getValue("speed"));
  //
  //     // Format the amount as a distance
  //     const formatted = new Intl.NumberFormat("en-UK", {
  //       style: "decimal",
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(ave_speed);
  //
  //     return (
  //       <div className="text-right font-medium">
  //         {formatted} km<sup>2</sup>/h
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "speed_3",
    header: () => <div className="text-right">Speed_3</div>,
    cell: ({ row }) => {
      const ave_speed = parseFloat(row.getValue("speed_3"));

      // Format the amount as a distance
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(ave_speed);

      return (
        <div className="text-right font-medium">
          {formatted} km<sup>2</sup>/h
        </div>
      );
    },
  },
  {
    accessorKey: "speed_12",
    header: () => <div className="text-right">Speed_12</div>,
    cell: ({ row }) => {
      const ave_speed = parseFloat(row.getValue("speed_12"));

      // Format the amount as a distance
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(ave_speed);

      return (
        <div className="text-right font-medium">
          {formatted} km<sup>2</sup>/h
        </div>
      );
    },
  },
  {
    accessorKey: "vert_displacement",
    header: () => <div className="text-right">Vertical Displacement</div>,
    cell: ({ row }) => {
      const total_distance = parseFloat(row.getValue("vert_displacement"));

      // Format the amount as a distance
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "unit",
        unit: "kilometer",
      }).format(total_distance);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "travel_distance",
    header: () => <div className="text-right">Travel Distance</div>,
    cell: ({ row }) => {
      const total_distance = parseFloat(row.getValue("travel_distance"));

      // Format the amount as a distance
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "unit",
        unit: "kilometer",
      }).format(total_distance);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "road_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Road Type
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("road_type")}</div>
    ),
  },

  {
    accessorKey: "road_condition",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("road_condition")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const road = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="animate-wiggle" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(road.road_name as string)}
            >
              Copy road name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="animate-wiggle" href={`/dashboard`}>
                View road on dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
