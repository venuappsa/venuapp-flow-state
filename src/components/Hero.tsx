
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="pt-20 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-venu-black">
              <span className="text-venu-orange">No Queues,</span><br />
              Just Vibes
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg">
              South Africa's premier mobile marketplace for live events & nightlife entertainment venues offering food & drinks with delivery-to-seat and convenient collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-venu-orange text-white hover:bg-venu-orange/90 text-lg px-8 py-6">
                <a href="/subscribe">Get Started</a>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-venu-orange text-venu-orange hover:bg-venu-orange/10 text-lg px-8 py-6">
                <a href="#roles">Explore Roles</a>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#" className="flex items-center gap-2 bg-card text-card-foreground px-4 py-3 rounded-lg hover:bg-secondary transition-colors border border-input">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <div>
                  <span className="text-xs block">Download on the</span>
                  <span className="text-sm font-semibold">App Store (Coming Soon)</span>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 bg-card text-card-foreground px-4 py-3 rounded-lg hover:bg-secondary transition-colors border border-input">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <div>
                  <span className="text-xs block">GET IT ON</span>
                  <span className="text-sm font-semibold">Google Play (Coming Soon)</span>
                </div>
              </a>
            </div>
          </div>
          <div className="relative animate-slide-up">
            <div className="absolute -inset-4 bg-gradient-to-r from-venu-orange to-venu-orange/50 rounded-lg blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-6 rounded-lg shadow-xl overflow-hidden">
              <img 
                src="/lovable-uploads/917c39bc-7b90-437d-96e9-fbadf75ce4fa.png"
                alt="Friends enjoying drinks at an event" 
                className="w-full h-auto rounded shadow"
              />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 opacity-30 blur-sm rounded-full bg-venu-orange" />
              <div className="absolute -top-16 -left-16 w-40 h-40 opacity-30 blur-sm rounded-full bg-venu-orange" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                <div className="absolute bottom-4 left-4 right-4 bg-card/90 text-card-foreground p-4 rounded backdrop-blur-sm z-10">
                  <p className="text-sm md:text-base">Experience events without the wait. Order food, drinks, and merchandise with instant delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
