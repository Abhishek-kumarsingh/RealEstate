'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, Home, MapPin, DollarSign, Camera, FileText, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubmitPropertyPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    price: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    features: {
      bedrooms: '',
      bathrooms: '',
      area: '',
      yearBuilt: ''
    },
    amenities: [] as string[],
    images: [] as File[],
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const amenitiesList = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Balcony',
    'Air Conditioning', 'Furnished', 'Pet Friendly', 'Elevator', 'Power Backup', 'Water Supply'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Property Submitted Successfully!",
        description: "Your property has been submitted for admin review. You'll be notified once it's approved.",
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        category: '',
        price: '',
        location: { address: '', city: '', state: '', zipCode: '' },
        features: { bedrooms: '', bathrooms: '', area: '', yearBuilt: '' },
        amenities: [],
        images: [],
        contactInfo: { name: '', email: '', phone: '' }
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Submit Your Property</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            List your property with us and reach thousands of potential buyers and renters. 
            Our team will review your submission and publish it within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Title *</label>
                  <Input
                    placeholder="e.g., Modern 3BHK Apartment in Bandra"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Property Type *</label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Price *</label>
                  <Input
                    type="number"
                    placeholder="Enter price in INR"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description *</label>
                <Textarea
                  placeholder="Describe your property in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Address *</label>
                <Input
                  placeholder="Enter complete address"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">City *</label>
                  <Input
                    placeholder="City"
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location.city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State *</label>
                  <Input
                    placeholder="State"
                    value={formData.location.state}
                    onChange={(e) => handleInputChange('location.state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                  <Input
                    placeholder="ZIP Code"
                    value={formData.location.zipCode}
                    onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Property Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Bedrooms</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.features.bedrooms}
                    onChange={(e) => handleInputChange('features.bedrooms', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Bathrooms</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.features.bathrooms}
                    onChange={(e) => handleInputChange('features.bathrooms', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Area (sq ft)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.features.area}
                    onChange={(e) => handleInputChange('features.area', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Year Built</label>
                  <Input
                    type="number"
                    placeholder="YYYY"
                    value={formData.features.yearBuilt}
                    onChange={(e) => handleInputChange('features.yearBuilt', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {amenitiesList.map((amenity) => (
                    <div
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant={formData.amenities.includes(amenity) ? 'default' : 'outline'}
                        className="w-full justify-center py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {amenity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Upload Property Images</p>
                <p className="text-muted-foreground mb-4">
                  Add high-quality photos to attract more buyers. Maximum 10 images.
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    Choose Images
                  </Button>
                </label>
                {formData.images.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    placeholder="Your full name"
                    value={formData.contactInfo.name}
                    onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone *</label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-48">
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Property for Review
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Your property will be reviewed by our team and published within 24 hours if approved.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
