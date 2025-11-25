import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export function SearchInput() {
  return (
    <InputGroup className="focus-within:outline-none focus-within:ring-0 focus-within:shadow-none">
      <InputGroupInput
        className="focus-within:outline-none focus-within:ring-0 focus-within:shadow-none"
        placeholder="Search..."
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  );
}
