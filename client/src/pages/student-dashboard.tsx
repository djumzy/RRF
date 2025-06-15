import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Award, Calendar } from "lucide-react";

interface Stats {
  enrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  chapters?: { id: number }[];
  duration?: number;
}

interface Enrollment {
  id: number;
  course: Course;
  progress: number;
  lastActivityAt: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: enrollments } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="lg:pl-64 flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    <i className="fas fa-home"></i>
                  </a>
                </li>
                <li>
                  <span className="text-gray-400">/</span>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">Student Dashboard</span>
                </li>
              </ol>
            </nav>

            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Student'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Continue your permaculture learning journey.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Enrolled Courses"
                value={stats?.enrolledCourses || 0}
                icon="book"
                color="green"
              />
              <StatsCard
                title="Completed Courses"
                value={stats?.completedCourses || 0}
                icon="award"
                color="blue"
              />
              <StatsCard
                title="In Progress"
                value={stats?.inProgressCourses || 0}
                icon="play"
                color="amber"
              />
              <StatsCard
                title="Average Progress"
                value={`${stats?.averageProgress || 0}%`}
                icon="chart-line"
                color="green"
              />
            </div>

            {/* Enrolled Courses */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!enrollments?.length ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm mb-4">No courses enrolled yet</p>
                      <Button className="bg-rrf-green hover:bg-rrf-dark-green">
                        Browse Available Courses
                      </Button>
                    </div>
                  ) : (
                    enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-6 hover:border-rrf-green transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-lg flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {enrollment.course.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {enrollment.course.description}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-xs text-gray-500">
                                  {enrollment.course.chapters?.length || 0} chapters
                                </span>
                                <span className="text-xs text-gray-500">
                                  Last activity: {new Date(enrollment.lastActivityAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="bg-rrf-green hover:bg-rrf-dark-green">
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses?.map((course) => (
                    <div key={course.id} className="border rounded-lg p-6 hover:border-rrf-green transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs text-gray-500">
                              {course.chapters?.length || 0} chapters
                            </span>
                            <span className="text-xs text-gray-500">
                              {course.duration} hours
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-rrf-green hover:bg-rrf-dark-green">
                        Enroll Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
