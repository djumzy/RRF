import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, CheckCircle, Lock, ArrowRight, ArrowLeft, Award, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CourseChapter, Assessment, StudentProgress } from "@shared/schema";
import rrfLogo from "@assets/RRF LOGO.jpg";

export default function TopicLearning() {
  const [match, params] = useRoute("/course/:courseId/topic/:chapterId");
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'content' | 'assessment' | 'results'>('content');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [assessmentPassed, setAssessmentPassed] = useState<boolean>(false);

  const courseId = params?.courseId;
  const chapterId = params?.chapterId;

  const { data: chapter, isLoading: chapterLoading } = useQuery<CourseChapter>({
    queryKey: ["/api/chapters", chapterId],
    enabled: !!chapterId,
  });

  const { data: course } = useQuery({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const { data: assessment } = useQuery<Assessment>({
    queryKey: ["/api/assessments/chapter", chapterId],
    enabled: !!chapterId && currentView === 'assessment',
  });

  const { data: progress } = useQuery<StudentProgress[]>({
    queryKey: ["/api/progress", user?.id, courseId],
    enabled: !!user && !!courseId,
  });

  const { data: allChapters } = useQuery<CourseChapter[]>({
    queryKey: ["/api/courses", courseId, "chapters"],
    enabled: !!courseId,
  });

  const completeTopicMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/progress/complete`, {
        method: "POST",
        body: JSON.stringify({
          studentId: user?.id,
          courseId: parseInt(courseId!),
          chapterId: parseInt(chapterId!),
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
    },
  });

  const submitAssessmentMutation = useMutation({
    mutationFn: async (answers: Record<number, string>) => {
      return apiRequest(`/api/assessments/${assessment?.id}/submit`, {
        method: "POST",
        body: JSON.stringify({
          studentId: user?.id,
          answers,
        }),
      });
    },
    onSuccess: (result: any) => {
      setAssessmentScore(result.score);
      setAssessmentPassed(result.passed);
      setCurrentView('results');
      
      if (result.passed) {
        completeTopicMutation.mutate();
        toast({
          title: "Congratulations!",
          description: `You scored ${result.score}% and passed this topic!`,
        });
      } else {
        toast({
          title: "Assessment incomplete",
          description: `You scored ${result.score}%. You need 70% to proceed.`,
          variant: "destructive",
        });
      }
    },
  });

  const isTopicCompleted = (topicId: number) => {
    return progress?.some(p => p.chapterId === topicId && p.completed);
  };

  const getCurrentTopicIndex = () => {
    if (!allChapters || !chapterId) return 0;
    return allChapters.findIndex(ch => ch.id === parseInt(chapterId));
  };

  const getNextTopic = () => {
    if (!allChapters) return null;
    const currentIndex = getCurrentTopicIndex();
    return allChapters[currentIndex + 1] || null;
  };

  const getPreviousTopic = () => {
    if (!allChapters) return null;
    const currentIndex = getCurrentTopicIndex();
    return allChapters[currentIndex - 1] || null;
  };

  const canAccessNextTopic = () => {
    return isTopicCompleted(parseInt(chapterId!));
  };

  const handleNextTopic = () => {
    const nextTopic = getNextTopic();
    if (nextTopic && canAccessNextTopic()) {
      setLocation(`/course/${courseId}/topic/${nextTopic.id}`);
    }
  };

  const handlePreviousTopic = () => {
    const prevTopic = getPreviousTopic();
    if (prevTopic) {
      setLocation(`/course/${courseId}/topic/${prevTopic.id}`);
    }
  };

  const handleStartAssessment = () => {
    setCurrentView('assessment');
    setSelectedAnswers({});
    setAssessmentScore(null);
    setAssessmentPassed(false);
  };

  const handleSubmitAssessment = () => {
    if (!assessment) return;
    
    const questions = assessment.questions as any[];
    const allAnswered = questions.every(q => selectedAnswers[q.id]);
    
    if (!allAnswered) {
      toast({
        title: "Please answer all questions",
        description: "You must answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitAssessmentMutation.mutate(selectedAnswers);
  };

  const handleRetryAssessment = () => {
    setCurrentView('assessment');
    setSelectedAnswers({});
    setAssessmentScore(null);
    setAssessmentPassed(false);
  };

  if (chapterLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rrf-green"></div>
      </div>
    );
  }

  const currentTopicIndex = getCurrentTopicIndex();
  const totalTopics = allChapters?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rrf-light-green to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur">
        <div className="flex items-center space-x-3">
          <img src={rrfLogo} alt="RRF Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{course?.title}</h1>
            <p className="text-xs text-gray-500">Topic {currentTopicIndex + 1} of {totalTopics}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setLocation(`/course/${courseId}`)}>
            Back to Course
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/api/logout'}>
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Course Progress</span>
            <span className="text-sm text-gray-500">
              {currentTopicIndex + 1} / {totalTopics} topics
            </span>
          </div>
          <Progress 
            value={((currentTopicIndex + (isTopicCompleted(parseInt(chapterId!)) ? 1 : 0)) / totalTopics) * 100} 
            className="h-2"
          />
        </div>

        {currentView === 'content' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{chapter?.title}</CardTitle>
                {isTopicCompleted(parseInt(chapterId!)) && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {chapter?.content || "Content will be available soon."}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousTopic}
                  disabled={!getPreviousTopic()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Topic
                </Button>

                <div className="flex space-x-4">
                  {!isTopicCompleted(parseInt(chapterId!)) && (
                    <Button
                      onClick={handleStartAssessment}
                      className="bg-rrf-green hover:bg-rrf-dark-green"
                    >
                      Take Assessment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {isTopicCompleted(parseInt(chapterId!)) && getNextTopic() && (
                    <Button
                      onClick={handleNextTopic}
                      className="bg-rrf-green hover:bg-rrf-dark-green"
                    >
                      Next Topic
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'assessment' && assessment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-6 h-6 mr-2 text-rrf-green" />
                Assessment: {chapter?.title}
              </CardTitle>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to score at least 70% to proceed to the next topic.
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(assessment.questions as any[]).map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-4">
                      {index + 1}. {question.question}
                    </h3>
                    <RadioGroup
                      value={selectedAnswers[question.id] || ""}
                      onValueChange={(value) => 
                        setSelectedAnswers(prev => ({...prev, [question.id]: value}))
                      }
                    >
                      {question.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${question.id}_${optIndex}`} />
                          <Label htmlFor={`q${question.id}_${optIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentView('content')}
                  >
                    Back to Content
                  </Button>
                  <Button
                    onClick={handleSubmitAssessment}
                    disabled={submitAssessmentMutation.isPending}
                    className="bg-rrf-green hover:bg-rrf-dark-green"
                  >
                    {submitAssessmentMutation.isPending ? "Submitting..." : "Submit Assessment"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'results' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className={`text-6xl font-bold ${assessmentPassed ? 'text-green-500' : 'text-red-500'}`}>
                  {assessmentScore}%
                </div>
                
                {assessmentPassed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      <span className="text-lg font-semibold">Congratulations! You passed!</span>
                    </div>
                    <p className="text-gray-600">
                      You've successfully completed this topic and can now proceed to the next one.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => setCurrentView('content')}>
                        Review Content
                      </Button>
                      {getNextTopic() && (
                        <Button
                          onClick={handleNextTopic}
                          className="bg-rrf-green hover:bg-rrf-dark-green"
                        >
                          Continue to Next Topic
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-red-600">
                      <AlertCircle className="w-6 h-6 mr-2" />
                      <span className="text-lg font-semibold">You need 70% to proceed</span>
                    </div>
                    <p className="text-gray-600">
                      Review the content and try the assessment again to continue.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => setCurrentView('content')}>
                        Review Content
                      </Button>
                      <Button
                        onClick={handleRetryAssessment}
                        className="bg-rrf-green hover:bg-rrf-dark-green"
                      >
                        Retry Assessment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}