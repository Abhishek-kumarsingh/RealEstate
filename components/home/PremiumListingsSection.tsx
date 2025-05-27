'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Maximize, Hotel, Bath, Crown, ExternalLink, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

// Mock premium properties data
const premiumProperties = [
  {
    id: 1,
    title: 'Luxury Penthouse with City Views',
    location: 'Bandra West, Mumbai',
    price: 12500000,
    type: 'sale',
    bedrooms: 4,
    bathrooms: 5,
    area: 3500,
    image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Private Terrace', 'Sea View', 'Premium Finishes', 'Concierge Service'],
    rating: 4.9,
    agent: {
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    }
  },
  {
    id: 2,
    title: 'Modern Villa with Private Pool',
    location: 'Whitefield, Bangalore',
    price: 8500000,
    type: 'sale',
    bedrooms: 5,
    bathrooms: 6,
    area: 4200,
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Private Pool', 'Garden', 'Smart Home', 'Security System'],
    rating: 4.8,
    agent: {
      name: 'Rajesh Kumar',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    }
  },
  {
    id: 3,
    title: 'Heritage Mansion Restored',
    location: 'Golf Course Road, Gurgaon',
    price: 15000000,
    type: 'sale',
    bedrooms: 6,
    bathrooms: 7,
    area: 5000,
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Heritage Property', 'Wine Cellar', 'Home Theater', 'Gym'],
    rating: 5.0,
    agent: {
      name: 'Anita Desai',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      verified: true
    }
  }
];

const PremiumListingsSection = () => {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
  };

  return (
    <section className="container mx-auto">
      <SectionHeading
        title="Premium Listings"
        subtitle="Handpicked luxury properties for discerning buyers"
        alignment="center"
      />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {premiumProperties.map((property, index) => (
          <Card
            key={property.id}
            className={cn(
              'group overflow-hidden transition-all duration-500 hover:shadow-2xl',
              'transform hover:-translate-y-3 bg-gradient-to-br from-card to-card/80'
            )}
            data-aos="fade-up"
            data-aos-delay={index * 150}
            onMouseEnter={() => setHoveredProperty(property.id)}
            onMouseLeave={() => setHoveredProperty(null)}
          >
            {/* Premium badge */}
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 z-20 text-white hover:bg-white/20 hover:text-white"
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* Property Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Price overlay */}
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-2xl font-bold">{formatPrice(property.price)}</div>
                <div className="text-sm opacity-90">For Sale</div>
              </div>

              {/* Rating */}
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center bg-black/50 rounded-full px-3 py-1 text-white">
                  <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{property.rating}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Property Title */}
              <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{property.location}</span>
              </div>

              {/* Property Stats */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center">
                  <Hotel className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center">
                  <Maximize className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{property.area} sqft</span>
                </div>
              </div>

              {/* Premium Features */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {property.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {property.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{property.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Agent Info */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                    <Image
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center">
                      {property.agent.name}
                      {property.agent.verified && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Link href={`/properties/${property.id}`}>
                  <Button 
                    size="sm" 
                    className={cn(
                      'transition-all duration-300',
                      hoveredProperty === property.id ? 'bg-primary text-primary-foreground' : ''
                    )}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View all premium properties */}
      <div className="mt-12 text-center">
        <Link href="/properties?premium=true">
          <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
            <Crown className="w-4 h-4 mr-2" />
            View All Premium Properties
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default PremiumListingsSection;
