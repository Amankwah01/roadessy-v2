import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export default function Home() {
  return (
    <div className="flex items-center h-[90vh] justify-center font-sans dark:bg-black">
      <main className="flex w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="grid w-full h-full items-center gap-3 border rounded-lg p-6">
          <div className="w-full flex flex-col items-center gap-3">
            <Label htmlFor="upload_file">Upload File</Label>
            <ButtonGroup>
              <Input id="upload_file" type="file" />
              <Button variant="outline" aria-label="Upload File">
                <Upload />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </main>
    </div>
  );
}
