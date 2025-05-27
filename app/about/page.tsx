'use client';

import Image from 'next/image';
import { Award, Users, Home, TrendingUp, Shield, Heart, Target, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeading from '@/components/ui/section-heading';

const stats = [
  { icon: Home, label: 'Properties Listed', value: '10,000+' },
  { icon: Users, label: 'Happy Customers', value: '5,000+' },
  { icon: Award, label: 'Awards Won', value: '25+' },
  { icon: TrendingUp, label: 'Years Experience', value: '15+' }
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We believe in complete transparency in all our dealings, ensuring our clients have all the information they need to make informed decisions.'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Our customers are at the heart of everything we do. We strive to exceed expectations and build lasting relationships.'
  },
  {
    icon: Target,
    title: 'Excellence',
    description: 'We are committed to delivering excellence in every aspect of our service, from property listings to customer support.'
  },
  {
    icon: Eye,
    title: 'Innovation',
    description: 'We continuously innovate and adopt new technologies to provide the best real estate experience for our clients.'
  }
];

const team = [
  {
    name: 'Amit Patel',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'With 20+ years in real estate, Amit founded RealEstateHub to revolutionize property transactions.'
  },
  {
    name: 'Priya Singh',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Priya ensures smooth operations and exceptional customer service across all our platforms.'
  },
  {
    name: 'Rahul Sharma',
    role: 'Technology Director',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Rahul leads our tech innovation, developing cutting-edge solutions for modern real estate needs.'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">About RealEstateHub</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transforming Real Estate
              <span className="text-primary block">One Property at a Time</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We are India's leading real estate platform, connecting millions of buyers, sellers, and renters 
              with their perfect properties through innovative technology and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <SectionHeading
                title="Our Story"
                subtitle="Building dreams since 2009"
                alignment="left"
              />
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Founded in 2009, RealEstateHub began as a small team with a big vision: 
                  to make real estate transactions transparent, efficient, and accessible to everyone. 
                  What started as a local property listing service has grown into India's most trusted 
                  real estate platform.
                </p>
                <p>
                  Today, we serve millions of users across major Indian cities, offering comprehensive 
                  real estate solutions from property search and virtual tours to investment advice 
                  and legal assistance. Our technology-driven approach has revolutionized how people 
                  buy, sell, and rent properties.
                </p>
                <p>
                  We're proud to have facilitated thousands of successful property transactions, 
                  helping families find their dream homes and investors discover lucrative opportunities. 
                  Our commitment to innovation and customer satisfaction continues to drive us forward.
                </p>
              </div>
            </div>
            <div data-aos="fade-left">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Our office"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            title="Our Values"
            subtitle="The principles that guide everything we do"
            alignment="center"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="text-center hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            title="Meet Our Leadership"
            subtitle="The visionaries behind RealEstateHub"
            alignment="center"
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="text-center hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              To democratize real estate by providing transparent, technology-driven solutions 
              that empower every Indian to make informed property decisions with confidence.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="opacity-80">Making real estate accessible to everyone, regardless of location or budget.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="opacity-80">Continuously innovating to provide the best user experience and latest technology.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Trust</h3>
                <p className="opacity-80">Building lasting relationships through transparency, reliability, and exceptional service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
