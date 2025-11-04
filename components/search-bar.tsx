import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider"; // Assuming you'd use a Shadcn slider or similar

export default function SearchBar() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mt-20 mb-25">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
        {/* Rent Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center justify-between">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12v3m0 0v3m0-3h3m-3 0h3m-3 0V9m3 3h3m-3 0H6m-3 0v3m0 0v3m0-3h3m-3 0h3m-3 0V9m3 3h3m-3 0H6"
                  />
                </svg>
                Rent
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rent Option 1</DropdownMenuItem>
            <DropdownMenuItem>Rent Option 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Location Input */}
        <div className="col-span-1 md:col-span-2">
          <Input placeholder="Your desired location goes here" className="w-full" />
        </div>

        {/* House Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center justify-between">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                House
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>House Type 1</DropdownMenuItem>
            <DropdownMenuItem>House Type 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Results and Search Button */}
        <div className="flex flex-col items-end justify-center">
          <span className="font-bold text-2xl">563</span>
          <span className="text-gray-500 text-sm">Results</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mt-4">
        {/* USD Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center justify-between">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 6m-2 4a9 9 0 11-18 0 9 9 0 0118 0zm-5.694 0H12l-3.28 2.049-1.293-1.293 1.01-1.01A5.002 5.002 0 017 12m14 0h-3.28l-1.293-1.293 1.01-1.01C19.008 10.518 19 11.238 19 12"
                  />
                </svg>
                USD
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Currency 1</DropdownMenuItem>
            <DropdownMenuItem>Currency 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Slider */}
        <div className="col-span-1 md:col-span-2 relative">
          <Slider
            defaultValue={[4500, 12000]}
            max={20000}
            step={100}
            className="w-full"
          />
          <div className="absolute top-full left-0 right-0 flex justify-between mt-2 text-sm text-gray-600">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md -translate-y-1/2 ">$ 4,500</span>
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md -translate-y-1/2 ">$ 12,000</span>
          </div>
        </div>

        {/* Rooms Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center justify-between">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                2 Rooms
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>1 Room</DropdownMenuItem>
            <DropdownMenuItem>2 Rooms</DropdownMenuItem>
            <DropdownMenuItem>3 Rooms</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="w-full h-full text-lg">Search</Button>
      </div>
    </div>
  );
}