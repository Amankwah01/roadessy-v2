import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from "./ui/item";
import { Badge } from "./ui/badge";
import { info } from "console";

type PriorityItem = {
  road: string;
  info: string;
  status: string;
};

export default function Prioritization({
  priority,
}: {
  priority?: PriorityItem[];
}) {
  const defaultPriority: PriorityItem[] = [
    {
      road: "Road5, Roadessy",
      info: "Urgent: Structural Repair",
      status: "Inspection Needed",
    },
    {
      road: "Road4, Roadessy",
      info: "Dominant: Potholes",
      status: "Reconstruction",
    },
    { road: "Road3, Roadessy", info: "Major Repair", status: "Major Repair" },
    {
      road: "Road2, Roadessy",
      info: "Dominant: Rutting",
      status: "Dominant: Cracking",
    },
    { road: "Road1, Roadessy", info: "IRI: 3.5m/km", status: "Reconstruction" },
  ];

  const items = priority && priority.length ? priority : defaultPriority;

  return (
    <Card className="px-10">
      <CardHeader>
        <CardTitle className="text-xl">
          Top 5 Maintenance Prioritization
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 -mt-6">
        <ItemGroup>
          {items.map((person, index) => (
            <React.Fragment key={person.road}>
              <Item key={person.road}>
                <ItemContent className="gap-1">
                  <ItemTitle className=" text-lg">{person.road}</ItemTitle>
                  <ItemDescription>{person.info}</ItemDescription>
                </ItemContent>
                <ItemActions className="px-8">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Badge
                      variant={
                        ["Reconstruction", "Dominant: Cracking"].includes(
                          person.status
                        )
                          ? "destructive"
                          : "default"
                      }
                      className={
                        person.status === "Major Repair"
                          ? "bg-orange-500 text-white"
                          : ""
                      }
                    >
                      {person.status}
                    </Badge>
                  </Button>
                </ItemActions>
              </Item>
              {index !== items.length - 1 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
