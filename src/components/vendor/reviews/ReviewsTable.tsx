
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VendorReview } from '@/utils/vendorAnalyticsData';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

interface ReviewsTableProps {
  reviews: VendorReview[];
  loading?: boolean;
}

const ReviewsTable = ({ reviews, loading = false }: ReviewsTableProps) => {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>Feedback from your clients</CardDescription>
        </CardHeader>
        <CardContent className="p-6 h-80 animate-pulse bg-gray-100"></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Customer Reviews</span>
          <div className="flex items-center">
            <span className="text-3xl font-bold mr-2">{averageRating}</span>
            <div className="flex">{renderStars(Number(averageRating))}</div>
          </div>
        </CardTitle>
        <CardDescription>Feedback from your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{review.hostName}</h4>
                      <p className="text-sm text-gray-500">
                        Event: {review.eventName} • {format(new Date(review.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ReviewsTable;
