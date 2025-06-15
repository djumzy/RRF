import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Users, Sprout, Award, Globe, Heart } from "lucide-react";
import rrfLogo from "@assets/RRF LOGO.jpg";

interface LearnMoreProps {
  onBack: () => void;
  onGetStarted: () => void;
}

export default function LearnMore({ onBack, onGetStarted }: LearnMoreProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rrf-light-green to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur">
        <div className="flex items-center space-x-3">
          <img src={rrfLogo} alt="RRF Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">RRF Learning</h1>
            <p className="text-xs text-gray-500">Permaculture Education Platform</p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Permaculture for <span className="text-rrf-green">Regeneration</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            A Practical Guidebook for Refugee and Rural Communities
          </p>
          <Badge className="bg-rrf-green text-white mb-8">
            14 Comprehensive Chapters
          </Badge>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-6 h-6 mr-2 text-rrf-green" />
              Why This Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              This guidebook is designed specifically for refugee and rural communities who face unique challenges 
              such as displacement, limited resources, climate stress, and social disruption. Permaculture offers 
              a framework not just for sustainable living, but for regenerating ecosystems, building resilient 
              communities, and empowering individuals with practical skills that restore dignity and hope.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Over many years, we have witnessed firsthand the power of permaculture principles to transform 
              barren landscapes into thriving farms, to teach youth skills for self-reliance, and to build 
              bridges between displaced populations and their host communities.
            </p>
          </CardContent>
        </Card>

        {/* Course Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-rrf-green" />
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Understanding culture and its role in permaculture</li>
                <li>• Climate change impacts and solutions</li>
                <li>• Water management and harvesting techniques</li>
                <li>• Soil building and regeneration methods</li>
                <li>• Food forest design and polyculture gardening</li>
                <li>• Natural building and shelter design</li>
                <li>• Integrated pest management strategies</li>
                <li>• Site planning with zoning and sectors</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-rrf-green" />
                Learning Approach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Interactive daily activities and demonstrations</li>
                <li>• Practical hands-on learning experiences</li>
                <li>• Community-based collaborative projects</li>
                <li>• Assessment-based progression system</li>
                <li>• Culturally sensitive and context-specific content</li>
                <li>• Real-world application in refugee settings</li>
                <li>• Vocational training for youth and adults</li>
                <li>• Building resilient community networks</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Chapter Highlights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sprout className="w-6 h-6 mr-2 text-rrf-green" />
              Chapter Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Learning Culture",
                  description: "Understanding cultural values and traditional ecological knowledge in permaculture implementation."
                },
                {
                  title: "Climate Change Solutions",
                  description: "How permaculture builds resilience against climate impacts in refugee and rural contexts."
                },
                {
                  title: "Water Management",
                  description: "Collect, sink, spread, and store techniques for sustainable water systems."
                },
                {
                  title: "Soil Regeneration",
                  description: "Composting, mulching, cover cropping, and biochar for healthy soils."
                },
                {
                  title: "Food Forests",
                  description: "Multi-layered food production systems and mushroom cultivation for livelihoods."
                },
                {
                  title: "Natural Building",
                  description: "Low-cost, sustainable construction techniques using local materials."
                },
                {
                  title: "Pest Management",
                  description: "Ecological approaches to controlling pests without harmful chemicals."
                },
                {
                  title: "Community Development",
                  description: "Using permaculture principles to build resilient, self-reliant communities."
                }
              ].map((chapter, index) => (
                <div key={index} className="p-4 border rounded-lg hover:border-rrf-green transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{chapter.title}</h4>
                  <p className="text-sm text-gray-600">{chapter.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-6 h-6 mr-2 text-rrf-green" />
              Special Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-rrf-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-8 h-8 text-rrf-dark-green" />
                </div>
                <h4 className="font-semibold mb-2">Mushroom Cultivation</h4>
                <p className="text-sm text-gray-600">
                  Inspired by Paul Stamets' work - low-resource mushroom growing for nutrition and income
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rrf-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-rrf-dark-green" />
                </div>
                <h4 className="font-semibold mb-2">Demonstration Farms</h4>
                <p className="text-sm text-gray-600">
                  Learning through practical demonstration sites and hands-on experience
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-rrf-light-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-rrf-dark-green" />
                </div>
                <h4 className="font-semibold mb-2">Six Thinking Hats</h4>
                <p className="text-sm text-gray-600">
                  Using Edward de Bono's method for community decision-making and problem-solving
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Real Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-rrf-light-green p-6 rounded-lg">
              <h4 className="font-semibold mb-3 text-rrf-dark-green">Uganda Success Story</h4>
              <p className="text-gray-700 italic">
                "In Uganda's Rwamwanja Refugee Settlement, Bidi Bid and Wakiso Urban Refugee, 
                youth-led mushroom training projects supported by Regenerosity, Fungi Perfecti and 
                Permayouth enabled over 600 refugee youth to start their own mini-enterprises, 
                improve family nutrition, and become local trainers."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Community?
          </h2>
          <p className="text-gray-600 mb-6">
            Join the movement of learners building resilient, sustainable communities through permaculture education.
          </p>
          <Button 
            size="lg" 
            className="bg-rrf-green hover:bg-rrf-dark-green text-white"
            onClick={onGetStarted}
          >
            Start Learning Today
          </Button>
        </div>
      </div>
    </div>
  );
}