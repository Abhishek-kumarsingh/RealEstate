'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Phone, Mail, MapPin, Award, TrendingUp, Users, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/ui/section-heading';
import { cn } from '@/lib/utils';

// Mock agents data
const topAgents = [
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
  }
];

const AgentsSection = () => {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);

  return (
    <section className="container mx-auto">
      <SectionHeading
        title="Meet Our Expert Agents"
        subtitle="Connect with our top-rated property professionals"
        alignment="center"
      />

      {/* Show max 3 cards for laptop size as requested */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 equal-height-grid">
        {topAgents.slice(0, 3).map((agent, index) => (
          <Card
            key={agent.id}
            className={cn(
              'group overflow-hidden transition-all duration-300 hover:shadow-xl',
              'transform hover:-translate-y-2 relative card-height-standard flex flex-col'
            )}
            data-aos="fade-up"
            data-aos-delay={index * 100}
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
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

            <CardContent className="p-6 flex-1 flex flex-col">
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
                {/* Online status indicator */}
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
                  {agent.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Languages:</div>
                <div className="text-sm text-muted-foreground">
                  {agent.languages.join(', ')}
                </div>
              </div>

              {/* Spacer to push buttons to bottom */}
              <div className="flex-1"></div>

              {/* Contact Buttons */}
              <div className="space-y-2 mt-auto">
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
                  <Button
                    className={cn(
                      'w-full transition-all duration-300',
                      hoveredAgent === agent.id ? 'bg-primary text-primary-foreground' : ''
                    )}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View all agents */}
      <div className="mt-12 text-center">
        <Link href="/agents">
          <Button size="lg" variant="outline">
            <Users className="w-4 h-4 mr-2" />
            View All Agents
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AgentsSection;
