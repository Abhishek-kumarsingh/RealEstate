"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, TrendingUp, Home, DollarSign, BarChart3, Users, Building, Car, ShoppingBag, GraduationCap, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeading from '@/components/ui/section-heading';
import PropertyCard from '@/components/properties/PropertyCard';
import { cn } from '@/lib/utils';

// Mock data for area details - in real app, this would come from API
const getAreaDetails = (areaName: string) => {
  const areas = {
    'mumbai-bandra': {
      id: 1,
      name: 'Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Upscale neighborhood known for its vibrant nightlife, shopping, and celebrity homes.',
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      coverImage: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      properties: '2,450',
      avgPrice: '₹2.5 Cr',
      priceChange: '+12%',
      trending: true,
      highlights: ['Shopping Districts', 'Nightlife', 'Celebrity Homes', 'Sea Link Access'],
      demographics: {
        population: '250,000',
        averageAge: '32',
        familySize: '3.2',
        literacy: '95%'
      },
      amenities: [
        { name: 'Shopping Malls', icon: ShoppingBag, count: '15+' },
        { name: 'Schools', icon: GraduationCap, count: '25+' },
        { name: 'Hospitals', icon: Hospital, count: '8+' },
        { name: 'Metro Stations', icon: Car, count: '3' }
      ],
      marketTrends: {
        priceGrowth: '+12%',
        demandLevel: 'High',
        investmentRating: '4.5/5',
        rentalYield: '3.2%'
      },
      nearbyAreas: [
        { name: 'Khar', distance: '2 km', avgPrice: '₹2.2 Cr' },
        { name: 'Santacruz', distance: '3 km', avgPrice: '₹1.8 Cr' },
        { name: 'Juhu', distance: '4 km', avgPrice: '₹3.1 Cr' }
      ]
    }
    // Add more areas as needed
  };

  return areas[areaName as keyof typeof areas] || areas['mumbai-bandra'];
};

const AreaDetailPage = () => {
  const params = useParams();
  const areaSlug = params.area as string;
  const [area, setArea] = useState(getAreaDetails(areaSlug));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src={area.coverImage}
          alt={area.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-6xl font-bold section-heading-shadow-strong">
                {area.name}
              </h1>
              {area.trending && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <div className="flex items-center text-white/90 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">{area.city}, {area.state}</span>
            </div>
            <p className="text-lg text-white/90 max-w-2xl section-heading-shadow">
              {area.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <Home className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">{area.properties}</div>
              <div className="text-sm text-muted-foreground">Properties Available</div>
            </CardContent>
          </Card>
          
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">{area.avgPrice}</div>
              <div className="text-sm text-muted-foreground">Average Price</div>
            </CardContent>
          </Card>
          
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <div className="text-2xl font-bold">{area.priceChange}</div>
              <div className="text-sm text-muted-foreground">Price Growth</div>
            </CardContent>
          </Card>
          
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">{area.marketTrends.investmentRating}</div>
              <div className="text-sm text-muted-foreground">Investment Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Area Highlights */}
        <section className="mb-12">
          <SectionHeading
            title="Area Highlights"
            subtitle="What makes this location special"
          />
          
          <div className="mt-8 flex flex-wrap gap-3">
            {area.highlights.map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-sm py-2 px-4">
                {highlight}
              </Badge>
            ))}
          </div>
        </section>

        {/* Amenities */}
        <section className="mb-12">
          <SectionHeading
            title="Local Amenities"
            subtitle="Essential facilities and services nearby"
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {area.amenities.map((amenity, index) => (
              <Card key={index} className="card-height-compact">
                <CardContent className="p-6 text-center">
                  <amenity.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="font-semibold">{amenity.name}</div>
                  <div className="text-sm text-muted-foreground">{amenity.count}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Trends */}
        <section className="mb-12">
          <SectionHeading
            title="Market Analysis"
            subtitle="Current market trends and investment insights"
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-height-compact">
              <CardHeader>
                <CardTitle className="text-sm">Price Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{area.marketTrends.priceGrowth}</div>
                <div className="text-xs text-muted-foreground">Year over year</div>
              </CardContent>
            </Card>
            
            <Card className="card-height-compact">
              <CardHeader>
                <CardTitle className="text-sm">Demand Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.marketTrends.demandLevel}</div>
                <div className="text-xs text-muted-foreground">Current market</div>
              </CardContent>
            </Card>
            
            <Card className="card-height-compact">
              <CardHeader>
                <CardTitle className="text-sm">Investment Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.marketTrends.investmentRating}</div>
                <div className="text-xs text-muted-foreground">Expert rating</div>
              </CardContent>
            </Card>
            
            <Card className="card-height-compact">
              <CardHeader>
                <CardTitle className="text-sm">Rental Yield</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{area.marketTrends.rentalYield}</div>
                <div className="text-xs text-muted-foreground">Annual return</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nearby Areas */}
        <section className="mb-12">
          <SectionHeading
            title="Nearby Areas"
            subtitle="Explore similar neighborhoods"
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {area.nearbyAreas.map((nearbyArea, index) => (
              <Card key={index} className="card-height-compact hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{nearbyArea.name}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="text-sm font-medium">{nearbyArea.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Price</span>
                      <span className="text-sm font-medium">{nearbyArea.avgPrice}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Explore Area
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <SectionHeading
            title="Ready to Explore Properties?"
            subtitle="Browse available properties in this area"
          />
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/properties?location=${encodeURIComponent(area.name + ', ' + area.state)}`}>
              <Button size="lg">
                View All Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Agent
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AreaDetailPage;
