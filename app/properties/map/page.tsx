"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Grid3X3,
  List,
  Search,
  Filter,
  SlidersHorizontal,
  Bed,
  Bath,
  Square,
  Calendar,
  Heart,
  Share,
  Eye
} from 'lucide-react';
import PropertyMap from '@/components/maps/PropertyMap';
import PropertyCard from '@/components/properties/PropertyCard';
import { properties as mockProperties } from '@/lib/data/properties';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface Property {
  id: string;
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
    coordinates: {
      lat: number;
      lng: number;
    };
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
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PropertiesMapPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'grid' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [searchAreaProperties, setSearchAreaProperties] = useState<Property[]>(properties);

  // Filter properties based on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredProperties(filtered);
  }, [searchQuery, properties]);

  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
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

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const handlePropertyHover = (property: Property | null) => {
    setHoveredProperty(property);
  };

  const handleSearchAreaChange = (properties: Property[]) => {
    setSearchAreaProperties(properties);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card mt-16 md:mt-20">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Properties Map</h1>
              <p className="text-muted-foreground mt-1">
                Explore {filteredProperties.length} properties on the interactive map
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                <TabsList>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-6">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          {/* Map View */}
          <TabsContent value="map" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map */}
              <div className="lg:col-span-2">
                <PropertyMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={handlePropertySelect}
                  onPropertyHover={handlePropertyHover}
                  onSearchAreaChange={handleSearchAreaChange}
                  height="600px"
                  showControls={true}
                  showFilters={true}
                  enableClustering={true}
                  clusterRadius={60}
                  enableDrawing={true}
                  className="w-full"
                />
              </div>

              {/* Property Details Sidebar */}
              <div className="space-y-4">
                {selectedProperty ? (
                  <Card>
                    <CardContent className="p-0">
                      {/* Property Image */}
                      <div className="relative aspect-video">
                        <Image
                          src={selectedProperty.images[0]}
                          alt={selectedProperty.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary text-primary-foreground">
                            For {selectedProperty.type === 'sale' ? 'Sale' : selectedProperty.type === 'rent' ? 'Rent' : 'Commercial'}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Property Info */}
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{selectedProperty.title}</h3>
                          <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {formatLocation(selectedProperty.location)}
                          </div>
                        </div>

                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(selectedProperty.price, selectedProperty.type)}
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {selectedProperty.features.bedrooms} beds
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {selectedProperty.features.bathrooms} baths
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {selectedProperty.features.area.toLocaleString()} sqft
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {selectedProperty.description}
                        </p>

                        {/* Agent Info */}
                        <div className="flex items-center gap-3 pt-3 border-t">
                          <Image
                            src={selectedProperty.agent.avatar}
                            alt={selectedProperty.agent.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium text-sm">{selectedProperty.agent.name}</div>
                            <div className="text-xs text-muted-foreground">{selectedProperty.agent.phone}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button asChild className="flex-1">
                            <Link href={`/properties/${selectedProperty.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-semibold mb-2">Select a Property</h3>
                      <p className="text-sm text-muted-foreground">
                        Click on any property marker on the map to view details
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {searchAreaProperties.length !== filteredProperties.length ? 'In Search Areas' : 'Total Properties'}
                      </span>
                      <span className="font-medium">{searchAreaProperties.length}</span>
                    </div>
                    {searchAreaProperties.length !== filteredProperties.length && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Available</span>
                        <span className="font-medium">{filteredProperties.length}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">For Sale</span>
                      <span className="font-medium">{searchAreaProperties.filter(p => p.type === 'sale').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">For Rent</span>
                      <span className="font-medium">{searchAreaProperties.filter(p => p.type === 'rent').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commercial</span>
                      <span className="font-medium">{searchAreaProperties.filter(p => p.type === 'commercial').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <span className="font-medium">{searchAreaProperties.filter(p => p.featured).length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Grid View */}
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={{
                    _id: property.id,
                    title: property.title,
                    description: property.description,
                    price: property.price,
                    type: property.type,
                    category: property.category,
                    location: {
                      address: property.location.address,
                      city: property.location.city,
                      state: property.location.state,
                      zipCode: property.location.zipCode,
                    },
                    features: property.features,
                    amenities: property.amenities,
                    images: property.images,
                    status: property.status,
                    featured: property.featured,
                    agent: {
                      name: property.agent.name,
                      email: property.agent.email,
                      phone: property.agent.phone,
                      avatar: property.agent.avatar,
                    },
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="relative w-64 h-48">
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-xl mb-2">{property.title}</h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {formatLocation(property.location)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {formatPrice(property.price, property.type)}
                          </div>
                          <Badge variant="secondary" className="mt-1">
                            {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Commercial'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {property.features.bedrooms} beds
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            {property.features.bathrooms} baths
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            {property.features.area.toLocaleString()} sqft
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Built {property.features.yearBuilt}
                          </div>
                        </div>

                        <Button asChild>
                          <Link href={`/properties/${property.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
