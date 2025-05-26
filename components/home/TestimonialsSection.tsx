import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SectionHeading from '@/components/ui/section-heading';
import { StarIcon } from 'lucide-react';

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    content: "We found our dream home thanks to RealEstateHub. The platform was easy to use, and the agent was incredibly helpful throughout the entire process.",
    author: {
      name: "Emma Wilson",
      role: "Homeowner",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    },
    rating: 5,
  },
  {
    id: 2,
    content: "As a first-time buyer, I was nervous about the process. RealEstateHub made it simple with their helpful guides and expert agents who answered all my questions.",
    author: {
      name: "David Rodriguez",
      role: "First-time Buyer",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    },
    rating: 5,
  },
  {
    id: 3,
    content: "I listed my property with RealEstateHub and had multiple offers within days. Their marketing strategies and professional photography made all the difference.",
    author: {
      name: "Sophia Chen",
      role: "Property Seller",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="container mx-auto py-8">
      <SectionHeading
        title="What Our Clients Say"
        subtitle="Hear from the people who found their perfect property with us"
        alignment="center"
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="bg-card rounded-xl p-6 shadow-sm border border-border"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            {/* Rating */}
            <div className="flex mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-card-foreground mb-6">{testimonial.content}</p>

            {/* Author */}
            <div className="flex items-center mt-auto">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={testimonial.author.avatar} alt={testimonial.author.name} />
                <AvatarFallback>{testimonial.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{testimonial.author.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.author.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;