"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Search, MapPin, HomeIcon, Building, Hotel, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Carousel data
const heroSlides = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Find Your Perfect',
    subtitle: 'Dream Home',
    description: 'Discover premium properties across India\'s major cities with our AI-powered recommendations'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Luxury Living',
    subtitle: 'Redefined',
    description: 'Experience world-class amenities and modern architecture in prime locations'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Smart Investment',
    subtitle: 'Opportunities',
    description: 'Build your wealth with carefully curated commercial and residential properties'
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Your Future',
    subtitle: 'Starts Here',
    description: 'From starter homes to luxury estates, find the perfect property for every stage of life'
  }
];

const HeroSection = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState('buy');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [propertyType, setPropertyType] = useState('any');

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

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
    <div className="relative">
      {/* Hero Carousel Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Carousel Images */}
        <div className="relative w-full h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === currentSlide ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/40" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              {/* Dynamic Title */}
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight section-heading-shadow-strong"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {heroSlides[currentSlide].title}
                <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </h1>

              {/* Dynamic Description */}
              <p
                className="text-base md:text-lg lg:text-xl opacity-90 mb-6 max-w-2xl mx-auto section-heading-shadow"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {heroSlides[currentSlide].description}
              </p>

              {/* Quick Stats - Smaller */}
              <div
                className="flex flex-wrap justify-center gap-6 mb-6"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">10,000+</div>
                  <div className="text-xs md:text-sm opacity-80">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">5,000+</div>
                  <div className="text-xs md:text-sm opacity-80">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">50+</div>
                  <div className="text-xs md:text-sm opacity-80">Cities</div>
                </div>
              </div>

              {/* Call to Action Buttons - Smaller */}
              <div
                className="flex flex-wrap justify-center gap-3"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <Button
                  size="default"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 font-semibold px-6"
                  onClick={() => router.push('/login?redirect=/submit-property')}
                >
                  List Your Property
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="border-white/80 bg-white/10 text-white hover:bg-white hover:text-black font-semibold px-6 backdrop-blur-sm"
                  onClick={() => router.push('/register?redirect=/become-agent')}
                >
                  Become an Agent
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Widget - Lower Half Overlapping */}
      <div className="relative -mt-20 z-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div
            className="bg-background/98 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50 overflow-hidden max-w-5xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="400"
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
    </div>
  );
};

export default HeroSection;