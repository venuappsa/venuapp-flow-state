
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function SubscriptionPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // If user is logged in, redirect to the full subscription management page
  React.useEffect(() => {
    if (user) {
      navigate("/host/subscription");
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Subscribe to Venuapp</h1>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-medium mb-3">Unlock Premium Features</h2>
          <p className="text-gray-700 mb-4">
            Upgrade your Venuapp experience with a subscription plan that fits your needs.
            Get access to premium features, extended limits, and priority support.
          </p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/auth">
              <Button className="flex items-center gap-2">
                Sign in to subscribe <ArrowRight size={16} />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View plans
            </Button>
          </div>
        </div>
        
        <div id="plans" className="pt-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>For individual hosts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$4.99<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>5 events per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>10 merchants per event</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>5 admin users</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/auth" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Premium Plan */}
            <Card className="border-2 border-venu-orange shadow-lg">
              <CardHeader>
                <div className="bg-venu-orange text-white text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">POPULAR</div>
                <CardTitle>Premium</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>15 events per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>25 merchants per event</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>15 admin users</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/auth" className="w-full">
                  <Button className="w-full bg-venu-orange hover:bg-venu-orange/90">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">$24.99<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited merchants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited admin users</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/auth" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
