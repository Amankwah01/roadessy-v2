import { ProgressBar } from "./progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function RoadStats() {

   const content: { title: string; value: number }[] = [
     {
       title: "Total Roads",
       value: 1250,
     },
     {
       title: "Total Road Segments",
       value: 3400,
     },
     {
       title: "Inspections Completed",
       value: 2750,
     },
     {
       title: "Roads Needing Attention",
       value: 150,
     },
     {
       title: "Average PCI Score",
       value: 85,
     },
   ];
  const totalRoads = content.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card className="w-full mb-4 h-full">
      <CardHeader>
        <CardTitle className="text-xl">Network Stats</CardTitle>
        {/* <CardDescription>{item.description}</CardDescription>
            <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent className="flex flex-col gap-y-8 -mt-4">
        {content.map((item) => {
          const fill = Math.min(
            Math.max((item.value / totalRoads) * 100, 0),
            100
          );
          return (
            <div className="" key={item.title}>
              <p className="text-xl flex">
                {item.title} {fill.toFixed(2)}%
              </p>
              <p className="text-lg ">
                {item.value}/{totalRoads}
              </p>
              <ProgressBar progressValue={fill} />
            </div>
          );
        })}
      </CardContent>
      {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
    </Card>
  );
}

 