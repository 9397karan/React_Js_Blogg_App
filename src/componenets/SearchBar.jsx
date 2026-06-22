import { Search } from "lucide-react";

export default function SearchBar() {
  return (

    <div className="flex justify-center mt-10">

      <label className="input input-bordered flex items-center gap-2 w-full max-w-xl">

        <Search size={18}/>

        <input
          type="text"
          className="grow"
          placeholder="Search blogs..."
        />

      </label>

    </div>

  );
}