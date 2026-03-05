import { Menu, Search, ShoppingBag, Bell, User } from "iconoir-react";

const NavBar = () => {
  return (
    <nav className="w-full bg-slate-700 min-h-14 flex justify-between items-center px-4 sm:px-8 text-white flex-wrap gap-2 sm:gap-0">
      <div className="flex items-center">
        <Menu width={24} height={24} className="cursor-pointer" />
      </div>

      <div className="relative w-52 sm:w-105 lg:w-130">
        <Search
          width={18}
          height={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search products..."
          className="w-full h-9 pl-9 pr-3 rounded-md text-black outline-none bg-white"
        />
      </div>

      <div className="flex items-center gap-2.5 sm:gap-5">
        <ShoppingBag width={22} height={22} className="cursor-pointer" />
        <Bell width={22} height={22} className="cursor-pointer" />
        <User width={22} height={22} className="cursor-pointer" />
      </div>
    </nav>
  );
};

export default NavBar;
