"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, HomeIcon, Building, Hotel } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const HeroSection = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState('buy');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState('any');

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append('type', searchType);
    if (location) params.append('location', location);
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    if (propertyType !== 'any') params.append('propertyType', propertyType);

    router.push(`/properties?${params.toString()}`);
  };

  const formatPrice = (value: number) => {
    return value >= 1000000
      ? `$${(value / 1000000).toFixed(1)}M`
      : `$${(value / 1000).toFixed(0)}K`;
  };

  const propertyTypes = [
    { id: 'any', label: 'Any', icon: HomeIcon },
    { id: 'house', label: 'House', icon: HomeIcon },
    { id: 'apartment', label: 'Apartment', icon: Building },
    { id: 'condo', label: 'Condo', icon: Hotel },
    { id: 'land', label: 'Land', icon: MapPin },
  ];

  return (
    <div className="relative min-h-[90vh] flex items-center bg-card">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundPosition: 'center 30%'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white mb-8">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Find Your Dream Property
          </h1>
          <p
            className="text-lg md:text-xl opacity-90 mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Discover the perfect home across our extensive property listings
          </p>
        </div>

        {/* Search Widget */}
        <div
          className="bg-background/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <Tabs defaultValue="buy" value={searchType} onValueChange={setSearchType} className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="rent">Rent</TabsTrigger>
                <TabsTrigger value="commercial">Commercial</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="buy" className="m-0">
              <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Price Range</span>
                    <span className="font-medium">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 1000000]}
                    max={5000000}
                    step={50000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>

                <div className="pt-2">
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search Properties
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rent" className="m-0">
              <div className="p-4 md:p-6 space-y-6">
                {/* Same structure as buy, with rental-specific options */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Monthly Rent</span>
                    <span className="font-medium">
                      ${priceRange[0]/100} - ${priceRange[1]/100}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 1000000]}
                    max={2000000}
                    step={10000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>

                <div className="pt-2">
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search Rentals
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="commercial" className="m-0">
              <div className="p-4 md:p-6 space-y-6">
                {/* Commercial property search options */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      <option value="any">Any</option>
                      <option value="office">Office</option>
                      <option value="retail">Retail</option>
                      <option value="industrial">Industrial</option>
                      <option value="warehouse">Warehouse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Price Range</span>
                    <span className="font-medium">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 1000000]}
                    max={10000000}
                    step={100000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>

                <div className="pt-2">
                  <Button onClick={handleSearch} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search Commercial
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;