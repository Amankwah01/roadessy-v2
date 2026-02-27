"use client";

import { TrendingUp } from "lucide-react";
import { Label, LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a label list";

const chartData = [
  { defects: "potholes", roads: 275, fill: "var(--color-potholes)" },
  { defects: "cracks", roads: 200, fill: "var(--color-cracks)" },
  { defects: "rutting", roads: 187, fill: "var(--color-rutting)" },
  { defects: "raised_edge", roads: 173, fill: "var(--color-raised_edge)" },
  { defects: "other", roads: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  roads: {
    label: "roads",
  },
  potholes: {
    label: "Potholes",
    color: "var(--chart-1)",
  },
  cracks: {
    label: "Cracks",
    color: "var(--chart-2)",
  },
  rutting: {
    label: "Rutting",
    color: "var(--chart-3)",
  },
  raised_edge: {
    label: "Raised Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function AppPieChart_Home() {
  const totalRoads = chartData.reduce((sum, d) => sum + d.roads, 0);

  return (
    <Card className="flex flex-col h-min-[40vh] h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Detection of Road Defects</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[25vh] w-full"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="roads" hideLabel />}
            />
            <Pie
              innerRadius={40}
              strokeWidth={5}
              data={chartData}
              dataKey="roads"
              outerRadius={100}
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="hsla(var(--foreground))"
                  >
                    {payload.roads}
                  </text>
                );
              }}
              fill="var(--color-foreground)"
            >
              <LabelList
                dataKey="defects"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalRoads.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Roads
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total roads for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
