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
    'bandra-mumbai-maharashtra': {
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
      ],
      gallery: [
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
        'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg',
        'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
        'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'
      ],
      keyFeatures: [
        {
          title: 'Entertainment Hub',
          description: 'Vibrant nightlife and entertainment options',
          icon: Building
        },
        {
          title: 'Shopping Paradise',
          description: 'Premium shopping malls and boutiques',
          icon: ShoppingBag
        },
        {
          title: 'Sea Link Access',
          description: 'Direct connectivity via Bandra-Worli Sea Link',
          icon: Car
        },
        {
          title: 'Celebrity Homes',
          description: 'Home to Bollywood celebrities and affluent residents',
          icon: Users
        }
      ]
    },
    'downtown-delhi-delhi': {
      id: 2,
      name: 'Downtown Delhi',
      city: 'Delhi',
      state: 'Delhi',
      description: 'The heart of India\'s capital, featuring historic landmarks, government buildings, and bustling commercial districts.',
      image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg',
      coverImage: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg',
      properties: '3,200',
      avgPrice: '₹1.8 Cr',
      priceChange: '+8%',
      trending: true,
      highlights: ['Historic Landmarks', 'Government Quarter', 'Metro Connectivity', 'Cultural Heritage'],
      demographics: {
        population: '180,000',
        averageAge: '35',
        familySize: '3.8',
        literacy: '92%'
      },
      amenities: [
        { name: 'Metro Stations', icon: Car, count: '12+' },
        { name: 'Schools', icon: GraduationCap, count: '30+' },
        { name: 'Hospitals', icon: Hospital, count: '15+' },
        { name: 'Shopping Centers', icon: ShoppingBag, count: '20+' }
      ],
      marketTrends: {
        priceGrowth: '+8%',
        demandLevel: 'Very High',
        investmentRating: '4.7/5',
        rentalYield: '4.1%'
      },
      nearbyAreas: [
        { name: 'Connaught Place', distance: '1.5 km', avgPrice: '₹2.2 Cr' },
        { name: 'Karol Bagh', distance: '3 km', avgPrice: '₹1.5 Cr' },
        { name: 'Lajpat Nagar', distance: '4 km', avgPrice: '₹1.3 Cr' }
      ],
      gallery: [
        'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg',
        'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg',
        'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
        'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'
      ],
      keyFeatures: [
        {
          title: 'Prime Location',
          description: 'Located in the heart of Delhi with excellent connectivity',
          icon: MapPin
        },
        {
          title: 'Metro Access',
          description: 'Multiple metro lines connecting to all parts of Delhi',
          icon: Car
        },
        {
          title: 'Historic Significance',
          description: 'Rich cultural heritage with numerous monuments',
          icon: Building
        },
        {
          title: 'Commercial Hub',
          description: 'Major business district with corporate offices',
          icon: Users
        }
      ]
    },
    'gurgaon-haryana': {
      id: 3,
      name: 'Gurgaon',
      city: 'Gurgaon',
      state: 'Haryana',
      description: 'Modern financial and technology hub with world-class infrastructure and amenities.',
      image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      coverImage: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      properties: '4,100',
      avgPrice: '₹1.2 Cr',
      priceChange: '+15%',
      trending: true,
      highlights: ['IT Hub', 'Modern Infrastructure', 'Shopping Malls', 'Corporate Offices'],
      demographics: {
        population: '320,000',
        averageAge: '29',
        familySize: '3.1',
        literacy: '97%'
      },
      amenities: [
        { name: 'IT Parks', icon: Building, count: '25+' },
        { name: 'Malls', icon: ShoppingBag, count: '18+' },
        { name: 'Schools', icon: GraduationCap, count: '40+' },
        { name: 'Hospitals', icon: Hospital, count: '12+' }
      ],
      marketTrends: {
        priceGrowth: '+15%',
        demandLevel: 'High',
        investmentRating: '4.3/5',
        rentalYield: '3.8%'
      },
      nearbyAreas: [
        { name: 'Cyber City', distance: '2 km', avgPrice: '₹1.5 Cr' },
        { name: 'DLF Phase 1', distance: '3 km', avgPrice: '₹1.8 Cr' },
        { name: 'Sohna Road', distance: '5 km', avgPrice: '₹95L' }
      ],
      gallery: [
        'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
        'https://images.pexels.com/photos/1134166/pexels-photo-1134166.jpeg',
        'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg',
        'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'
      ],
      keyFeatures: [
        {
          title: 'IT Hub',
          description: 'Major technology and financial center',
          icon: Building
        },
        {
          title: 'Modern Infrastructure',
          description: 'World-class roads, metro, and facilities',
          icon: Car
        },
        {
          title: 'Shopping Destinations',
          description: 'Premium malls and retail centers',
          icon: ShoppingBag
        },
        {
          title: 'Corporate Offices',
          description: 'Home to multinational companies',
          icon: Users
        }
      ]
    }
  };

  return areas[areaName as keyof typeof areas] || areas['downtown-delhi-delhi'];
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
      {/* Enhanced Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={area.coverImage}
          alt={area.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />



        {/* Hero Content - Redesigned */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 lg:px-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              {/* Trending Badge */}
              {area.trending && (
                <div className="mb-6">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending Location
                  </Badge>
                </div>
              )}

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 section-heading-shadow-strong">
                {area.name}
              </h1>

              {/* Location */}
              <div className="flex items-center justify-center text-white/90 mb-6">
                <MapPin className="h-6 w-6 mr-3" />
                <span className="text-xl font-medium">{area.city}, {area.state}</span>
              </div>

              {/* Description */}
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed section-heading-shadow">
                {area.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold">{area.properties}</div>
                  <div className="text-white/80 text-sm">Properties</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold">{area.avgPrice}</div>
                  <div className="text-white/80 text-sm">Avg Price</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="text-2xl font-bold text-green-400">{area.priceChange}</div>
                  <div className="text-white/80 text-sm">Growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-16">
        {/* Key Features Section */}
        {area.keyFeatures && (
          <section className="mb-20">
            <SectionHeading
              title="Why Choose This Location"
              subtitle="Discover what makes this area special"
              strongShadow={true}
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {area.keyFeatures.map((feature, index) => (
                <Card key={index} className="h-48 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                    <div className="mb-3">
                      <feature.icon className="h-8 w-8 mx-auto text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Image Gallery Section */}
        {area.gallery && (
          <section className="mb-20">
            <SectionHeading
              title="Area Gallery"
              subtitle="Explore the beauty and vibrancy of this location"
              strongShadow={true}
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {area.gallery.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl group">
                  <Image
                    src={image}
                    alt={`${area.name} view ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Detailed Stats Section */}
        <section className="mb-20">
          <SectionHeading
            title="Market Overview"
            subtitle="Comprehensive data and insights about this location"
            strongShadow={true}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <Home className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{area.properties}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Properties Available</div>
              </CardContent>
            </Card>

            <Card className="h-32 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-xl font-bold text-green-700 dark:text-green-300">{area.avgPrice}</div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Average Price</div>
              </CardContent>
            </Card>

            <Card className="h-32 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{area.priceChange}</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Price Growth</div>
              </CardContent>
            </Card>

            <Card className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{area.marketTrends.investmentRating}</div>
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Investment Rating</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Area Highlights */}
        <section className="mb-20">
          <SectionHeading
            title="Area Highlights"
            subtitle="What makes this location special"
            strongShadow={true}
          />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {area.highlights.map((highlight, index) => (
              <div key={index} className="group">
                <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-lg font-semibold text-primary group-hover:scale-105 transition-transform duration-300">
                      {highlight}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Local Amenities */}
        <section className="mb-20">
          <SectionHeading
            title="Local Amenities"
            subtitle="Essential facilities and services nearby"
            strongShadow={true}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {area.amenities.map((amenity, index) => (
              <Card key={index} className="h-40 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                  <div className="mb-3">
                    <amenity.icon className="h-8 w-8 mx-auto text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{amenity.name}</div>
                  <div className="text-lg font-bold text-primary">{amenity.count}</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Analysis */}
        <section className="mb-20">
          <SectionHeading
            title="Investment Analysis"
            subtitle="Current market trends and investment insights"
            strongShadow={true}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="h-36 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800 group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Price Growth</div>
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{area.marketTrends.priceGrowth}</div>
                <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Year over year</div>
              </CardContent>
            </Card>

            <Card className="h-36 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800 group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">Demand Level</div>
                <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{area.marketTrends.demandLevel}</div>
                <div className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Current market</div>
              </CardContent>
            </Card>

            <Card className="h-36 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800 group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2 text-amber-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">Investment Rating</div>
                <div className="text-xl font-bold text-amber-700 dark:text-amber-300">{area.marketTrends.investmentRating}</div>
                <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Expert rating</div>
              </CardContent>
            </Card>

            <Card className="h-36 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-800 group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-rose-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1">Rental Yield</div>
                <div className="text-xl font-bold text-rose-700 dark:text-rose-300">{area.marketTrends.rentalYield}</div>
                <div className="text-xs text-rose-600/70 dark:text-rose-400/70">Annual return</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Nearby Areas */}
        <section className="mb-20">
          <SectionHeading
            title="Explore Nearby Areas"
            subtitle="Discover similar neighborhoods worth considering"
            strongShadow={true}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {area.nearbyAreas.map((nearbyArea, index) => (
              <Card key={index} className="card-height-compact group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-bold text-xl mb-2">{nearbyArea.name}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Distance</span>
                      <span className="text-sm font-bold">{nearbyArea.distance}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Avg Price</span>
                      <span className="text-sm font-bold text-primary">{nearbyArea.avgPrice}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Explore Area
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12">
            <SectionHeading
              title="Ready to Explore Properties?"
              subtitle="Browse available properties in this prime location"
              strongShadow={true}
            />

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/properties?location=${encodeURIComponent(area.name + ', ' + area.state)}`}>
                <Button size="lg" className="px-8 py-3 text-lg">
                  View All Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Contact Expert
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AreaDetailPage;
