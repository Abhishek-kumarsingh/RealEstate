'use client';

import { useState, useEffect } from 'react';
import { propertiesApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Loader2, MapPin, Bed, Bath, Square, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

// Mock data for featured properties
const mockFeaturedProperties = [
  {
    _id: 'mock-1',
    title: 'Luxury Villa with Ocean View',
    description: 'Stunning 4-bedroom villa with panoramic ocean views, private pool, and modern amenities.',
    price: 25000000,
    type: 'sale',
    category: 'residential',
    location: {
      address: '123 Ocean Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      yearBuilt: 2020
    },
    amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security'],
    images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'],
    status: 'available',
    featured: true,
    agent: {
      name: 'Sarah Johnson',
      email: 'sarah@realestate.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  },
  {
    _id: 'mock-2',
    title: 'Modern Downtown Apartment',
    description: 'Contemporary 2-bedroom apartment in the heart of the city with premium amenities.',
    price: 15000000,
    type: 'sale',
    category: 'residential',
    location: {
      address: '456 City Center',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001'
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      yearBuilt: 2021
    },
    amenities: ['Gym', 'Parking', 'Security', 'Elevator'],
    images: ['https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg'],
    status: 'available',
    featured: true,
    agent: {
      name: 'Michael Chen',
      email: 'michael@realestate.com',
      phone: '+91 98765 43211',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
    }
  },
  {
    _id: 'mock-3',
    title: 'Spacious Family Home',
    description: 'Perfect family home with large garden, 3 bedrooms, and excellent school district.',
    price: 18000000,
    type: 'sale',
    category: 'residential',
    location: {
      address: '789 Suburb Lane',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001'
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 2200,
      yearBuilt: 2019
    },
    amenities: ['Garden', 'Parking', 'Storage', 'Balcony'],
    images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'],
    status: 'available',
    featured: true,
    agent: {
      name: 'Emily Rodriguez',
      email: 'emily@realestate.com',
      phone: '+91 98765 43212',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
    }
  }
];

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState(mockFeaturedProperties);
  const [loading, setLoading] = useState(true);
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      // Skip API call during build or if window is not available (SSR)
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      try {
        const response = await propertiesApi.getAll({ featured: 'true', limit: '3' });
        // If we get real properties from the database, use them; otherwise use mock data
        if (response.properties && response.properties.length > 0) {
          setFeaturedProperties(response.properties);
        }
        // If no real properties, we keep the mock data that was set in useState
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'rent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'commercial':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const formatLocation = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }

    if (location && typeof location === 'object') {
      // Try to build a readable address from the location object
      const parts = [];
      if (location.address) parts.push(location.address);
      if (location.city) parts.push(location.city);
      if (location.state) parts.push(location.state);

      return parts.length > 0 ? parts.join(', ') : 'Location not specified';
    }

    return 'Location not specified';
  };

  return (
    <section className="container mx-auto">
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
        <div className="mt-12">
          {/* Show max 3 cards for laptop size as requested */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 equal-height-grid">
            {featuredProperties.length > 0 ? featuredProperties.slice(0, 3).map((property: any, index: number) => (
              <Card
                key={property._id}
                className={cn(
                  'group overflow-hidden transition-all duration-300 hover:shadow-xl',
                  'transform hover:-translate-y-2 relative card-height-standard flex flex-col'
                )}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onMouseEnter={() => setHoveredProperty(property._id)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>

                {/* Property Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Property Type Badge */}
                  <div className="absolute bottom-4 left-4">
                    <Badge className={cn('text-xs font-medium', getPropertyTypeColor(property.type))}>
                      {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Commercial'}
                    </Badge>
                  </div>
                </div>

                {/* Property Content */}
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(property.price)}
                      {property.type === 'rent' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">
                      {formatLocation(property.location)}
                    </span>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.features?.bedrooms || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.features?.bathrooms || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      <span>{property.features?.area || 'N/A'} sq ft</span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-auto">
                    <Link href={`/properties/${property._id}`}>
                      <Button
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        View Details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No featured properties available at the moment.</p>
              </div>
            )}
          </div>

          {/* Show additional properties info if needed */}
          {featuredProperties.length > 3 && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                +{featuredProperties.length - 3} more featured properties available
              </p>
            </div>
          )}
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