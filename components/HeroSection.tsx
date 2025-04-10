import { ArrowRight } from 'lucide-react';

import Link from 'next/link';
import { getSession } from '../lib/auth';
import { Button } from './ui/button';

export async function HeroSection() {
  const session = getSession();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Exchange Skills, Not Money
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                SkillSwap connects professionals to exchange expertise. Trade
                your skills for the ones you need.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {(await session) ? (
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link href="/signin">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/skills">Browse Skills</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mx-auto lg:ml-auto flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-6 w-full max-w-[400px]">
                    {[
                      'Web Development',
                      'Graphic Design',
                      'Marketing',
                      'Content Writing',
                      'Video Editing',
                      'SEO',
                      'UI/UX Design',
                      'Data Analysis',
                    ].map((skill, ) => (
                      <div
                        key={skill}
                        className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-sm text-center"
                      >
                        <p className="font-medium text-sm">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
