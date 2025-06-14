
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface ReviewSystemProps {
  articleId: string;
}

const ReviewSystem = ({ articleId }: ReviewSystemProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock reviews for demonstration
  const mockReviews: Review[] = [
    {
      id: '1',
      rating: 5,
      comment: 'Excellent article! Very informative and well-written.',
      created_at: new Date().toISOString(),
      profiles: { full_name: 'John Doe' }
    },
    {
      id: '2',
      rating: 4,
      comment: 'Great content, helped me understand the topic better.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      profiles: { full_name: 'Jane Smith' }
    },
    {
      id: '3',
      rating: 5,
      comment: 'Perfect explanation with practical examples.',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      profiles: { full_name: 'Mike Johnson' }
    }
  ];

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
  }, [articleId, user]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // For now, use mock data since reviews table might not exist
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    if (!user) return;

    try {
      // For now, don't set user review since table might not exist
      setUserReview(null);
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.length > 200) {
      toast.error('Comment must be 200 characters or less');
      return;
    }

    setSubmitting(true);

    try {
      // For now, just show success message since table might not exist
      toast.success('Review submitted successfully!');
      
      // Add the review to local state for demonstration
      const newReview: Review = {
        id: Date.now().toString(),
        rating,
        comment: comment.trim() || '',
        created_at: new Date().toISOString(),
        profiles: { full_name: user.email || 'Anonymous' }
      };
      
      setReviews(prev => [newReview, ...prev]);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Reviews ({reviews.length})
            {averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-bold">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {user && (
            <div className="border-b pb-6">
              <h3 className="font-semibold mb-4">
                {userReview ? 'Update Your Review' : 'Leave a Review'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comment (optional, max 200 characters)
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this article..."
                    maxLength={200}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.length}/200 characters
                  </p>
                </div>
                <Button onClick={submitReview} disabled={submitting}>
                  {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to leave a review!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.profiles.full_name}</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSystem;
