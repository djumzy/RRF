import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Play, CheckCircle, Clock, Users, FileText } from "lucide-react";

export default function CourseView() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery({
    queryKey: ["/api/courses", id],
    enabled: !!id,
  });

  const { data: enrollment } = useQuery({
    queryKey: ["/api/enrollments", id],
    enabled: !!id && user?.role === 'student',
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/courses/${id}/enroll`, {});
    },
    onSuccess: () => {
      toast({ title: "Successfully enrolled in course" });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments", id] });
    },
    onError: () => {
      toast({ title: "Failed to enroll in course", variant: "destructive" });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { progress: number; completedChapters: number[] }) => {
      await apiRequest("PATCH", `/api/enrollments/${id}/progress`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments", id] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rrf-green"></div>
      </div>
    );
  }

  const isEnrolled = !!enrollment;
  const canEnroll = user?.role === 'student' && !isEnrolled;
  const progress = enrollment?.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
                  <p className="text-gray-600 mt-1">
                    By {course?.instructor?.firstName} {course?.instructor?.lastName}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg mb-6">{course?.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course?.chapters?.length || 0} chapters
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {course?.enrollments?.length || 0} students
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated {new Date(course?.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="ml-8">
              <Badge variant={
                course?.status === 'published' ? 'default' :
                course?.status === 'pending_review' ? 'secondary' : 'outline'
              } className="mb-4">
                {course?.status?.replace('_', ' ').toUpperCase()}
              </Badge>
              
              {canEnroll && (
                <div className="text-center">
                  <Button 
                    onClick={() => enrollMutation.mutate()}
                    disabled={enrollMutation.isPending}
                    className="bg-rrf-green hover:bg-rrf-dark-green"
                    size="lg"
                  >
                    Enroll Now
                  </Button>
                </div>
              )}
              
              {isEnrolled && (
                <div className="w-64">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">Your Progress</p>
                    <div className="text-2xl font-bold text-rrf-green mb-2">{progress}%</div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Button className="w-full bg-rrf-green hover:bg-rrf-dark-green">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {user?.role === 'instructor' && (
              <TabsTrigger value="students">Students</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700">
                        This comprehensive permaculture course is designed specifically for refugee and rural communities 
                        who face unique challenges such as displacement, limited resources, climate stress, and social disruption.
                      </p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">What You'll Learn</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Understanding permaculture principles and ethics</li>
                        <li>• Sustainable water management techniques</li>
                        <li>• Soil building and regeneration methods</li>
                        <li>• Food forest design and polyculture gardening</li>
                        <li>• Natural building techniques</li>
                        <li>• Integrated pest management strategies</li>
                        <li>• Site planning and zoning principles</li>
                        <li>• Community development approaches</li>
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-3">Prerequisites</h3>
                      <p className="text-gray-700">
                        No prior experience required. This course is designed for beginners and 
                        builds knowledge progressively through practical examples and activities.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Course Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Interactive content</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Downloadable resources</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Progress tracking</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Community discussion</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Expert instruction</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-rrf-green to-rrf-dark-green rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {course?.instructor?.firstName?.[0]}{course?.instructor?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {course?.instructor?.firstName} {course?.instructor?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">Permaculture Specialist</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chapters">
            <Card>
              <CardHeader>
                <CardTitle>Course Chapters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course?.chapters?.map((chapter: any, index: number) => (
                    <div key={chapter.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-rrf-green transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-rrf-light-green rounded-full flex items-center justify-center">
                          <span className="text-rrf-dark-green font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                          <p className="text-sm text-gray-600">
                            {chapter.isPublished ? 'Published' : 'Draft'} • 
                            {chapter.content ? '15 min read' : 'Content coming soon'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {isEnrolled && enrollment?.completedChapters?.includes(chapter.id) && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {isEnrolled && chapter.isPublished && (
                          <Button size="sm" className="bg-rrf-green hover:bg-rrf-dark-green">
                            <Play className="h-4 w-4 mr-1" />
                            {enrollment?.completedChapters?.includes(chapter.id) ? 'Review' : 'Start'}
                          </Button>
                        )}
                        {!chapter.isPublished && (
                          <Badge variant="secondary">Coming Soon</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {(!course?.chapters || course.chapters.length === 0) && (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No chapters available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Course Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course?.files?.map((file: any) => (
                    <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{file.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {file.fileSize && `${(file.fileSize / 1024 / 1024).toFixed(1)} MB`} • 
                            {file.fileType?.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                  
                  {(!course?.files || course.files.length === 0) && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No resources available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === 'instructor' && (
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course?.enrollments?.map((enrollment: any) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-sm">
                              {enrollment.student?.firstName?.[0]}{enrollment.student?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {enrollment.student?.firstName} {enrollment.student?.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Last activity: {new Date(enrollment.lastActivityAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{enrollment.progress}%</p>
                            <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className="bg-rrf-green h-2 rounded-full" 
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Badge variant={enrollment.progress === 100 ? 'default' : 'secondary'}>
                            {enrollment.progress === 100 ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {(!course?.enrollments || course.enrollments.length === 0) && (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No students enrolled yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
