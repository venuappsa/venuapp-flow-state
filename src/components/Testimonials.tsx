
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    quote: "This concept is exactly what our festival needs! Currently, we lose so many sales because people don't want to miss performances while waiting in line. I'm excited about the potential increased revenue.",
    author: "Samuel Johnson",
    role: "Festival Organizer, Johannesburg",
    rating: 5
  },
  {
    quote: "As someone who attends concerts regularly, the idea of not having to miss my favorite songs to stand in line for refreshments would be a complete game-changer!",
    author: "Lerato Khumalo",
    role: "Music Enthusiast, Cape Town",
    rating: 5
  },
  {
    quote: "The analytics and inventory management features would solve major pain points for my food truck business. This could help us prepare more efficiently for each event.",
    author: "David Nkosi",
    role: "Food Vendor, Durban",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl ml-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-venu-black text-left">
            What People <span className="text-venu-orange">Say</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl text-left">
            Early feedback from our validation interviews with potential users of Venuapp.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-left">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="italic text-gray-700 text-left">&ldquo;{testimonial.quote}&rdquo;</p>
              </CardContent>
              <CardFooter className="border-t pt-4 text-left">
                <div>
                  <p className="font-semibold text-venu-black">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
