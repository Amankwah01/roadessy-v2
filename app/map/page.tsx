import Image from "next/image";
import { Map } from "@/components/map-section2";
export default function Home() {
  return (
    <div className="flex p-3 w-full h-full flex-col">
      <Map />
    </div>
  );
}
