import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  instructorName: string;
  isApproved: boolean;
  isPublic: boolean;
  createdAt: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (courseId: number) => {
    try {
      await fetch(`/api/courses/${courseId}/approve`, {
        method: "PATCH",
      });
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const toggleCourseVisibility = async (courseId: number, currentStatus: boolean) => {
    try {
      await fetch(`/api/courses/${courseId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentStatus }),
      });
      fetchCourses(); // Refresh the list
    } catch (error) {
      console.error("Error toggling course visibility:", error);
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Management</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-gray-500">{course.description}</div>
                </div>
              </TableCell>
              <TableCell>{course.instructorName}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge
                    variant={course.isApproved ? "success" : "secondary"}
                    className="mr-2"
                  >
                    {course.isApproved ? "Approved" : "Pending"}
                  </Badge>
                  <Badge
                    variant={course.isPublic ? "success" : "secondary"}
                  >
                    {course.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {new Date(course.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {!course.isApproved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => approveCourse(course.id)}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCourseVisibility(course.id, course.isPublic)}
                  >
                    {course.isPublic ? "Make Private" : "Make Public"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 