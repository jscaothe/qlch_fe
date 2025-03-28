import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  X,
  UserPlus,
  Calendar,
  Wallet,
  ClipboardCheck,
  BarChart3,
  Wrench
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
};

const NavItem = ({ icon: Icon, label, to, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "hover:bg-primary/5"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const navItems = [
    { icon: Home, label: "Trang chủ", to: "/" },
    { icon: FileText, label: "Quản lý phòng", to: "/rooms" },
    { icon: Users, label: "Khách thuê", to: "/tenants" },
    { icon: Calendar, label: "Hợp đồng", to: "/contracts" },
    { icon: Wallet, label: "Thu chi", to: "/finances" },
    { icon: ClipboardCheck, label: "Hóa đơn", to: "/invoices" },
    { icon: Wrench, label: "Bảo trì", to: "/maintenance" },
    { icon: UserPlus, label: "Người dùng", to: "/users" },
    { icon: BarChart3, label: "Báo cáo", to: "/reports" },
    { icon: Settings, label: "Cài đặt", to: "/settings" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar cho desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 glass-dark w-64 transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <h1 className="text-xl font-bold gradient-text">ApartEase</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet to-azure flex items-center justify-center text-white">
                AE
              </div>
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-xs text-gray-500">admin@apartease.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed bottom-6 left-6 z-50 p-3 rounded-full gradient-primary text-white shadow-lg md:hidden"
        )}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay khi sidebar mở trên mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        !isMobile && "ml-64"
      )}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
