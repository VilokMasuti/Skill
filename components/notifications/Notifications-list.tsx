'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { useAuth } from '../../hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Define the Notification type
interface Notification {
  _id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  relatedUser?: {
    _id: string;
    name: string;
    image: string;
  };
}

export function NotificationList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications with React Query
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Mark notifications as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (payload: { ids?: string[]; all?: boolean }) => {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast.error('Failed to update notifications. Please try again.');
      console.error('Error updating notifications:', error);
    },
  });

  const handleMarkAllAsRead = () => {
    markAsReadMutation.mutate({ all: true });
  };

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification: Notification) => (
              <DropdownMenuItem
                key={notification._id}
                className="p-0 focus:bg-transparent"
              >
                <Link
                  href={
                    notification.type === 'message'
                      ? `/messages/${notification.relatedUser?._id}`
                      : notification.type === 'match'
                      ? `/matches`
                      : '#'
                  }
                  className={`flex items-start gap-3 p-4 w-full hover:bg-muted ${
                    !notification.read ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsReadMutation.mutate({ ids: [notification._id] });
                    }
                  }}
                >
                  {notification.relatedUser ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={notification.relatedUser.image}
                        alt={notification.relatedUser.name}
                      />
                      <AvatarFallback>
                        {notification.relatedUser.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <p
                      className={`text-sm ${
                        !notification.read ? 'font-medium' : ''
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
