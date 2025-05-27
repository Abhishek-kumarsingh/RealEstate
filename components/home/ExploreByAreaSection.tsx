'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, TrendingUp, Home, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

const popularAreas = [
  {
    id: 1,
    name: 'Downtown Delhi',
    state: 'Delhi',
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: 245,
    avgPrice: '₹85,00,000',
    priceChange: '+12%',
    trending: true,
    description: 'Prime commercial and residential hub',
    highlights: ['Metro connectivity', 'Shopping centers', 'Business district']
  },
  {
    id: 2,
    name: 'Bandra West',
    state: 'Mumbai',
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: 189,
    avgPrice: '₹1,20,00,000',
    priceChange: '+8%',
    trending: true,
    description: 'Upscale neighborhood with sea views',
    highlights: ['Sea facing', 'Celebrity homes', 'Fine dining']
  },
  {
    id: 3,
    name: 'Koramangala',
    state: 'Bangalore',
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: 156,
    avgPrice: '₹75,00,000',
    priceChange: '+15%',
    trending: true,
    description: 'Tech hub with modern amenities',
    highlights: ['IT corridor', 'Startup ecosystem', 'Modern infrastructure']
  },
  {
    id: 4,
    name: 'Cyber City',
    state: 'Gurgaon',
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: 134,
    avgPrice: '₹95,00,000',
    priceChange: '+10%',
    trending: false,
    description: 'Corporate headquarters and luxury living',
    highlights: ['Corporate offices', 'Luxury malls', 'Metro access']
  },
  {
    id: 5,
    name: 'Hitech City',
    state: 'Hyderabad',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: 98,
    avgPrice: '₹65,00,000',
    priceChange: '+18%',
    trending: true,
    description: 'IT and pharmaceutical hub',
    highlights: ['Tech companies', 'Research centers', 'Modern lifestyle']
  },
  {
    id: 6,
    name: 'Salt Lake',
    state: 'Kolkata',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: 87,
    avgPrice: '₹45,00,000',
    priceChange: '+6%',
    trending: false,
    description: 'Planned city with green spaces',
    highlights: ['Planned layout', 'IT sector', 'Cultural heritage']
  }
];

const ExploreByAreaSection = () => {
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  return (
    <section className="container mx-auto">
      <SectionHeading
        title="Explore Properties by Area"
        subtitle="Discover the most popular locations across major cities"
        alignment="center"
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularAreas.map((area, index) => (
          <Link
            key={area.id}
            href={`/areas/${area.name.toLowerCase().replace(/\s+/g, '-')}-${area.state.toLowerCase().replace(/\s+/g, '-')}`}
            className="group"
            onMouseEnter={() => setHoveredArea(area.id)}
            onMouseLeave={() => setHoveredArea(null)}
          >
            <Card
              className={cn(
                'overflow-hidden transition-all duration-300 hover:shadow-xl',
                'transform hover:-translate-y-2 card-height-area flex flex-col'
              )}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={area.image}
                  alt={area.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Trending badge */}
                {area.trending && (
                  <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}

                {/* Price change indicator */}
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-white border-white/20',
                      area.priceChange.startsWith('+') ? 'bg-green-500/80' : 'bg-red-500/80'
                    )}
                  >
                    {area.priceChange}
                  </Badge>
                </div>

                {/* Area info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{area.name}</h3>
                  <p className="text-white/80 text-sm mb-2">{area.state}</p>
                  <p className="text-white/90 text-sm mb-3">{area.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        {area.properties}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {area.avgPrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Available Properties</span>
                    <span className="font-semibold">{area.properties}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Price</span>
                    <span className="font-semibold">{area.avgPrice}</span>
                  </div>

                  {/* Highlights */}
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-1">
                      {area.highlights.slice(0, 3).map((highlight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* View all areas button */}
      <div className="mt-12 text-center">
        <Link
          href="/properties"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Explore All Areas
        </Link>
      </div>
    </section>
  );
};

export default ExploreByAreaSection;
