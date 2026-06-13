import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Star, 
  LogOut 
} from "lucide-react";

export const AccountLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Show a confirmation/feedback and redirect home
    const confirm = window.confirm("Are you sure you want to sign out?");
    if (confirm) {
      console.log("Signing out user...");
      navigate("/");
    }
  };

  const navItems = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Addresses", path: "/addresses", icon: MapPin },
    { name: "Saved Cards", path: "/saved-cards", icon: CreditCard },
    { name: "Reviews", path: "/reviews", icon: Star },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:gap-8">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 shrink-0 mb-6 md:mb-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3 px-3 py-4 border-b border-gray-100 mb-4">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-[#cd6615] font-bold text-lg">
                AS
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Aarohi Sharma</h3>
                <span className="text-xs text-gray-500">aarohi@nexcart.in</span>
              </div>
            </div>

            <nav className="space-y-1.5" aria-label="Account Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-200 ${
                      isActive
                        ? "bg-[#cd6615]/10 text-[#cd6615]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#cd6615]" : "text-gray-400"}`} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition duration-200 text-left bg-transparent cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5 text-red-400" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm min-h-[500px]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AccountLayout;
