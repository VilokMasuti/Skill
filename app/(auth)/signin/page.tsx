import { redirect } from 'next/navigation';
import { SignInForm } from '../../../components/auth/Sign-in-form';
import Orb from '../../../components/ui/Orb';
import { getSession } from '../../../lib/auth';

export default async function SignInPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen shadow-2xl b bg-zinc-950">
      {/* Left side */}
      <div className="relative flex items-center justify-center text-white font-bold text-2xl w-full lg:w-1/2 h-1/3 lg:h-full">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={2}
          forceHoverState={false}
        />
        <h1 className="absolute antialiased  text-xl sm:text-5xl lg:5xl xl:5xl  text-center px-4   tracking-wide not-only: gap-2  font-heading  bg-gradient-to-r from-slate-50  to-zinc-950 bg-clip-text text-transparent    capitalize">
          Welcome to <br /> SkillSwap
        </h1>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-black">
        <div className="w-full max-w-md p-6 sm:p-8">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
