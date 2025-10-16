
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Users, Star, Award, User } from 'lucide-react';

type TeamMember = {
  name: string;
  id: string;
  initials: string;
};

const teamMembers: TeamMember[] = [
  { name: 'Brandon Desbiens', id: '040-783-025', initials: 'BD' },
  { name: 'Nahed Gnifida', id: '041-151-349', initials: 'NG' },
  { name: 'Kira Ohare', id: '040-984-072', initials: 'KO' },
  { name: 'Justin Burke', id: '041-151-851', initials: 'JB' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="ml-2 font-bold text-lg">EcoTrack</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Sign Up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-6 bg-[hsl(var(--background))]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tighter text-primary sm:text-3xl">
                    Track Your Carbon Footprint, Beautifully
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-lg">
                    EcoTrack helps you understand and reduce your environmental impact. Log activities, visualize your progress, and get personalized tips.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/landing-hero/800/600"
                width={500}
                height={300}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="nature forest"
                priority
              />
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-8 md:py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Project Information</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Details about the EcoTrack project submission.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Team Name</h3>
                </div>
                <p className="text-muted-foreground">Group 1</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Project Reference</h3>
                </div>
                <p className="text-muted-foreground">EcoTrack</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-sm lg:col-span-2">
                 <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold">Algonquin College Facilitator</h3>
                </div>
                <p className="text-muted-foreground">Omar Mostafa</p>
              </div>
            </div>

            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>The talented individuals behind EcoTrack.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">{member.initials}</AvatarFallback>

                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.id}</p>
                      </div>
                    </div>
                    <User className="h-5 w-5 text-muted-foreground"/>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 EcoTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
