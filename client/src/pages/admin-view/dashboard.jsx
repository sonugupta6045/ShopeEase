import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // --- 1. Compute Metric Data ---
  const totalProducts = productList?.length || 0;
  const totalOrders = orderList?.length || 0;
  const totalSales = orderList?.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0) || 0;
  
  // Calculate distinct users (as a proxy for "All Users")
  const uniqueUsers = new Set(orderList?.map(order => order.userId || order.userEmail)).size;

  // --- 2. Prepare Chart Data ---
  
  // A. Monthly Earnings for Line Chart
  const monthlyEarnings = new Array(12).fill(0);
  orderList?.forEach((order) => {
    const month = new Date(order.orderDate).getMonth(); // 0 = Jan, 11 = Dec
    monthlyEarnings[month] += order.totalAmount;
  });

  const lineChartData = [
    { name: "Jan", sales: monthlyEarnings[0] },
    { name: "Feb", sales: monthlyEarnings[1] },
    { name: "Mar", sales: monthlyEarnings[2] },
    { name: "Apr", sales: monthlyEarnings[3] },
    { name: "May", sales: monthlyEarnings[4] },
    { name: "Jun", sales: monthlyEarnings[5] },
    { name: "Jul", sales: monthlyEarnings[6] },
    { name: "Aug", sales: monthlyEarnings[7] },
    { name: "Sep", sales: monthlyEarnings[8] },
    { name: "Oct", sales: monthlyEarnings[9] },
    { name: "Nov", sales: monthlyEarnings[10] },
    { name: "Dec", sales: monthlyEarnings[11] },
  ];

  // B. Distribution for Pie Chart
  const pieChartData = [
    { name: "Total Orders", value: totalOrders },
    { name: "Total Products", value: totalProducts },
    // Using Stock as a placeholder for the 3rd slice since we don't have reviews
    { name: "Total Users", value: uniqueUsers },
  ];

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56"]; // Pink, Blue, Yellow

  // Recent Orders (Top 5)
  const recentOrders = (orderList || [])
    .slice()
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Hi, Welcome back to the admin dashboard.</p>
      </div>

      {/* 1. Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Earning</h3>
          <p className="text-3xl font-extrabold text-gray-900">${totalSales.toFixed(0)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">All Orders</h3>
          <p className="text-3xl font-extrabold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
          <p className="text-3xl font-extrabold text-gray-900">{uniqueUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
          <p className="text-3xl font-extrabold text-gray-900">{totalProducts}</p>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Left: Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-gray-800 self-start mb-4">Admin Stats Overview</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="top" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Earnings</h2>
          <div className="w-full h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9ca3af', fontSize: 12}}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Table (Preserved functionality, updated styling) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        </div>
        
        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-gray-500 border-b border-gray-100">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord?._id} className="border-b last:border-none border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{ord?._id}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{ord?.userId || ord?.userEmail || "Guest"}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">${Number(ord?.totalAmount || 0).toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${ord?.orderStatus === 'confirmed' ? 'bg-green-100 text-green-700' : 
                          ord?.orderStatus === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'}`}>
                        {ord?.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">{new Date(ord?.orderDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            No recent orders found.
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;