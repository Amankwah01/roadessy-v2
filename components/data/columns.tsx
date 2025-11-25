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
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  user: string;
  name: string;
  date_uploaded: string;
  total_distance: number;
  road_type: string;
  ave_iri: number;
  ave_speed: number;
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "date_uploaded",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Uploaded
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">
        {row.getValue("date_uploaded")}
      </div>
    ),
  },
  {
    accessorKey: "total_distance",
    header: () => <div className="text-right">Total Distance</div>,
    cell: ({ row }) => {
      const total_distance = parseFloat(row.getValue("total_distance"));

      // Format the amount as a distance
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "unit",
        unit: "kilometer",
      }).format(total_distance);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "ave_iri",
    header: () => <div className="text-right">Average IRI</div>,
    cell: ({ row }) => {
      const ave_iri = parseFloat(row.getValue("ave_iri"));

      // Format the amount as a distance
      const formatted = new Intl.NumberFormat("en-UK", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(ave_iri);

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
      <div className="lowercase">{row.getValue("road_type")}</div>
    ),
  },
  {
    accessorKey: "ave_speed",
    header: () => <div className="text-right">Average Speed</div>,
    cell: ({ row }) => {
      const ave_speed = parseFloat(row.getValue("ave_speed"));

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
    accessorKey: "status",
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
      <div className="lowercase">{row.getValue("status")}</div>
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
              onClick={() => navigator.clipboard.writeText(road.name)}
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
