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

const priority = [
  {
    road: "Road5, Roadessy",
    // avatar: "https://github.com/evilrabbit.png",
    info: "Urgent: Structural Repair",
    status: "Inspection Needed",
  },
  {
    road: "Road4, Roadessy",
    // avatar: "https://github.com/evilrabbit.png",
    info: "Dominant: Potholes",
    status: "Reconstruction",
  },
  {
    road: "Road3, Roadessy",
    // avatar: "https://github.com/shadcn.png",
    info: "Major Repair",
    status: "Major Repair",
  },
  {
    road: "Road2, Roadessy",
    // avatar: "https://github.com/maxleiter.png",
    info: "Dominant: Rutting",
    status: "Dominant: Cracking",
  },
  {
    road: "Road1, Roadessy",
    // avatar: "https://github.com/evilrabbit.png",
    info: "IRI: 3.5m/km",
    status: "Reconstruction",
  },
];

export default function Prioritization() {
  return (
    <Card className="px-10">
      <CardHeader>
        <CardTitle className="text-xl">
          Top 5 Maintenance Prioritization
        </CardTitle>
        {/* <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-2 -mt-6">
        <ItemGroup>
          {priority.map((person, index) => (
            <React.Fragment key={person.road}>
              <Item key={person.road}>
                {/* <ItemMedia>
                  <Avatar>
                    <AvatarImage src={person.avatar} className="grayscale" />
                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia> */}
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
              {index !== priority.length - 1 && <ItemSeparator />}
            </React.Fragment>
          ))}
        </ItemGroup>
      </CardContent>
      {/* <CardFooter>
              <Button>Save changes</Button>
            </CardFooter> */}
    </Card>
  );
}
