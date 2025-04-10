import { redirect } from 'next/navigation';

import { SignUpForm } from '../../../components/auth/Sign-up-form';
import { getSession } from '../../../lib/auth';
import Orb from '../../../components/ui/Orb';

export default async function SignUpPage() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen shadow-2xl">
      {/* Left side */}
      <div className="relative flex items-center justify-center text-white font-bold text-2xl w-full lg:w-1/2 h-1/3 lg:h-full">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={2}
          forceHoverState={false}
        />
        <h1 className="absolute antialiased text-xl sm:text-5xl lg:5xl xl:5xl font-bold text-center px-4 tracking-wide  capitalize">
          Welcome to <br /> SkillSwap
        </h1>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white dark:bg-black">
        <div className="w-full max-w-md p-6 sm:p-8">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
