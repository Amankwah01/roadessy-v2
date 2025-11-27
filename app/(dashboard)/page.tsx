"use client";
import { OverviewDashboard } from "@/components/dashboard-overview";
import { columns } from "@/components/data/columns";
import getData from "@/components/data/data";
import data from "@/components/data/data";
import { DataTable } from "@/components/data/data-table";
import { DefectStats } from "@/components/defects-stats";
import { Map } from "@/components/map-section";
import Prioritization from "@/components/prioritization";
import { RoadStats } from "@/components/road-stats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import React from "react";



export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [cols, setCols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resolvedCols = await columns;
        const resolvedData = await getData();
        if (mounted) {
          setCols(resolvedCols ?? []);
          setData(resolvedData ?? []);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="p-4 flex-col">
      <OverviewDashboard />
      <div className="grid grid-cols-1 md:grid-cols-8 gap-x-3 mt-1">
        <div className="col-span-6">
          <Map />
        </div>
        <div className="col-span-2">
          <RoadStats />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
        <div className="col-span-4 md:col-span-6">
          <DefectStats />
        </div>
        <div className="col-span-4 md:col-span-6">
          <Prioritization />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-3">
        <div className="col-span-4 md:col-span-8">
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Top 5 Maintenance Prioritization
              </CardTitle>
              {/* <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 -mt-6">
              <ItemGroup>
                {priority.map((person, index) => (
                  <React.Fragment key={person.username}>
                    <Item key={person.username}>
                      <ItemMedia>
                        <Avatar>
                          <AvatarImage
                            src={person.avatar}
                            className="grayscale"
                          />
                          <AvatarFallback>
                            {person.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent className="gap-1">
                        <ItemTitle>{person.username}</ItemTitle>
                        <ItemDescription>{person.email}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <PlusIcon />
                        </Button>
                      </ItemActions>
                    </Item>
                    {index !== priority.length - 1 && <ItemSeparator />}
                  </React.Fragment>
                ))}
              </ItemGroup>
            </CardContent>
            {/* <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
