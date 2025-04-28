
import { useUser } from "@/hooks/useUser";
import { useUserRoles } from "@/hooks/useUserRoles";
import SecurePanelButton from "@/components/SecurePanelButton";
import AuthTransitionWrapper from "@/components/AuthTransitionWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostPanel() {
  return (
    <AuthTransitionWrapper requireAuth allowedRoles={["host"]}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-lg shadow">
              <Building className="h-8 w-8 text-venu-orange" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Host Panel</h1>
              <p className="text-gray-600">Manage your venues and events</p>
            </div>
          </div>
          <SecurePanelButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-venu-orange" />
                Venues
              </CardTitle>
              <CardDescription>Manage your venues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <p className="text-gray-600">Active venues</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Manage Venues</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-venu-orange" />
                Events
              </CardTitle>
              <CardDescription>Manage your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <p className="text-gray-600">Upcoming events</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Manage Events</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-venu-orange" />
                Guests
              </CardTitle>
              <CardDescription>Manage your guest lists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <p className="text-gray-600">Total guests</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Manage Guests</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-venu-orange" />
                Subscription
              </CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-md font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 inline-block">
                Trial
              </div>
              <p className="text-gray-600 mt-2">Expires in 30 days</p>
            </CardContent>
            <CardFooter>
              <Button>Upgrade Plan</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthTransitionWrapper>
  );
}
