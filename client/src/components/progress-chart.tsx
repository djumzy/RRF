import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Award,
  Clock,
  BookOpen
} from "lucide-react";

interface StudentProgress {
  id: string;
  student: {
    firstName: string;
    lastName: string;
    email: string;
  };
  course: {
    title: string;
  };
  progress: number;
  completedChapters: number[];
  totalChapters: number;
  lastActivityAt: string;
  status: 'active' | 'behind' | 'completed' | 'inactive';
}

interface ProgressChartProps {
  data: StudentProgress[];
  title?: string;
  showTrends?: boolean;
  maxItems?: number;
}

export default function ProgressChart({ 
  data, 
  title = "Student Progress Overview",
  showTrends = true,
  maxItems = 10 
}: ProgressChartProps) {
  const displayData = data.slice(0, maxItems);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'behind':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateStats = () => {
    const total = data.length;
    const completed = data.filter(item => item.status === 'completed').length;
    const active = data.filter(item => item.status === 'active').length;
    const avgProgress = data.reduce((sum, item) => sum + item.progress, 0) / total;
    
    return {
      total,
      completed,
      active,
      avgProgress: Math.round(avgProgress)
    };
  };

  const stats = calculateStats();

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No student progress data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
          {showTrends && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-green-600">
                <Award className="h-4 w-4 mr-1" />
                {stats.completed} completed
              </div>
              <div className="flex items-center text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stats.avgProgress}% avg
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</div>
            <div className="text-xs text-gray-600">Avg Progress</div>
          </div>
        </div>

        {/* Progress List */}
        <div className="space-y-4">
          {displayData.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {item.student.firstName[0]}{item.student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {item.student.firstName} {item.student.lastName}
                    </h4>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {item.course.title}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(item.progress)}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 text-right">
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {item.completedChapters.length}/{item.totalChapters}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(item.lastActivityAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.length > maxItems && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-2">
              Showing {maxItems} of {data.length} students
            </p>
            <button className="text-rrf-green hover:text-rrf-dark-green text-sm font-medium">
              View All Students
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
