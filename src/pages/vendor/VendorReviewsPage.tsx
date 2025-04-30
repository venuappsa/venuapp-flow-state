
import React, { useEffect, useState } from "react";
import VendorPanelLayout from "@/components/layouts/VendorPanelLayout";
import { useUser } from "@/hooks/useUser";
import ReviewsTable from "@/components/vendor/reviews/ReviewsTable";
import { getVendorData } from "@/utils/vendorAnalyticsData";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function VendorReviewsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const data = getVendorData(user.id);
      setVendorData(data);
      setLoading(false);
    }
  }, [user]);

  // Calculate rating distribution
  const getRatingDistribution = () => {
    if (!vendorData?.reviews || vendorData.reviews.length === 0) {
      return Array(5).fill(0);
    }

    const distribution = Array(5).fill(0);
    vendorData.reviews.forEach((review: any) => {
      distribution[review.rating - 1]++;
    });

    return distribution;
  };
  
  const getRatingPercentage = (count: number) => {
    if (!vendorData?.reviews || vendorData.reviews.length === 0) return 0;
    return (count / vendorData.reviews.length) * 100;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <VendorPanelLayout>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-venu-purple to-venu-dark-purple mb-6">
          Customer Reviews & Ratings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Distribution Card */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Overall Rating */}
                  <div className="text-center mb-6">
                    {vendorData?.reviews && vendorData.reviews.length > 0 ? (
                      <>
                        <div className="text-5xl font-bold">
                          {(vendorData.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / 
                           vendorData.reviews.length).toFixed(1)}
                        </div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < (vendorData.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / 
                                vendorData.reviews.length)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Based on {vendorData.reviews.length} reviews
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl font-bold">N/A</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-gray-300" />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          No reviews yet
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Rating Distribution Bars */}
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating, index) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 w-12">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        </div>
                        <Progress
                          value={getRatingPercentage(ratingDistribution[rating - 1])}
                          className="h-2"
                        />
                        <div className="w-10 text-xs text-gray-500">
                          {ratingDistribution[rating - 1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="col-span-1 lg:col-span-2">
            <ReviewsTable
              reviews={vendorData?.reviews || []}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </VendorPanelLayout>
  );
}
