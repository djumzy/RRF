import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Users, BookOpen, Award } from "lucide-react";
import rrfLogo from "@assets/RRF LOGO.jpg";
import AuthModal from "./auth-modal";
import LearnMore from "./learn-more";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  if (showLearnMore) {
    return (
      <LearnMore 
        onBack={() => setShowLearnMore(false)}
        onGetStarted={() => {
          setShowLearnMore(false);
          setShowAuthModal(true);
        }}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-rrf-light-green to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur">
        <div className="flex items-center space-x-3">
          <img src={rrfLogo} alt="RRF Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">RRF Learning</h1>
            <p className="text-xs text-gray-500">Permaculture Education Platform</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Permaculture for{" "}
            <span className="text-rrf-green">Regeneration</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive e-learning platform designed specifically for refugee and rural communities. 
            Learn sustainable practices, build resilient communities, and transform landscapes through permaculture education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-rrf-green hover:bg-rrf-dark-green text-white"
              onClick={() => setShowAuthModal(true)}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowLearnMore(true)}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rrf-light-green rounded-full flex items-center justify-center mr-3">
                    <span className="text-rrf-dark-green font-semibold">AH</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Amara Hassan</h4>
                    <p className="text-sm text-gray-600">Community Leader, Jordan</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "This permaculture program transformed our community. We now have sustainable food systems 
                  and our families are healthier and more self-sufficient."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rrf-light-green rounded-full flex items-center justify-center mr-3">
                    <span className="text-rrf-dark-green font-semibold">MK</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mohamed Kone</h4>
                    <p className="text-sm text-gray-600">Farmer, Mali</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "The water management techniques I learned helped us survive the drought. 
                  Our crops are thriving even in difficult conditions."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rrf-light-green rounded-full flex items-center justify-center mr-3">
                    <span className="text-rrf-dark-green font-semibold">SR</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Rodriguez</h4>
                    <p className="text-sm text-gray-600">Teacher, Guatemala</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "I can now teach permaculture to others in my village. 
                  The certification gave me confidence and the knowledge to make a real impact."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Offerings Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Course Offerings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-rrf-green">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-rrf-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-rrf-dark-green">Online Course</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Complete self-paced online learning with video lessons, 
                  interactive content, and community support.
                </p>
                <Button className="w-full bg-rrf-green hover:bg-rrf-dark-green">
                  Enroll Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-rrf-light-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-rrf-dark-green" />
                </div>
                <CardTitle>Physical Course</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Hands-on training at our demonstration sites with 
                  experienced instructors and practical field work.
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-rrf-light-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-rrf-dark-green" />
                </div>
                <CardTitle>Certificate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Earn an accredited permaculture design certificate 
                  recognized internationally.
                </p>
                <Button variant="outline" className="w-full">
                  Get Certified
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-rrf-light-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sprout className="h-8 w-8 text-rrf-dark-green" />
                </div>
                <CardTitle>Online Certificate</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Digital certification upon completion of online course 
                  with verified assessments.
                </p>
                <Button variant="outline" className="w-full">
                  Start Online
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-rrf-green">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-rrf-light-green text-lg mb-8">
            Join thousands of learners worldwide who are building resilient, sustainable communities 
            through permaculture education.
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white text-rrf-green border-white hover:bg-rrf-light-green"
            onClick={() => setShowAuthModal(true)}
          >
            Start Learning Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-rrf-green rounded-lg flex items-center justify-center">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">RRF Learning Platform</span>
          </div>
          <p className="text-gray-400">
            Empowering refugee and rural communities through permaculture education.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
