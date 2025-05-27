'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Phone, Mail, MapPin, Award, Calendar, MessageCircle, Send, User, Home, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/properties/PropertyCard';
import { useToast } from '@/hooks/use-toast';

// Mock agent data (in real app, this would come from API)
const agentData = {
  id: 1,
  name: 'Priya Sharma',
  title: 'Senior Property Consultant',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  coverImage: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
  bio: 'Priya Sharma is a seasoned real estate professional with over 8 years of experience in the Mumbai property market. She specializes in luxury residential properties and commercial investments, having successfully closed deals worth over ₹500 crores. Her deep understanding of market trends and commitment to client satisfaction has earned her recognition as one of Mumbai\'s top agents.',
  achievements: [
    'Top Agent 2023 - RealEstateHub',
    'Luxury Property Specialist Certification',
    'Customer Excellence Award 2022',
    'Million Dollar Club Member'
  ],
  workingHours: {
    monday: '9:00 AM - 7:00 PM',
    tuesday: '9:00 AM - 7:00 PM',
    wednesday: '9:00 AM - 7:00 PM',
    thursday: '9:00 AM - 7:00 PM',
    friday: '9:00 AM - 7:00 PM',
    saturday: '10:00 AM - 5:00 PM',
    sunday: 'By Appointment'
  }
};

// Mock properties data
const agentProperties = [
  {
    _id: '1',
    title: 'Luxury Penthouse with Sea View',
    description: 'Stunning penthouse with panoramic sea views',
    price: 12500000,
    type: 'sale' as const,
    category: 'apartment',
    location: {
      address: '123 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      area: 3500,
      yearBuilt: 2020
    },
    amenities: ['Swimming Pool', 'Gym', 'Parking'],
    images: ['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'],
    status: 'available',
    featured: true,
    agent: agentData
  }
];

export default function AgentProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Priya will get back to you within 24 hours.",
      });
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-80 overflow-hidden">
        <Image
          src={agentData.coverImage}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Agent Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={agentData.avatar}
                    alt={agentData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                {agentData.verified && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white">
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              {/* Agent Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{agentData.name}</h1>
                  {agentData.topAgent && (
                    <Badge className="bg-gradient-to-r from-orange-400 to-red-500">
                      <Award className="w-3 h-3 mr-1" />
                      Top Agent
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-white/90 mb-2">{agentData.title}</p>
                <div className="flex items-center text-white/80 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  {agentData.location}
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{agentData.rating}</span>
                    <span className="text-white/70 ml-1">({agentData.reviews} reviews)</span>
                  </div>
                  <div className="text-white/90">
                    <span className="font-medium">{agentData.propertiesSold}</span> properties sold
                  </div>
                  <div className="text-white/90">
                    <span className="font-medium">{agentData.experience}+</span> years experience
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="flex gap-3">
                <Button
                  onClick={() => window.open(`tel:${agentData.phone}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  onClick={() => window.open(`mailto:${agentData.email}`)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {agentData.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {agentData.bio}
                      </p>

                      <div>
                        <h3 className="font-semibold mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {agentData.specialties.map((specialty, idx) => (
                            <Badge key={idx} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Languages</h3>
                        <p className="text-muted-foreground">
                          {agentData.languages.join(', ')}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Achievements</h3>
                        <ul className="space-y-2">
                          {agentData.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-center text-muted-foreground">
                              <Award className="w-4 h-4 mr-2 text-primary" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="properties" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Listed Properties</h3>
                      <Badge variant="secondary">{agentProperties.length} properties</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {agentProperties.map((property) => (
                        <PropertyCard key={property._id} property={property} />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Reviews feature coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact {agentData.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      name="phone"
                      placeholder="Your Phone"
                      value={contactForm.phone}
                      onChange={handleInputChange}
                    />
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      rows={4}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Working Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Working Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(agentData.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize font-medium">{day}</span>
                        <span className="text-muted-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Home className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">Properties Sold</span>
                      </div>
                      <span className="font-semibold">{agentData.propertiesSold}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">Experience</span>
                      </div>
                      <span className="font-semibold">{agentData.experience}+ years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-primary" />
                        <span className="text-sm">Rating</span>
                      </div>
                      <span className="font-semibold">{agentData.rating}/5.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
