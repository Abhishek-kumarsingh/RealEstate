'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import SectionHeading from '@/components/ui/section-heading';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+91 1800-123-4567', '+91 98765-43210'],
    description: 'Call us for immediate assistance'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@realestatehub.com', 'support@realestatehub.com'],
    description: 'Send us your queries anytime'
  },
  {
    icon: MapPin,
    title: 'Address',
    details: ['123 Business District', 'Mumbai, Maharashtra 400001'],
    description: 'Visit our main office'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Mon - Fri: 9:00 AM - 7:00 PM', 'Sat - Sun: 10:00 AM - 5:00 PM'],
    description: 'We are here to help'
  }
];

const offices = [
  {
    city: 'Mumbai',
    address: '123 Business District, Bandra West, Mumbai 400050',
    phone: '+91 22-1234-5678',
    email: 'mumbai@realestatehub.com'
  },
  {
    city: 'Delhi',
    address: '456 Corporate Plaza, Connaught Place, New Delhi 110001',
    phone: '+91 11-1234-5678',
    email: 'delhi@realestatehub.com'
  },
  {
    city: 'Bangalore',
    address: '789 Tech Park, Koramangala, Bangalore 560034',
    phone: '+91 80-1234-5678',
    email: 'bangalore@realestatehub.com'
  }
];

const faqs = [
  {
    question: 'How do I list my property?',
    answer: 'You can list your property by creating an account and using our property listing form. Our team will verify and publish your listing within 24 hours.'
  },
  {
    question: 'Are there any charges for buyers?',
    answer: 'No, browsing and searching properties is completely free for buyers. We only charge a small commission from sellers upon successful transactions.'
  },
  {
    question: 'How do I schedule a property visit?',
    answer: 'You can schedule visits directly through our platform by clicking the "Schedule Visit" button on any property listing, or contact the agent directly.'
  },
  {
    question: 'Do you provide legal assistance?',
    answer: 'Yes, we have partnerships with legal experts who can assist with property documentation, verification, and transaction processes.'
  },
  {
    question: 'What is your refund policy?',
    answer: 'We offer a full refund if you are not satisfied with our premium services within 30 days of purchase, subject to terms and conditions.'
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in Touch
              <span className="text-primary block">We're Here to Help</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Have questions about properties, need assistance, or want to partner with us? 
              Our team is ready to provide you with expert guidance and support.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                className="text-center hover:shadow-lg transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                  <div className="space-y-1 mb-3">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm font-medium">{detail}</p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <SectionHeading
                title="Send us a Message"
                subtitle="Fill out the form and we'll get back to you"
                alignment="left"
              />
              <Card className="mt-8">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name *</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone</label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <HeadphonesIcon className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
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
            </div>

            {/* Office Locations */}
            <div data-aos="fade-left">
              <SectionHeading
                title="Our Offices"
                subtitle="Visit us at any of our locations"
                alignment="left"
              />
              <div className="mt-8 space-y-6">
                {offices.map((office, index) => (
                  <Card key={office.city} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-primary" />
                        {office.city} Office
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">{office.address}</p>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-primary" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-primary" />
                          <span>{office.email}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions"
            alignment="center"
          />
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
