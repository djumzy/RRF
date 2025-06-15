import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Users, 
  ChartLine, 
  FolderOpen, 
  Settings,
  UserCheck,
  CheckCircle,
  GraduationCap,
  Calendar,
  HelpCircle,
  Download
} from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const adminNavItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/courses", icon: BookOpen, label: "All Courses" },
    { path: "/users", icon: Users, label: "User Management" },
    { path: "/approvals", icon: CheckCircle, label: "Course Approvals" },
    { path: "/analytics", icon: ChartLine, label: "Analytics" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const instructorNavItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/my-courses", icon: BookOpen, label: "My Courses" },
    { path: "/create-course", icon: PlusCircle, label: "Create Course" },
    { path: "/collaborate", icon: Users, label: "Collaborate" },
    { path: "/student-progress", icon: ChartLine, label: "Student Progress" },
    { path: "/files", icon: FolderOpen, label: "Files & Resources" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const studentNavItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/my-learning", icon: GraduationCap, label: "My Learning" },
    { path: "/browse-courses", icon: BookOpen, label: "Browse Courses" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/progress", icon: ChartLine, label: "My Progress" },
    { path: "/downloads", icon: Download, label: "Downloads" },
    { path: "/help", icon: HelpCircle, label: "Get Help" },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminNavItems;
      case 'instructor':
        return instructorNavItems;
      case 'student':
        return studentNavItems;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "bg-rrf-light-green text-rrf-dark-green"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon 
                  className={cn(
                    "mr-3 h-5 w-5",
                    active ? "text-rrf-green" : "text-gray-400 group-hover:text-gray-500"
                  )} 
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
