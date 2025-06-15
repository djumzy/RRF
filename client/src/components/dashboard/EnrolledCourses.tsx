import { useState } from "react";
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
import { Progress } from "../ui/progress";

interface Enrollment {
  id: number;
  courseId: number;
  courseTitle: string;
  courseDescription: string;
  instructorName: string;
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
  progress: number;
}

interface EnrolledCoursesProps {
  enrollments: Enrollment[];
}

export default function EnrolledCourses({ enrollments }: EnrolledCoursesProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "dropped":
        return <Badge variant="destructive">Dropped</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Enrolled Courses</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{enrollment.courseTitle}</div>
                  <div className="text-sm text-gray-500">
                    {enrollment.courseDescription}
                  </div>
                </div>
              </TableCell>
              <TableCell>{enrollment.instructorName}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Progress value={enrollment.progress} />
                  <span className="text-sm text-gray-500">
                    {enrollment.progress}% Complete
                  </span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.location.href = `/courses/${enrollment.courseId}`
                  }
                >
                  Continue Learning
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {enrollments.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No enrolled courses
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 