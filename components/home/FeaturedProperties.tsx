import { getFeaturedProperties } from '@/lib/data/properties';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeading from '@/components/ui/section-heading';

const FeaturedProperties = () => {
  const featuredProperties = getFeaturedProperties();
  
  return (
    <section className="container mx-auto px-4">
      <SectionHeading
        title="Featured Properties"
        subtitle="Discover our hand-picked premium listings"
        alignment="center"
      />
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProperties.slice(0, 3).map((property, index) => (
          <PropertyCard 
            key={property.id} 
            property={property}
            className="data-aos='fade-up'"
            data-aos-delay={index * 100}
          />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/properties">
          <Button variant="outline" size="lg">
            Browse All Properties
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProperties;