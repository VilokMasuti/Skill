/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

import {
  BarChart,
  Brain,
  Info,
  Lightbulb,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

interface SkillAssessmentContentProps {
  userId: string;
}

export function SkillAssessmentContent({
  userId,
}: SkillAssessmentContentProps) {
  const [skillDescription, setSkillDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState([5]);
  const [selectedSkill, setSelectedSkill] = useState('');

  // Fetch user skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/skills`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      return response.json();
    },
  });

  // AI assessment mutation
  const assessmentMutation = useMutation({
    mutationFn: async (data: {
      skill: string;
      description: string;
      level: number;
    }) => {
      const response = await fetch('/api/ai/skill-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to complete skill assessment');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('AI skill assessment completed successfully!');
    },
    onError: () => {
      toast.error('Failed to complete skill assessment. Please try again.');
    },
  });

  const handleAssessment = () => {
    if (!selectedSkill && !skillDescription) {
      toast.error('Please select a skill or describe your skill');
      return;
    }

    assessmentMutation.mutate({
      skill: selectedSkill || 'Custom Skill',
      description:
        skillDescription ||
        `I have experience with ${selectedSkill} at a level ${skillLevel[0]} out of 10.`,
      level: skillLevel[0],
    });
  };

  // Get assessment result from mutation data
  const assessmentResult = assessmentMutation.data;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Skill Assessment</CardTitle>
          </div>
          <CardDescription>
            Get an AI-powered assessment of your skills and personalized
            recommendations for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Powered by Hugging Face AI</AlertTitle>
            <AlertDescription>
              This feature uses Hugging Face&apos;s
              sentence-transformers/all-MiniLM-L6-v2 model to analyze your
              skills and provide personalized recommendations based on your
              description and skill level.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Select a skill to assess</Label>
            <div className="flex flex-wrap gap-2">
              {skillsLoading ? (
                <div className="w-full h-10 bg-muted animate-pulse rounded" />
              ) : skills && skills.length > 0 ? (
                skills.map((skill: any) => (
                  <Button
                    key={skill._id}
                    variant={
                      selectedSkill === skill.title ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedSkill(skill.title)}
                  >
                    {skill.title}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills found. Add skills to your profile first.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Describe your experience with this skill (for better AI analysis)
            </Label>
            <Textarea
              placeholder="Describe your experience, projects you've worked on, challenges you've faced, and areas you want to improve..."
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground">
              The more details you provide, the more personalized your AI
              assessment will be.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Your current skill level</Label>
              <span className="text-sm text-muted-foreground">
                {skillLevel[0]}/10
              </span>
            </div>
            <Slider
              value={skillLevel}
              onValueChange={setSkillLevel}
              max={10}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAssessment}
            disabled={assessmentMutation.isPending}
            className="w-full"
          >
            {assessmentMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI is analyzing your skill...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Get AI Assessment
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {assessmentResult && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-t-xl">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>AI Assessment Results</CardTitle>
            </div>
            <CardDescription>
              AI-powered analysis of your {selectedSkill || 'skill'} (Level:{' '}
              {assessmentResult.currentLevel})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="strengths">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="weaknesses">Areas to Improve</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
              </TabsList>
              <TabsContent value="strengths" className="space-y-4 pt-4">
                <ul className="space-y-2">
                  {assessmentResult.strengths.map((strength: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="weaknesses" className="space-y-4 pt-4">
                <ul className="space-y-2">
                  {assessmentResult.weaknesses.map((weakness: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium flex items-center mb-2">
                      <Lightbulb className="mr-2 h-4 w-4 text-primary" /> AI
                      Improvement Plan
                    </h4>
                    <ul className="space-y-2">
                      {assessmentResult.recommendations.map(
                        (recommendation: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span>{recommendation}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium flex items-center mb-2">
                      <BarChart className="mr-2 h-4 w-4 text-primary" />{' '}
                      Recommended Resources
                    </h4>
                    <ul className="space-y-2">
                      {assessmentResult.resources.map((resource: { link: string | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
                          <span>
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {resource.title}
                            </a>{' '}
                            ({resource.type})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              Save Assessment
            </Button>
            <Button variant="outline" size="sm">
              Share Results
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
