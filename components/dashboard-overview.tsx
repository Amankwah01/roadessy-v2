import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function OverviewDashboard() {
  const content: { title: string; value: number }[] = [
    {
      title: "Total Roads",
      value: 1250
      
    },
    {
      title: "Total Road Segments",
      value: 3400
    },
    {
      title: "Inspections Completed",
      value: 2750
    },
    {
      title: "Roads Needing Attention",
      value: 150
    },
    {
      title: "Average PCI Score",
      value: 85
    },
    // {
    //   title: "Tooltip",
    //   value: 85
    // },
  ];
  return (
    <div className="w-full flex gap-x-2">
      {content.map((item) => (
        <Card key={item.title} className="w-full mb-2">
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            {/* <CardDescription>{item.description}</CardDescription>
            <CardAction>Card Action</CardAction> */}
          </CardHeader>
          <CardContent className="-mt-5">
            <p>{item.value}</p>
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}
