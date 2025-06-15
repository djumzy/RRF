import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useNavigate } from "react-router-dom";

// Admin Dashboard Components
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/courses"),
        ]);
        const users = await usersRes.json();
        const courses = await coursesRes.json();
        
        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          pendingApprovals: courses.filter((c: any) => !c.isApproved).length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>
        
        <TabsContent value="approvals">
          <PendingApprovals />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Instructor Dashboard Components
const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    activeCourses: 0,
  });

  useEffect(() => {
    // Fetch instructor's courses and stats
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch("/api/courses/instructor/courses"),
          fetch("/api/courses/instructor/enrollments"),
        ]);
        const coursesData = await coursesRes.json();
        const enrollmentsData = await enrollmentsRes.json();
        
        setCourses(coursesData);
        setStats({
          totalCourses: coursesData.length,
          totalStudents: enrollmentsData.length,
          activeCourses: coursesData.filter((c: any) => c.isPublic).length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Instructor Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalCourses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeCourses}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="create">Create Course</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <CourseList courses={courses} />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentList />
        </TabsContent>
        
        <TabsContent value="create">
          <CreateCourse />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Student Dashboard Components
const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
  });

  useEffect(() => {
    // Fetch student's enrollments and stats
    const fetchData = async () => {
      try {
        const res = await fetch("/api/courses/student/enrollments");
        const data = await res.json();
        
        setEnrollments(data);
        setStats({
          enrolledCourses: data.length,
          completedCourses: data.filter((e: any) => e.status === "completed").length,
          inProgressCourses: data.filter((e: any) => e.status === "active").length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Student Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.enrolledCourses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.completedCourses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.inProgressCourses}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="enrolled">
        <TabsList>
          <TabsTrigger value="enrolled">My Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enrolled">
          <EnrolledCourses enrollments={enrollments} />
        </TabsContent>
        
        <TabsContent value="available">
          <AvailableCourses />
        </TabsContent>
        
        <TabsContent value="progress">
          <CourseProgress enrollments={enrollments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "instructor" && <InstructorDashboard />}
      {user.role === "student" && <StudentDashboard />}
    </div>
  );
} 