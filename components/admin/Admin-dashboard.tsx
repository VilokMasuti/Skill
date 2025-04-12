'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AdminSkills } from './Admin-skill';
import { AdminStats } from './Admin-stats';
import { AdminSubscriptions } from './Admin-sub';
import { AdminUsers } from './Admin-users';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminStats />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
        <TabsContent value="skills">
          <AdminSkills />
        </TabsContent>
        <TabsContent value="subscriptions">
          <AdminSubscriptions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
