import { AIFeatures } from '../../components/dashboard/ai-features';
import { DashboardActivity } from '../../components/dashboard/Dashboard-activity';
import { DashboardMatches } from '../../components/dashboard/Dashboard-matches';
import { DashboardOverview } from '../../components/dashboard/Dashboard-overview';
import { DashboardSkills } from '../../components/dashboard/Dashboard-skills';
import { DashboardStats } from '../../components/dashboard/Dashboard-stats';

import { getSession } from '../../lib/auth';

const page = async () => {
  const session = await getSession();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome back, {session?.name}!</p>

      <div className="grid gap-6">
        <DashboardOverview userId={session?.userId || ''} />
        <AIFeatures />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStats userId={session?.userId || ''} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardSkills userId={session?.userId || ''} />
          <DashboardMatches userId={session?.userId || ''} />
        </div>
        <DashboardActivity userId={session?.userId || ''} />
      </div>
      </div>
  );
};
export default page;
