import Image from "next/image";
import { Map } from "@/components/map-section2";
import Options from "@/components/options";
export default function Home() {
  return (
    <div className="grid grid-cols-12 px-3 py-1 w-full h-full">
      <div className="z-1000 col-span-12 pt-5">
        <Options />
      </div>
      <div className="col-span-10 h-full md:col-span-12 md:mb-0">
        <Map />
      </div>
    </div>
  );
}
