import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: pendingCourses } = useQuery({
    queryKey: ["/api/courses/pending-review"],
  });

  const { data: allCourses } = useQuery({
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
                  <span className="text-gray-900 font-medium">Admin Dashboard</span>
                </li>
              </ol>
            </nav>

            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor platform activity and manage course approvals.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total Courses"
                value={stats?.totalCourses || 0}
                icon="book"
                color="green"
              />
              <StatsCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon="users"
                color="blue"
              />
              <StatsCard
                title="Pending Approvals"
                value={stats?.pendingApprovals || 0}
                icon="clock"
                color="amber"
              />
              <StatsCard
                title="Active Students"
                value={stats?.activeStudents || 0}
                icon="user-check"
                color="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pending Course Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-amber-500" />
                    Course Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingCourses?.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                          No courses pending approval
                        </p>
                      </div>
                    ) : (
                      pendingCourses?.map((course: any) => (
                        <div key={course.id} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{course.title}</h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {course.description}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-xs text-gray-500">
                                  By: {course.instructor?.firstName} {course.instructor?.lastName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Submitted: {new Date(course.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" className="bg-rrf-green hover:bg-rrf-dark-green">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Course Approved</p>
                        <p className="text-xs text-gray-500">"Water Management Systems" by John Doe</p>
                      </div>
                      <span className="text-xs text-gray-400">2h ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-user-plus text-white text-xs"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New User Registered</p>
                        <p className="text-xs text-gray-500">Maria Kowalski joined as Instructor</p>
                      </div>
                      <span className="text-xs text-gray-400">4h ago</span>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Course Submitted</p>
                        <p className="text-xs text-gray-500">"Soil Building" by Ahmed Bashir</p>
                      </div>
                      <span className="text-xs text-gray-400">6h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* All Courses Overview */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allCourses?.map((course: any) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {course.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {course.instructor?.firstName} {course.instructor?.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            course.status === 'published' ? 'default' :
                            course.status === 'pending_review' ? 'secondary' : 'outline'
                          }>
                            {course.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{course.enrollments?.length || 0}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {new Date(course.updatedAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {course.status === 'pending_review' && (
                              <>
                                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
