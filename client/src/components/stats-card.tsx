import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Clock, 
  ChartLine, 
  Award, 
  UserCheck,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: "green" | "blue" | "amber" | "purple" | "red";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const iconMap = {
  book: BookOpen,
  users: Users,
  clock: Clock,
  "chart-line": ChartLine,
  award: Award,
  "user-check": UserCheck,
  "check-circle": CheckCircle,
  "trending-up": TrendingUp,
};

const colorVariants = {
  green: {
    bg: "bg-rrf-light-green",
    icon: "text-rrf-green",
  },
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
  },
  amber: {
    bg: "bg-amber-100",
    icon: "text-amber-600",
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600",
  },
  red: {
    bg: "bg-red-100",
    icon: "text-red-600",
  },
};

export default function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || BookOpen;
  const colorClasses = colorVariants[color];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("p-3 rounded-full", colorClasses.bg)}>
            <IconComponent className={cn("h-6 w-6", colorClasses.icon)} />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <div className={cn(
                  "flex items-center text-xs",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  <TrendingUp 
                    className={cn(
                      "h-3 w-3 mr-1",
                      !trend.isPositive && "rotate-180"
                    )} 
                  />
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
