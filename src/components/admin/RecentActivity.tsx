import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, UserPlus } from '@/lib/icons';
import { Button } from '../ui/button';

const activities = [
  {
    type: 'new-user',
    user: 'Olivia Martin',
    details: 'olivia.martin@email.com',
    time: '5m ago',
    initials: 'OM',
    avatarSeed: 'avatar1',
  },
  {
    type: 'new-booking',
    user: 'Jackson Lee',
    details: 'booked The Oceanfront Pearl',
    time: '15m ago',
    initials: 'JL',
    avatarSeed: 'avatar2',
  },
  {
    type: 'new-user',
    user: 'Isabella Nguyen',
    details: 'isabella.nguyen@email.com',
    time: '30m ago',
    initials: 'IN',
    avatarSeed: 'avatar3',
  },
  {
    type: 'new-booking',
    user: 'William Kim',
    details: 'booked Downtown Artist Loft',
    time: '1h ago',
    initials: 'WK',
    avatarSeed: 'avatar4',
  },
];

export default function RecentActivity() {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://picsum.photos/seed/${activity.avatarSeed}/36/36`}
                alt={activity.user}
              />
              <AvatarFallback>{activity.initials}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
              {activity.type === 'new-user' ? (
                <UserPlus className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <Briefcase className="h-3.5 w-3.5 text-green-500" />
              )}
            </span>
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.details}</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        View All Activity
      </Button>
    </div>
  );
}
