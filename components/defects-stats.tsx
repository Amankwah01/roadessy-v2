import { ProgressBar } from "./progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type DefectItem = { title: string; value: number };

export function DefectStats({ content }: { content?: DefectItem[] }) {
  const defaultContent: DefectItem[] = [
    { title: "Cracking", value: 1250 },
    { title: "Potholes", value: 3400 },
    { title: "Patching", value: 2750 },
    { title: "Rutting", value: 150 },
    { title: "Other Minor Defects", value: 85 },
  ];

  const data = content && content.length ? content : defaultContent;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <Card className="w-full mb-4 h-full px-10">
      <CardHeader>
        <CardTitle className="text-xl">Defects Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-1.5 -mt-7">
        {data.map((item) => {
          const fill = Math.min(Math.max((item.value / total) * 100, 0), 100);
          return (
            <div className="flex flex-col py-2" key={item.title}>
              <p className="text-xl">{item.title}</p>
              <p className="text-lg font-mono">
                {item.value}/{total}
              </p>
              <ProgressBar progressValue={fill} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
