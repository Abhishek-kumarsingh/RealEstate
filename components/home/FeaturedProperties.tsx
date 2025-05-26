'use client';

import { useState, useEffect } from 'react';
import { propertiesApi } from '@/lib/api';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import SectionHeading from '@/components/ui/section-heading';

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertiesApi.getAll({ featured: 'true', limit: '3' });
        setFeaturedProperties(response.properties || []);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="container mx-auto px-4">
      <SectionHeading
        title="Featured Properties"
        subtitle="Discover our hand-picked premium listings"
        alignment="center"
      />

      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property: any, index: number) => (
            <PropertyCard
              key={property._id}
              property={property}
              className="data-aos='fade-up'"
              data-aos-delay={index * 100}
            />
          ))}
        </div>
      )}

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