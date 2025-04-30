
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface HostReviewFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  vendorId: string;
  vendorName: string;
  eventId: string;
  eventName: string;
  onReviewSubmit: (review: {
    rating: number;
    comment: string;
    vendorId: string;
    eventId: string;
  }) => void;
}

const HostReviewForm = ({
  open,
  setOpen,
  vendorId,
  vendorName,
  eventId,
  eventName,
  onReviewSubmit
}: HostReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    // Submit the review
    onReviewSubmit({
      rating,
      comment,
      vendorId,
      eventId
    });
    
    // Reset form and close dialog
    setTimeout(() => {
      setSubmitting(false);
      setRating(0);
      setComment('');
      setOpen(false);
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <DialogDescription>
            Share your feedback about {vendorName} for {eventName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      (hoverRating ? star <= hoverRating : star <= rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Please share your experience with this vendor..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || rating === 0}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostReviewForm;
