"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";



// Destructure 'data' from props
export function OverviewDashboard({ data }: { data: any }) {
  const contentMap = {
    org: { label: "Organisation-wide", title: "Organisation Stats" },
    user: { label: "User-specific", title: "Your Stats" },
    global: { label: "Nationwide", title: "National Stats" },
  };

  const [scope, setScope] = useState<keyof typeof contentMap>("org");

  // If data is null/undefined during fetch, fall back to 0 or defaults
  const statsDisplay = [
    { title: "Total Roads", value: data?.totalRoads ?? 0 },
    { title: "Total Road Segments", value: data?.totalSegments ?? 0 },
    { title: "Inspections Completed", value: data?.inspectionsCompleted ?? 0 },
    { title: "Roads Needing Attention", value: data?.roadsNeeding ?? 0 },
    { title: "Average IRI Score", value: data?.avgIri ?? 0 },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-64 justify-between" variant="outline">
              {contentMap[scope].label}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {Object.entries(contentMap).map(([key, child], index, arr) => (
              <React.Fragment key={key}>
                <DropdownMenuItem
                  onSelect={() => setScope(key as keyof typeof contentMap)}
                  className="cursor-pointer"
                >
                  {child.label}
                </DropdownMenuItem>
                {index !== arr.length - 1 && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <p className="text-2xl font-semibold flex w-full justify-start py-2">
          {contentMap[scope].title}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsDisplay.map((item) => (
            <Card key={item.title} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {item.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
