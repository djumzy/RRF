import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Course, Enrollment } from "@shared/schema";
import rrfLogo from "@assets/RRF LOGO.jpg";

export default function CourseEnrollment() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/published"],
  });

  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments", user?.id],
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      toast({
        title: "Successfully enrolled!",
        description: "You can now start learning this course.",
      });
    },
    onError: () => {
      toast({
        title: "Enrollment failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const isEnrolled = (courseId: number) => {
    return enrollments.some(e => e.courseId === courseId);
  };

  const handleEnroll = (courseId: number) => {
    enrollMutation.mutate(courseId);
  };

  const handleStartCourse = (courseId: number) => {
    window.location.href = `/course/${courseId}`;
  };

  if (coursesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rrf-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rrf-light-green to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur">
        <div className="flex items-center space-x-3">
          <img src={rrfLogo} alt="RRF Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">RRF Learning</h1>
            <p className="text-xs text-gray-500">Permaculture Education Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.firstName || user?.email}</span>
          <Button variant="outline" onClick={() => window.location.href = '/api/logout'}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Courses
          </h1>
          <p className="text-gray-600">
            Enroll in permaculture courses designed for refugee and rural communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.id);
            
            return (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {enrolled && (
                      <Badge className="bg-rrf-green text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Multiple Topics</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Self-paced</span>
                    </div>
                  </div>
                  
                  {enrolled ? (
                    <Button 
                      className="w-full bg-rrf-green hover:bg-rrf-dark-green"
                      onClick={() => handleStartCourse(course.id)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-rrf-green hover:bg-rrf-dark-green"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No courses available yet</h3>
            <p className="text-gray-500">Check back soon for new permaculture courses.</p>
          </div>
        )}
      </div>
    </div>
  );
}