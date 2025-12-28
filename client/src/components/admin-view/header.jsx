import { AlignJustify, User } from "lucide-react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

function AdminHeader({ setOpen }) {
  // Fetch user details from Redux store
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      {/* Container for User Details */}
      <div className="flex flex-1 justify-end">
        <div className="flex items-center gap-2">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{user?.userName || 'Admin'}</p>
              <p className="text-xs text-muted-foreground leading-none mt-1 capitalize">{user?.role || 'admin'}</p>
           </div>
           <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border">
              <User className="h-5 w-5 text-gray-700" />
           </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;