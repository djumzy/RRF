import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import Sidebar from "@/components/sidebar";
import StatsCard from "@/components/stats-card";
import CourseCard from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Users, Handshake } from "lucide-react";

export default function InstructorDashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: collaborationRequests } = useQuery({
    queryKey: ["/api/collaboration-requests"],
  });

  const pendingRequests = collaborationRequests?.filter((req: any) => req.status === 'pending') || [];

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
                  <span className="text-gray-900 font-medium">Instructor Dashboard</span>
                </li>
              </ol>
            </nav>

            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || 'Instructor'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your permaculture courses today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Active Courses"
                value={stats?.activeCourses || 0}
                icon="book"
                color="green"
              />
              <StatsCard
                title="Total Students"
                value={stats?.totalStudents || 0}
                icon="users"
                color="blue"
              />
              <StatsCard
                title="Pending Reviews"
                value={stats?.pendingReviews || 0}
                icon="clock"
                color="amber"
              />
              <StatsCard
                title="Completion Rate"
                value={`${stats?.completionRate || 0}%`}
                icon="chart-line"
                color="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Courses</CardTitle>
                    <Button 
                      size="sm" 
                      className="bg-rrf-green hover:bg-rrf-dark-green"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses?.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mb-4">No courses yet</p>
                        <Button className="bg-rrf-green hover:bg-rrf-dark-green">
                          Create Your First Course
                        </Button>
                      </div>
                    ) : (
                      courses?.map((course: any) => (
                        <CourseCard key={course.id} course={course} />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Collaboration Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Handshake className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm mb-2">
                          No pending collaboration requests
                        </p>
                        <p className="text-gray-400 text-xs">
                          Collaborate with other instructors to create better content
                        </p>
                      </div>
                    ) : (
                      pendingRequests.map((request: any) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {request.requester?.firstName?.[0]}{request.requester?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {request.requester?.firstName} {request.requester?.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                Wants to collaborate on "{request.course?.title}"
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-rrf-green hover:bg-rrf-dark-green">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline">
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Course Editor */}
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quick Course Editor</CardTitle>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-expand-alt mr-1"></i>
                    Full Editor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Course Structure */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Course Structure</h3>
                    <div className="space-y-2">
                      {[
                        { title: "Chapter 1: Learning Culture", status: "Published" },
                        { title: "Chapter 2: What is Permaculture?", status: "Draft" },
                        { title: "Chapter 3: Climate Change & Refugees", status: "Editing" },
                      ].map((chapter, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                          chapter.status === 'Editing' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <i className="fas fa-grip-vertical text-gray-400"></i>
                            <span className="text-sm font-medium">{chapter.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={chapter.status === 'Published' ? 'default' : 'secondary'}>
                              {chapter.status}
                            </Badge>
                            <i className="fas fa-chevron-right text-gray-400"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-3 border-dashed border-gray-300 hover:border-rrf-green hover:text-rrf-green"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Chapter
                    </Button>
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Course Resources</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rrf-green transition-colors">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PDF, DOC, images, videos up to 50MB
                      </p>
                      <Button className="mt-3 bg-rrf-green hover:bg-rrf-dark-green">
                        Choose Files
                      </Button>
                    </div>

                    {/* Uploaded files */}
                    <div className="mt-4 space-y-2">
                      {[
                        { name: "Permaculture_Guide_Ch1.pdf", size: "2.3 MB", type: "pdf" },
                        { name: "Chapter_3_Exercises.docx", size: "1.8 MB", type: "word" },
                      ].map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <i className={`fas fa-file-${file.type} ${
                              file.type === 'pdf' ? 'text-red-500' : 'text-blue-500'
                            }`}></i>
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{file.size}</span>
                            <button className="text-gray-400 hover:text-red-500">
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
