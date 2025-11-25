import { ProgressBar } from "./progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function DefectStats() {
  const content: { title: string; value: number }[] = [
    {
      title: "Cracking",
      value: 1250,
    },
    {
      title: "Potholes",
      value: 3400,
    },
    {
      title: "Patching",
      value: 2750,
    },
    {
      title: "Rutting",
      value: 150,
    },
    {
      title: "Other Minor Defects",
      value: 85,
    },
  ];
  const totalRoads = content.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card className="w-full mb-4 h-full">
      <CardHeader>
        <CardTitle className="text-xl">Defects Stats</CardTitle>
        {/* <CardDescription>{item.description}</CardDescription>
            <CardAction>Card Action</CardAction> */}
      </CardHeader>
      <CardContent className="grid grid-cols-5 gap-x-4 -mt-7">
        {content.map((item) => {
          const fill = Math.min(
            Math.max((item.value / totalRoads) * 100, 0),
            100
          );
          return (
            <div className=" flex flex-col p-2" key={item.title}>
              <p className="text-xl">{item.title}</p>
              <p className="text-lg font-mono">
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
