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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Student {
  id: number;
  username: string;
  email: string;
  courseId: number;
  courseTitle: string;
  enrollmentDate: string;
  status: "active" | "completed" | "dropped";
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  useEffect(() => {
    fetchStudents();
  }, [selectedCourse]);

  const fetchStudents = async () => {
    try {
      const url = selectedCourse === "all"
        ? "/api/courses/instructor/students"
        : `/api/courses/${selectedCourse}/students`;
      const res = await fetch(url);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (studentId: number, courseId: number, newStatus: string) => {
    try {
      await fetch(`/api/courses/${courseId}/students/${studentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Student Management</h3>
        <Select
          value={selectedCourse}
          onValueChange={setSelectedCourse}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {Array.from(new Set(students.map(s => s.courseId))).map(courseId => {
              const course = students.find(s => s.courseId === courseId);
              return (
                <SelectItem key={courseId} value={courseId.toString()}>
                  {course?.courseTitle}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Enrolled</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={`${student.courseId}-${student.id}`}>
              <TableCell>
                <div>
                  <div className="font-medium">{student.username}</div>
                  <div className="text-sm text-gray-500">{student.email}</div>
                </div>
              </TableCell>
              <TableCell>{student.courseTitle}</TableCell>
              <TableCell>
                {new Date(student.enrollmentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    student.status === "active"
                      ? "default"
                      : student.status === "completed"
                      ? "success"
                      : "destructive"
                  }
                >
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={student.status}
                  onValueChange={(value) =>
                    updateStudentStatus(student.id, student.courseId, value)
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 