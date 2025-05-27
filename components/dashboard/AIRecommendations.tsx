'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Heart, TrendingUp, MapPin, DollarSign, 
  Home, Star, Clock, Users, Zap
} from 'lucide-react';

interface PropertyRecommendation {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  matchScore: number;
  reasons: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  features: string[];
}

const mockRecommendations: PropertyRecommendation[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    price: 850000,
    location: 'Downtown, Los Angeles',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    matchScore: 95,
    reasons: ['Matches your budget range', 'Close to preferred location', 'Modern amenities'],
    type: 'Loft',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    features: ['Gym', 'Rooftop', 'Parking']
  },
  {
    id: '2',
    title: 'Suburban Family Home',
    price: 650000,
    location: 'Beverly Hills, CA',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    matchScore: 88,
    reasons: ['Great for families', 'Excellent schools nearby', 'Large backyard'],
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    features: ['Garden', 'Garage', 'Pool']
  },
  {
    id: '3',
    title: 'Luxury Oceanview Condo',
    price: 1200000,
    location: 'Malibu, CA',
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
    matchScore: 82,
    reasons: ['Ocean view', 'Luxury amenities', 'Investment potential'],
    type: 'Condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    features: ['Ocean View', 'Concierge', 'Spa']
  }
];

const userBehaviorData = [
  { category: 'Modern Properties', views: 45, interest: 85 },
  { category: 'Downtown Locations', views: 38, interest: 78 },
  { category: 'Luxury Amenities', views: 32, interest: 72 },
  { category: 'Investment Properties', views: 28, interest: 65 },
];

export default function AIRecommendations() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState({
    budget: { min: 500000, max: 1000000 },
    location: 'Los Angeles',
    propertyType: 'Any',
    bedrooms: 2,
    features: ['Parking', 'Gym']
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Brain className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Recommendations</h2>
          <p className="text-muted-foreground">
            Personalized property suggestions based on your preferences and behavior
          </p>
        </div>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">For You</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockRecommendations.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {property.matchScore}% Match
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 left-3 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ${property.price.toLocaleString()}
                      </span>
                      <Badge variant="outline">{property.type}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.sqft} sqft</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Why we recommend this:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {property.reasons.map((reason, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Schedule Tour
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Properties
              </CardTitle>
              <CardDescription>
                Most viewed and inquired properties this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecommendations.slice(0, 2).map((property, index) => (
                  <div key={property.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">{property.location}</p>
                      <p className="text-lg font-bold text-primary">
                        ${property.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {Math.floor(Math.random() * 50) + 20} views
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {Math.floor(Math.random() * 10) + 1} inquiries
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Viewing Patterns</CardTitle>
                <CardDescription>
                  Based on your browsing behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userBehaviorData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span>{item.views} views</span>
                    </div>
                    <Progress value={item.interest} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>
                  AI-generated market analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Price Trend</p>
                      <p className="text-sm text-muted-foreground">
                        Properties in your preferred area have increased by 5.2% this quarter
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Best Time to Buy</p>
                      <p className="text-sm text-muted-foreground">
                        Based on market analysis, now is a good time to purchase
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                      <Star className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Investment Potential</p>
                      <p className="text-sm text-muted-foreground">
                        High growth potential in downtown areas over next 2 years
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Preferences</CardTitle>
              <CardDescription>
                Update your preferences to get better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Budget Range</label>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm">$500K</span>
                      <div className="flex-1 bg-muted h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full w-3/4"></div>
                      </div>
                      <span className="text-sm">$1M</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Preferred Location</label>
                    <p className="text-sm text-muted-foreground mt-1">Los Angeles, CA</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Property Type</label>
                    <div className="flex gap-2 mt-2">
                      {['House', 'Condo', 'Loft', 'Any'].map((type) => (
                        <Badge 
                          key={type} 
                          variant={type === 'Any' ? 'default' : 'secondary'}
                          className="cursor-pointer"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Minimum Bedrooms</label>
                    <p className="text-sm text-muted-foreground mt-1">2 bedrooms</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Must-Have Features</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Parking', 'Gym', 'Pool', 'Garden', 'Balcony'].map((feature) => (
                        <Badge 
                          key={feature} 
                          variant={['Parking', 'Gym'].includes(feature) ? 'default' : 'secondary'}
                          className="cursor-pointer"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">Update Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
