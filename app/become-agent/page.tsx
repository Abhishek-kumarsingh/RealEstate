'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, User, MapPin, Award, FileText, Send, Shield, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BecomeAgentPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: ''
    },
    professionalInfo: {
      experience: '',
      licenseNumber: '',
      specialties: [] as string[],
      languages: [] as string[],
      bio: ''
    },
    documents: {
      license: null as File | null,
      idProof: null as File | null,
      experienceCertificate: null as File | null,
      photo: null as File | null
    }
  });

  const specialtiesList = [
    'Residential Properties', 'Commercial Properties', 'Luxury Homes', 'Investment Properties',
    'New Construction', 'Rental Properties', 'Land Sales', 'Industrial Properties'
  ];

  const languagesList = [
    'English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Punjabi'
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

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        specialties: prev.professionalInfo.specialties.includes(specialty)
          ? prev.professionalInfo.specialties.filter(s => s !== specialty)
          : [...prev.professionalInfo.specialties, specialty]
      }
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        languages: prev.professionalInfo.languages.includes(language)
          ? prev.professionalInfo.languages.filter(l => l !== language)
          : [...prev.professionalInfo.languages, language]
      }
    }));
  };

  const handleFileUpload = (field: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Application Submitted Successfully!",
        description: "Your agent application has been submitted for review. We'll contact you within 3-5 business days.",
      });
      
      // Reset form
      setFormData({
        personalInfo: { name: '', email: '', phone: '', address: '', city: '', state: '' },
        professionalInfo: { experience: '', licenseNumber: '', specialties: [], languages: [], bio: '' },
        documents: { license: null, idProof: null, experienceCertificate: null, photo: null }
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Become a Real Estate Agent</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join our network of professional real estate agents and grow your business with our platform. 
            Get access to thousands of potential clients and premium tools to manage your listings.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
              <p className="text-sm text-muted-foreground">
                Join a trusted platform with verified listings and secure transactions
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Premium Tools</h3>
              <p className="text-sm text-muted-foreground">
                Access advanced CRM, analytics, and marketing tools to grow your business
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <User className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quality Leads</h3>
              <p className="text-sm text-muted-foreground">
                Get connected with serious buyers and sellers in your area
              </p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    placeholder="Your full name"
                    value={formData.personalInfo.name}
                    onChange={(e) => handleInputChange('personalInfo.name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo.email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Address *</label>
                  <Input
                    placeholder="Your address"
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo.address', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">City *</label>
                  <Input
                    placeholder="City"
                    value={formData.personalInfo.city}
                    onChange={(e) => handleInputChange('personalInfo.city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State *</label>
                  <Input
                    placeholder="State"
                    value={formData.personalInfo.state}
                    onChange={(e) => handleInputChange('personalInfo.state', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Years of Experience *</label>
                  <Select 
                    value={formData.professionalInfo.experience} 
                    onValueChange={(value) => handleInputChange('professionalInfo.experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-5">2-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="11-15">11-15 years</SelectItem>
                      <SelectItem value="15+">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Real Estate License Number *</label>
                  <Input
                    placeholder="License number"
                    value={formData.professionalInfo.licenseNumber}
                    onChange={(e) => handleInputChange('professionalInfo.licenseNumber', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Specialties *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {specialtiesList.map((specialty) => (
                    <div
                      key={specialty}
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant={formData.professionalInfo.specialties.includes(specialty) ? 'default' : 'outline'}
                        className="w-full justify-center py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {specialty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Languages Spoken *</label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {languagesList.map((language) => (
                    <div
                      key={language}
                      onClick={() => handleLanguageToggle(language)}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant={formData.professionalInfo.languages.includes(language) ? 'default' : 'outline'}
                        className="w-full justify-center py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {language}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Professional Bio *</label>
                <Textarea
                  placeholder="Tell us about your experience, achievements, and what makes you a great agent..."
                  rows={4}
                  value={formData.professionalInfo.bio}
                  onChange={(e) => handleInputChange('professionalInfo.bio', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'license', label: 'Real Estate License', required: true },
                  { key: 'idProof', label: 'Government ID Proof', required: true },
                  { key: 'experienceCertificate', label: 'Experience Certificate', required: false },
                  { key: 'photo', label: 'Professional Photo', required: true }
                ].map((doc) => (
                  <div key={doc.key} className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="font-medium mb-1">
                      {doc.label} {doc.required && '*'}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.key, file);
                      }}
                      className="hidden"
                      id={`${doc.key}-upload`}
                      required={doc.required}
                    />
                    <label htmlFor={`${doc.key}-upload`}>
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                    {formData.documents[doc.key as keyof typeof formData.documents] && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ File uploaded
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-48">
              {isSubmitting ? (
                <>Submitting Application...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Your application will be reviewed within 3-5 business days. We'll contact you with the next steps.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
