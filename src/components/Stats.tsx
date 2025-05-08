
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, UsersIcon, CreditCardIcon, Clock } from "lucide-react";

const stats = [
  {
    value: "5-10M",
    label: "Potential Annual Users in South Africa",
    icon: <UsersIcon className="h-6 w-6 text-venu-orange" />
  },
  {
    value: "30%",
    label: "Projected Revenue Increase for Venues",
    icon: <CreditCardIcon className="h-6 w-6 text-venu-orange" />
  },
  {
    value: "20-45",
    label: "Minutes Saved In Each Queue",
    icon: <Clock className="h-6 w-6 text-venu-orange" />
  },
  {
    value: "1000+",
    label: "Events That Could Benefit Annually",
    icon: <CalendarIcon className="h-6 w-6 text-venu-orange" />
  }
];

const Stats = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl ml-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black text-left">
            Unlocking <span className="text-venu-orange">Potential</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl text-left">
            Venuapp aims to solve critical challenges in South Africa's event ecosystem with impressive projected results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src="/lovable-uploads/9f665db8-609e-4915-8bfa-cead03020d24.png" 
              alt="Event experience" 
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white text-left">
              <p className="text-lg font-semibold">
                No Queues, Just Vibes. <span className="font-normal">No one should queue at an event they've paid for.</span>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-left">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-venu-black">{stat.value}</div>
                  <p className="mt-2 text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
