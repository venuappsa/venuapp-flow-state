
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-venu-orange/50 to-venu-orange/20 rounded-lg blur-lg opacity-30"></div>
              <div className="relative rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-2">
                  <img 
                    src="/lovable-uploads/0b2edd26-c204-48c3-ab26-197f21f221d8.png"
                    alt="QR code scanning for payment" 
                    className="w-full h-64 object-cover rounded-tl-lg"
                  />
                  <img 
                    src="/lovable-uploads/76dd7914-16d7-4854-b539-a0fea79b38cd.png"
                    alt="Diverse crowd at event" 
                    className="w-full h-64 object-cover rounded-tr-lg"
                  />
                  <img 
                    src="/lovable-uploads/b7e392e3-b381-4940-ac50-b962044c2023.png"
                    alt="Colorful drinks at event" 
                    className="w-full h-64 object-cover rounded-bl-lg"
                  />
                  <img 
                    src="/lovable-uploads/aa94d3ed-e131-45a8-bd6e-12488d6a3989.png"
                    alt="Event celebration" 
                    className="w-full h-64 object-cover rounded-br-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-venu-black mb-6">
              Enhancing <span className="text-venu-orange">Event Experiences</span>
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Venuapp is bridging the gap between attendees, venues, and merchants, creating a unified platform that elevates South Africa's event industry standard.
            </p>
            <div className="relative bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-3 text-venu-black">South Africa's Events Landscape</h3>
              <p className="text-gray-700 mb-4">
                From mega-stadiums hosting tens of thousands, to outdoor festivals and urban nightlife venues, South Africa's event ecosystem is vibrant but faces key challenges:
              </p>
              <ul className="space-y-3">
                <li className="flex">
                  <span className="font-bold text-venu-orange mr-2">•</span>
                  <span>70% of attendees cite long wait times as a major frustration</span>
                </li>
                <li className="flex">
                  <span className="font-bold text-venu-orange mr-2">•</span>
                  <span>Hosts lose 25-30% of potential sales due to inefficient systems</span>
                </li>
                <li className="flex">
                  <span className="font-bold text-venu-orange mr-2">•</span>
                  <span>Venue operators struggle with overcrowding and manual processes</span>
                </li>
              </ul>
            </div>
            <div className="bg-venu-orange/10 p-4 border-l-4 border-venu-orange rounded mb-6">
              <p className="text-venu-black font-medium italic">
                "No one should queue at an event they've paid for."
              </p>
            </div>
            <Button className="bg-venu-orange hover:bg-venu-orange/90">
              <a href="#features">Discover How</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
