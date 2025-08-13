import { Star, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader } from './ui/card';

type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  authorImage?: string;
};

type ReviewCardProps = {
  review: Review;
};

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="flex gap-4">
      <Avatar>
        {/* TODO: Connect authorImage to user profile pictures */}
        <AvatarImage src={review.authorImage} alt={review.author} />
        <AvatarFallback>
          <UserCircle className="h-10 w-10 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-bold">{review.author}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-muted-foreground mt-2">{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
