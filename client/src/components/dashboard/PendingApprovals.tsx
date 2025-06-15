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
  createdAt: string;
}

export default function PendingApprovals() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const res = await fetch("/api/courses/pending");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching pending courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (courseId: number) => {
    try {
      await fetch(`/api/courses/${courseId}/approve`, {
        method: "PATCH",
      });
      fetchPendingCourses(); // Refresh the list
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const rejectCourse = async (courseId: number) => {
    try {
      await fetch(`/api/courses/${courseId}/reject`, {
        method: "PATCH",
      });
      fetchPendingCourses(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting course:", error);
    }
  };

  if (loading) {
    return <div>Loading pending approvals...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pending Course Approvals</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Submitted</TableHead>
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
                {new Date(course.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => approveCourse(course.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => rejectCourse(course.id)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {courses.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No pending approvals
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 