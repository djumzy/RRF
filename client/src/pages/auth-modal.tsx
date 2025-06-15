import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { UserPlus, LogIn, Leaf } from "lucide-react";
import rrfLogo from "@assets/RRF LOGO.jpg";
import api from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    try {
      const response = await api.post('/api/login', {
        identifier,
        password,
      });

      // Show success message
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });

      // Close the modal first
      onClose();

      // Then invalidate and navigate
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Use setTimeout to ensure the modal is closed before navigation
      setTimeout(() => {
        switch (response.data.user.role) {
          case 'admin':
            navigate('/admin-dashboard', { replace: true });
            break;
          case 'instructor':
            navigate('/instructor-dashboard', { replace: true });
            break;
          case 'student':
            navigate('/student-dashboard', { replace: true });
            break;
          default:
            navigate('/student-dashboard', { replace: true });
        }
      }, 100);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to login. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get('username') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      location: formData.get('location') as string,
      district: formData.get('district') as string,
      subcounty: formData.get('subcounty') as string,
      village: formData.get('village') as string,
      educationLevel: formData.get('educationLevel') as string,
    };

    try {
      const response = await api.post('/api/register', data);
      
      // Show success message
      toast({
        title: "Success",
        description: "Your account has been created successfully",
      });

      // Close the modal first
      onClose();

      // Then invalidate and navigate
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Use setTimeout to ensure the modal is closed before navigation
      setTimeout(() => {
        switch (response.data.user.role) {
          case 'admin':
            navigate('/admin-dashboard', { replace: true });
            break;
          case 'instructor':
            navigate('/instructor-dashboard', { replace: true });
            break;
          case 'student':
            navigate('/student-dashboard', { replace: true });
            break;
          default:
            navigate('/student-dashboard', { replace: true });
        }
      }, 100);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" aria-describedby="auth-dialog-description">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
          <div className="flex items-center justify-center mb-4">
            <img src={rrfLogo} alt="RRF Logo" className="w-16 h-16 object-contain" />
          </div>
          <DialogTitle className="text-center">Join RRF Learning Platform</DialogTitle>
          <DialogDescription id="auth-dialog-description" className="text-center">
            Sign in to your account or create a new one to start learning permaculture
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sticky top-[140px] bg-white z-10">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Join Us</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <LogIn className="w-5 h-5 mr-2 text-rrf-green" />
                  Welcome Back
                </CardTitle>
                <CardDescription>
                  Continue your permaculture learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier">Username, Email, or Student ID</Label>
                    <Input 
                      id="identifier" 
                      name="identifier"
                      type="text" 
                      placeholder="Enter your username, email, or student ID"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      placeholder="Enter your password"
                      required 
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-rrf-green hover:bg-rrf-dark-green"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <UserPlus className="w-5 h-5 mr-2 text-rrf-green" />
                  Join Our Learning Community
                </CardTitle>
                <CardDescription>
                  Start your sustainable agriculture journey with comprehensive permaculture education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" name="username" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" required />
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Leaf className="w-4 h-4 mr-2" />
                      Location Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input id="district" name="district" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcounty">Subcounty</Label>
                        <Input id="subcounty" name="subcounty" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="village">Village</Label>
                        <Input id="village" name="village" required />
                      </div>
                    </div>
                  </div>

                  {/* Education Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Education Level</h3>
                    <Select name="educationLevel" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-rrf-green hover:bg-rrf-dark-green"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-600 mt-4 sticky bottom-0 bg-white pt-2">
          <p className="flex items-center justify-center">
            <Leaf className="w-4 h-4 mr-1 text-rrf-green" />
            Empowering communities through sustainable education
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}