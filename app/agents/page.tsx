'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Star, Phone, Mail, MapPin, Award, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

// Mock agents data
const allAgents = [
  {
    id: 1,
    name: 'Priya Sharma',
    title: 'Senior Property Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    location: 'Mumbai, Maharashtra',
    phone: '+91 98765 43210',
    email: 'priya.sharma@realestatehub.com',
    rating: 4.9,
    reviews: 127,
    propertiesSold: 89,
    experience: 8,
    specialties: ['Luxury Homes', 'Commercial', 'Investment'],
    languages: ['English', 'Hindi', 'Marathi'],
    verified: true,
    topAgent: true,
    description: 'Specializing in luxury properties with 8+ years of experience in Mumbai real estate market.'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    title: 'Property Investment Specialist',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    location: 'Bangalore, Karnataka',
    phone: '+91 98765 43211',
    email: 'rajesh.kumar@realestatehub.com',
    rating: 4.8,
    reviews: 98,
    propertiesSold: 76,
    experience: 6,
    specialties: ['Tech Hub Properties', 'Residential', 'New Projects'],
    languages: ['English', 'Hindi', 'Kannada'],
    verified: true,
    topAgent: false,
    description: 'Expert in Bangalore tech corridor properties and emerging residential developments.'
  },
  {
    id: 3,
    name: 'Anita Desai',
    title: 'Luxury Property Advisor',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
    location: 'Delhi NCR',
    phone: '+91 98765 43212',
    email: 'anita.desai@realestatehub.com',
    rating: 5.0,
    reviews: 156,
    propertiesSold: 112,
    experience: 12,
    specialties: ['Heritage Properties', 'Luxury Villas', 'Premium Apartments'],
    languages: ['English', 'Hindi', 'Punjabi'],
    verified: true,
    topAgent: true,
    description: 'Premier luxury property specialist with extensive experience in Delhi NCR market.'
  },
  {
    id: 4,
    name: 'Vikram Singh',
    title: 'Commercial Property Expert',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
    location: 'Gurgaon, Haryana',
    phone: '+91 98765 43213',
    email: 'vikram.singh@realestatehub.com',
    rating: 4.7,
    reviews: 84,
    propertiesSold: 65,
    experience: 9,
    specialties: ['Commercial Spaces', 'Office Leasing', 'Retail Properties'],
    languages: ['English', 'Hindi'],
    verified: true,
    topAgent: false,
    description: 'Specialized in commercial real estate with focus on corporate leasing and retail spaces.'
  },
  {
    id: 5,
    name: 'Meera Patel',
    title: 'Residential Property Consultant',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=300',
    location: 'Pune, Maharashtra',
    phone: '+91 98765 43214',
    email: 'meera.patel@realestatehub.com',
    rating: 4.6,
    reviews: 72,
    propertiesSold: 58,
    experience: 5,
    specialties: ['Residential Homes', 'First-time Buyers', 'Affordable Housing'],
    languages: ['English', 'Hindi', 'Gujarati'],
    verified: true,
    topAgent: false,
    description: 'Helping families find their perfect homes with personalized service and market expertise.'
  },
  {
    id: 6,
    name: 'Arjun Reddy',
    title: 'Property Investment Advisor',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300',
    location: 'Hyderabad, Telangana',
    phone: '+91 98765 43215',
    email: 'arjun.reddy@realestatehub.com',
    rating: 4.8,
    reviews: 91,
    propertiesSold: 73,
    experience: 7,
    specialties: ['Investment Properties', 'IT Corridor', 'Rental Properties'],
    languages: ['English', 'Hindi', 'Telugu'],
    verified: true,
    topAgent: true,
    description: 'Investment specialist focusing on high-growth areas and rental yield optimization.'
  }
];

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [filteredAgents, setFilteredAgents] = useState(allAgents);

  // Filter and sort agents
  const handleFilters = () => {
    let filtered = allAgents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = locationFilter === 'all' || agent.location.includes(locationFilter);
      const matchesSpecialty = specialtyFilter === 'all' || 
                              agent.specialties.some(s => s.toLowerCase().includes(specialtyFilter.toLowerCase()));
      
      return matchesSearch && matchesLocation && matchesSpecialty;
    });

    // Sort agents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'properties':
          return b.propertiesSold - a.propertiesSold;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredAgents(filtered);
  };

  // Apply filters whenever dependencies change
  useState(() => {
    handleFilters();
  }, [searchTerm, locationFilter, specialtyFilter, sortBy]);

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Gurgaon', 'Pune', 'Hyderabad'];
  const specialties = ['Luxury Homes', 'Commercial', 'Investment', 'Residential', 'Tech Hub Properties'];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">Our Agents</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Meet Our Expert
              <span className="text-primary block">Real Estate Agents</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with our verified, experienced agents who are ready to help you 
              find your perfect property or get the best value for your sale.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30 sticky top-20 z-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents or specialties..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="properties">Properties Sold</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {filteredAgents.length} Agent{filteredAgents.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="text-sm text-muted-foreground">
              Showing verified professionals
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent, index) => (
              <Card
                key={agent.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Top Agent Badge */}
                {agent.topAgent && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
                      <Award className="w-3 h-3 mr-1" />
                      Top Agent
                    </Badge>
                  </div>
                )}

                {/* Verified Badge */}
                {agent.verified && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Agent Photo */}
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Online status */}
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{agent.title}</p>
                    <div className="flex items-center justify-center text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {agent.location}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center mb-3">
                      <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 rounded-full px-3 py-1">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{agent.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({agent.reviews})</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-primary">{agent.propertiesSold}</div>
                      <div className="text-xs text-muted-foreground">Properties Sold</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-lg font-bold text-primary">{agent.experience}+</div>
                      <div className="text-xs text-muted-foreground">Years Experience</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Specialties:</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.slice(0, 2).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {agent.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`tel:${agent.phone}`)}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`mailto:${agent.email}`)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                    </div>
                    <Link href={`/agents/${agent.id}`} className="w-full">
                      <Button className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
