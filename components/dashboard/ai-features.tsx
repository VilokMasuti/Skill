"use client"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

import Link from "next/link"
import { Brain, Users, Sparkles } from "lucide-react"
import { Button } from '../ui/button';

export function AIFeatures() {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-600/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI-Powered Features</CardTitle>
        </div>
        <CardDescription>Enhance your skill exchange experience with our AI-powered tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Skill Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized feedback and improvement plans for your skills
                </p>
              </div>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/dashboard/skill-assessment">Assess My Skills</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Skill Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Find the perfect skill exchange partners with our AI matching algorithm
                </p>
              </div>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/matches">Find AI Matches</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
