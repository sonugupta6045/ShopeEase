import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Image,
  PlusCircle,
  Users,
  LogOut // Import LogOut icon
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice"; // Import logout action

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "addProduct",
    label: "Add Product",
    path: "/admin/add-product",
    icon: <PlusCircle />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: <Users />, 
  },
  {
    id: "features",
    label: "Feature Images",
    path: "/admin/features",
    icon: <Image />, 
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <Fragment>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            
            {/* Menu Items */}
            <MenuItems setOpen={setOpen} />

            {/* Logout Button (Pushed to bottom) */}
            <div 
              onClick={handleLogout}
              className="mt-auto flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut />
              <span>Logout</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex h-screen">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        
        {/* Menu Items */}
        <MenuItems />

        {/* Logout Button (Pushed to bottom) */}
        <div 
           onClick={handleLogout}
           className="mt-auto flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut />
          <span>Logout</span>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;