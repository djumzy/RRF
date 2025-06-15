import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/file-upload";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Send, Plus, GripVertical } from "lucide-react";

export default function CourseEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const { data: course, isLoading } = useQuery({
    queryKey: ["/api/courses", id],
    enabled: !!id,
  });

  const { data: chapters } = useQuery({
    queryKey: ["/api/courses", id, "chapters"],
    enabled: !!id,
  });

  const updateCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", `/api/courses/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Course updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
    },
    onError: () => {
      toast({ title: "Failed to update course", variant: "destructive" });
    },
  });

  const addChapterMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", `/api/courses/${id}/chapters`, data);
    },
    onSuccess: () => {
      toast({ title: "Chapter added successfully" });
      setNewChapterTitle("");
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id, "chapters"] });
    },
    onError: () => {
      toast({ title: "Failed to add chapter", variant: "destructive" });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/courses/${id}/submit-for-review`, {});
    },
    onSuccess: () => {
      toast({ title: "Course submitted for review" });
      queryClient.invalidateQueries({ queryKey: ["/api/courses", id] });
    },
    onError: () => {
      toast({ title: "Failed to submit course", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rrf-green"></div>
      </div>
    );
  }

  const handleSave = () => {
    updateCourseMutation.mutate({
      title: title || course?.title,
      description: description || course?.description,
    });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    
    addChapterMutation.mutate({
      title: newChapterTitle,
      content: "",
      orderIndex: (chapters?.length || 0) + 1,
    });
  };

  const handleSubmitForReview = () => {
    submitForReviewMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {course?.title || "Course Editor"}
            </h1>
            <p className="text-gray-600 mt-1">
              Edit course content and manage chapters
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateCourseMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={handleSubmitForReview}
              disabled={submitForReviewMutation.isPending || course?.status !== 'draft'}
              className="bg-rrf-green hover:bg-rrf-dark-green"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit for Review
            </Button>
          </div>
        </div>

        {/* Course Status */}
        <div className="mb-6">
          <Badge variant={
            course?.status === 'published' ? 'default' :
            course?.status === 'pending_review' ? 'secondary' : 'outline'
          }>
            {course?.status?.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="files">Files & Resources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Course Title</label>
                      <Input
                        value={title || course?.title || ""}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter course title"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        value={description || course?.description || ""}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter course description"
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Course Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Chapters</span>
                        <span className="font-medium">{chapters?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Students</span>
                        <span className="font-medium">{course?.enrollments?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Collaborators</span>
                        <span className="font-medium">{course?.collaborators?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created</span>
                        <span className="font-medium">
                          {course?.createdAt ? new Date(course.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chapters">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Chapters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chapters?.map((chapter: any, index: number) => (
                      <div key={chapter.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{chapter.title}</p>
                            <p className="text-xs text-gray-500">
                              Chapter {index + 1} • {chapter.isPublished ? 'Published' : 'Draft'}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                    
                    {chapters?.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No chapters yet. Add your first chapter below.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add New Chapter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Chapter Title</label>
                      <Input
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        placeholder="Enter chapter title"
                        className="mt-1"
                      />
                    </div>
                    <Button 
                      onClick={handleAddChapter}
                      disabled={!newChapterTitle.trim() || addChapterMutation.isPending}
                      className="w-full bg-rrf-green hover:bg-rrf-dark-green"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chapter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Course Files & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload courseId={id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Collaboration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Allow Collaboration Requests</p>
                          <p className="text-sm text-gray-600">
                            Let other instructors request to collaborate on this course
                          </p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Current Collaborators</h3>
                    {course?.collaborators?.length === 0 ? (
                      <p className="text-gray-500">No collaborators yet</p>
                    ) : (
                      <div className="space-y-2">
                        {course?.collaborators?.map((collaboratorId: string) => (
                          <div key={collaboratorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span>Collaborator ID: {collaboratorId}</span>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
