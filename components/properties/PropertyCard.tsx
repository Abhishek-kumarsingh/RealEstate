"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { favoritesApi } from '@/lib/api';
import { Heart, MapPin, Maximize, Hotel, Bath, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent' | 'commercial';
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
  };
  amenities: string[];
  images: string[];
  status: string;
  featured: boolean;
  agent: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
  className?: string;
}

const PropertyCard = ({ property, featured = false, className }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    // Simulate AOS animation on component mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      // Redirect to login or show message
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoritesApi.remove(property._id, token);
      } else {
        await favoritesApi.add(property._id, token);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (property.type === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'sold':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
    <Link href={`/properties/${property._id}`}>
      <div
        className={cn(
          'group bg-card rounded-xl shadow-md overflow-hidden transition-all duration-300 h-full hover:shadow-lg',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          featured ? 'lg:flex' : '',
          className
        )}
      >
        {/* Property Image */}
        <div className={cn(
          'relative overflow-hidden',
          featured ? 'lg:w-1/2 aspect-video lg:aspect-auto' : 'aspect-[4/3]'
        )}>
          <Image
            src={property.images[0]}
            alt={property.title}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

          {/* Status indicator */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={getPropertyTypeColor(property.type)}>
              {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Commercial'}
            </Badge>
            {featured && (
              <Badge variant="secondary">
                Featured
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-white hover:bg-white/20 hover:text-white"
            onClick={toggleFavorite}
            disabled={favoriteLoading || !user}
          >
            <Heart className={cn(
              "h-5 w-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "fill-transparent"
            )} />
          </Button>

          {/* Price tag */}
          <div className="absolute bottom-4 left-4">
            <div className="text-white font-bold text-xl">{formatPrice(property.price)}</div>
          </div>
        </div>

        {/* Property Details */}
        <div className={cn(
          'p-5',
          featured ? 'lg:w-1/2 lg:p-6' : ''
        )}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>

          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {formatLocation(property.location)}
            </span>
          </div>

          <p className={cn(
            "text-muted-foreground text-sm mb-4",
            featured ? "line-clamp-3" : "line-clamp-2"
          )}>
            {property.description}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Hotel className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{property.features.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{property.features.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Maximize className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm">{property.features.area} sqft</span>
              </div>
            </div>

            {featured && (
              <Button size="sm" className="mt-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Button>
            )}
          </div>

          {featured && (
            <div className="mt-4 flex items-center">
              <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">{property.agent.name}</div>
                <div className="text-xs text-muted-foreground">{property.agent.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;