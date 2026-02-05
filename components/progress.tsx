"use client";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
export function ProgressBar({progressValue}: {progressValue?: number}) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(progressValue || 0), 50);
    return () => clearTimeout(timer);
  }, []);
  return <Progress value={progress} className="w-full" />;
}

export function DefectsBar({ defectsValue }: { defectsValue?: number }) {
  const [defects, setDefects] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => setDefects(defectsValue || 0), 50);
    return () => clearTimeout(timer);
  }, []);
  return <Progress value={defects} className="w-full" />;
}