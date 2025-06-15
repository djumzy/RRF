import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Users, 
  Edit, 
  Share2, 
  Play,
  Calendar,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course & {
    instructor?: {
      firstName?: string;
      lastName?: string;
    };
    enrollments?: any[];
    chapters?: any[];
    _count?: {
      enrollments: number;
      chapters: number;
    };
  };
  variant?: "default" | "compact" | "detailed";
  showActions?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
}

export default function CourseCard({ 
  course, 
  variant = "default", 
  showActions = true,
  onEdit,
  onShare 
}: CourseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'pending_review':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const getCourseIcon = (title: string) => {
    if (title.toLowerCase().includes('water')) {
      return '💧';
    } else if (title.toLowerCase().includes('soil')) {
      return '🌱';
    } else if (title.toLowerCase().includes('food') || title.toLowerCase().includes('forest')) {
      return '🌳';
    } else if (title.toLowerCase().includes('building')) {
      return '🏠';
    } else {
      return '📚';
    }
  };

  const enrollmentCount = course.enrollments?.length || course._count?.enrollments || 0;
  const chapterCount = course.chapters?.length || course._count?.chapters || 0;

  if (variant === "compact") {
    return (
      <Card className="hover:border-rrf-green transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-lg flex items-center justify-center text-lg">
                {getCourseIcon(course.title)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500">{chapterCount} chapters • {enrollmentCount} students</p>
              </div>
            </div>
            <Badge variant={getStatusColor(course.status)}>
              {getStatusText(course.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:border-rrf-green transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Course thumbnail */}
            <div className="w-16 h-16 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              {getCourseIcon(course.title)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    <Link 
                      href={`/course/${course.id}`}
                      className="hover:text-rrf-green transition-colors"
                    >
                      {course.title}
                    </Link>
                  </h3>
                  
                  {course.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {chapterCount} chapters
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {enrollmentCount} students
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Instructor info */}
                  {course.instructor && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {course.instructor.firstName?.[0]}{course.instructor.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">
                        {course.instructor.firstName} {course.instructor.lastName}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Badge variant={getStatusColor(course.status)}>
                      {getStatusText(course.status)}
                    </Badge>
                    
                    {course.collaborators && course.collaborators.length > 0 && (
                      <div className="flex items-center text-xs text-blue-600">
                        <Users className="h-3 w-3 mr-1" />
                        {course.collaborators.length} collaborator{course.collaborators.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-2 ml-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onEdit}
                asChild
              >
                <Link href={`/course/${course.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm"
                className="bg-rrf-green hover:bg-rrf-dark-green"
                asChild
              >
                <Link href={`/course/${course.id}`}>
                  <Play className="h-4 w-4 mr-1" />
                  {course.status === 'published' ? 'View' : 'Preview'}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
