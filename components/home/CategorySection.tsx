import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

const categories = [
  {
    name: 'Residential',
    description: 'Find your perfect home',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
    href: '/properties?category=residential',
  },
  {
    name: 'Commercial',
    description: 'Office and retail spaces',
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
    href: '/properties?category=commercial',
  },
  {
    name: 'Land',
    description: 'Build your dream property',
    image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg',
    href: '/properties?category=land',
  },
  {
    name: 'Rentals',
    description: 'Temporary housing solutions',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    href: '/properties?type=rent',
  },
];

const CategorySection = () => {
  return (
    <section className="container mx-auto px-4">
      <SectionHeading
        title="Explore by Category"
        subtitle="Browse properties by type to find what you're looking for"
        alignment="center"
      />
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link 
            key={category.name} 
            href={category.href}
            className="group"
          >
            <div 
              className="rounded-xl overflow-hidden relative aspect-square transition-all duration-300 hover:shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
                <p className="text-white/80 mt-1">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;