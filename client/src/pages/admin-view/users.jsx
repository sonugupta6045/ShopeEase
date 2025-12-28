import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser, fetchAllUsers, updateUserRole } from "@/store/admin/users-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Edit } from "lucide-react";

function AdminUsers() {
  const dispatch = useDispatch();
  const { userList, isLoading } = useSelector((state) => state.adminUsers || { userList: [] }); // Fallback if slice not yet registered
  const { toast } = useToast();

  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  function handleEditClick(user) {
    setCurrentUser(user);
    setSelectedRole(user.role);
    setOpenRoleDialog(true);
  }

  function handleUpdateRole() {
    if (!currentUser) return;
    dispatch(updateUserRole({ id: currentUser._id, role: selectedRole })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "User role updated successfully" });
        dispatch(fetchAllUsers());
        setOpenRoleDialog(false);
      }
    });
  }

  function handleDeleteUser(id) {
    // Add a confirm check if needed
    dispatch(deleteUser(id)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "User deleted successfully" });
        dispatch(fetchAllUsers());
      }
    });
  }

  if (isLoading) return <div className="p-10">Loading users...</div>;

  return (
    <div className="w-full bg-white">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-gray-900">Users</h1>
         <p className="text-gray-500">Manage user roles and permissions.</p>
      </div>

      <Card className="shadow-sm border border-gray-100">
        <CardHeader>
            <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                  <th className="py-4 px-4">No.</th>
                  <th className="py-4 px-4">User Email</th>
                  <th className="py-4 px-4">User Name</th>
                  <th className="py-4 px-4">User Role</th>
                  <th className="py-4 px-4 text-center">Edit</th>
                  <th className="py-4 px-4 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {userList && userList.length > 0 ? (
                  userList.map((user, index) => (
                    <tr key={user._id} className="border-b last:border-none border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 text-sm font-bold text-gray-900">{index + 1}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 capitalize">{user.userName}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                          ${user.role === 'admin' 
                            ? 'bg-indigo-100 text-indigo-700' // Purple/Blue for Admin
                            : 'bg-yellow-100 text-yellow-700' // Yellow for User
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-2 hover:bg-gray-100 text-gray-600"
                            onClick={() => handleEditClick(user)}
                        >
                            <Edit className="w-4 h-4" /> 
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </td>
                      <td className="py-4 px-4 text-center">
                         <Button 
                            variant="destructive" 
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 shadow-none"
                            onClick={() => handleDeleteUser(user._id)}
                         >
                            <Trash2 className="w-4 h-4" />
                         </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Management Dialog */}
      <Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Select Role</label>
                <Select 
                    value={selectedRole} 
                    onValueChange={(value) => setSelectedRole(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminUsers;