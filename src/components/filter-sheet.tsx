import clsx from "clsx";
import { Search, Xmark } from "iconoir-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const FilterSheet = ({ open, onClose }: Props) => {
  return (
    <div
      className={clsx(
        "bg-[#F3F3F4] rounded-lg p-5 h-fit sticky top-6 transition-all duration-300 min-h-screen z-10",
        open
          ? "translate-x-0 opacity-100"
          : "-translate-x-80 opacity-0 pointer-events-none",
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Filters</h2>

        <button
          onClick={onClose}
          className="cursor-pointer hover:bg-gray-200 p-0.5 rounded-md"
        >
          <Xmark height={20} />
        </button>
      </div>

      <div className="relative w-full">
        <Search
          width={18}
          height={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products..."
          className="h-9 pl-9 pr-3 border border-gray-200 rounded-md text-black outline-none bg-white"
        />
      </div>
    </div>
  );
};

export default FilterSheet;
