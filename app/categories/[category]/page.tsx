"use client"

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Filter, Grid, List, MapPin, DollarSign, Home, Building, Maximize, Bath, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionHeading from '@/components/ui/section-heading';
import PropertyCard from '@/components/properties/PropertyCard';
import { cn } from '@/lib/utils';

// Mock data for category details
const getCategoryDetails = (categoryName: string) => {
  const categories = {
    'residential': {
      name: 'Residential Properties',
      description: 'Find your perfect home from apartments, villas, and independent houses',
      image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      totalProperties: '15,420',
      avgPrice: '₹1.2 Cr',
      priceRange: '₹25L - ₹5Cr',
      popularTypes: ['Apartments', 'Villas', 'Independent Houses', 'Penthouses'],
      features: [
        { name: 'Family-Friendly', description: 'Safe neighborhoods with schools and parks nearby' },
        { name: 'Modern Amenities', description: 'Swimming pools, gyms, and recreational facilities' },
        { name: 'Good Connectivity', description: 'Easy access to metro, buses, and major roads' },
        { name: 'Investment Potential', description: 'High appreciation and rental yield' }
      ]
    },
    'commercial': {
      name: 'Commercial Properties',
      description: 'Office spaces, retail outlets, and business centers for your enterprise',
      image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      totalProperties: '3,250',
      avgPrice: '₹2.8 Cr',
      priceRange: '₹50L - ₹15Cr',
      popularTypes: ['Office Spaces', 'Retail Shops', 'Warehouses', 'Business Centers'],
      features: [
        { name: 'Prime Locations', description: 'Central business districts and commercial hubs' },
        { name: 'High Footfall', description: 'Areas with maximum customer traffic' },
        { name: 'Modern Infrastructure', description: 'State-of-the-art facilities and technology' },
        { name: 'Growth Potential', description: 'Expanding business districts with future development' }
      ]
    },
    'land': {
      name: 'Land & Plots',
      description: 'Build your dream property on premium land parcels',
      image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg',
      totalProperties: '8,750',
      avgPrice: '₹85L',
      priceRange: '₹15L - ₹3Cr',
      popularTypes: ['Residential Plots', 'Commercial Land', 'Agricultural Land', 'Industrial Plots'],
      features: [
        { name: 'Clear Titles', description: 'Verified legal documents and clear ownership' },
        { name: 'Development Ready', description: 'Approved layouts with basic infrastructure' },
        { name: 'Strategic Locations', description: 'Near upcoming metro lines and highways' },
        { name: 'Flexible Usage', description: 'Multiple development options and zoning approvals' }
      ]
    },
    'rentals': {
      name: 'Rental Properties',
      description: 'Temporary housing solutions for every budget and requirement',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      totalProperties: '22,100',
      avgPrice: '₹35K/month',
      priceRange: '₹8K - ₹2L/month',
      popularTypes: ['1BHK Apartments', '2BHK Apartments', 'Shared Accommodations', 'Furnished Flats'],
      features: [
        { name: 'Flexible Terms', description: 'Short-term and long-term rental options' },
        { name: 'Furnished Options', description: 'Ready-to-move-in properties with furniture' },
        { name: 'All Budgets', description: 'Options available for every income group' },
        { name: 'Quick Processing', description: 'Fast approval and move-in process' }
      ]
    }
  };

  return categories[categoryName as keyof typeof categories] || categories['residential'];
};

const CategoryDetailPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const categorySlug = params.category as string;
  const [category, setCategory] = useState(getCategoryDetails(categorySlug));
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all');

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
      <div className="relative h-[50vh] overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 section-heading-shadow-strong">
              {category.name}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl section-heading-shadow">
              {category.description}
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
              <div className="text-2xl font-bold">{category.totalProperties}</div>
              <div className="text-sm text-muted-foreground">Total Properties</div>
            </CardContent>
          </Card>
          
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">{category.avgPrice}</div>
              <div className="text-sm text-muted-foreground">Average Price</div>
            </CardContent>
          </Card>
          
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">{category.priceRange}</div>
              <div className="text-sm text-muted-foreground">Price Range</div>
            </CardContent>
          </Card>
          
          <Card className="card-height-compact">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold">{category.popularTypes.length}+</div>
              <div className="text-sm text-muted-foreground">Property Types</div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Types */}
        <section className="mb-12">
          <SectionHeading
            title="Popular Property Types"
            subtitle="Most sought-after options in this category"
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.popularTypes.map((type, index) => (
              <Card key={index} className="card-height-compact hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Building className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="font-semibold">{type}</div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <SectionHeading
            title="Key Features"
            subtitle="What makes this category special"
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.features.map((feature, index) => (
              <Card key={index} className="card-height-compact">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Budget Friendly</SelectItem>
                  <SelectItem value="mid">Mid Range</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Properties Grid/List */}
        <section className="mb-12">
          <SectionHeading
            title="Available Properties"
            subtitle="Browse through our curated selection"
          />
          
          <div className="mt-8">
            {properties.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-4">
                  We're constantly adding new properties. Check back soon!
                </p>
                <Link href="/properties">
                  <Button>Browse All Properties</Button>
                </Link>
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                  : 'space-y-6'
              )}>
                {/* Properties will be mapped here */}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <SectionHeading
            title="Ready to Find Your Property?"
            subtitle="Get personalized recommendations from our experts"
          />
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button size="lg">
                Browse All Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Expert
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryDetailPage;
