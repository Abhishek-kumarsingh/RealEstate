"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Upload, Plus, Trash2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function NewPropertyPage() {
  const [images, setImages] = useState<{ preview: string }[]>([]);
  const [features, setFeatures] = useState([
    { name: 'bedrooms', value: 0 },
    { name: 'bathrooms', value: 0 },
    { name: 'area', value: 0 },
    { name: 'yearBuilt', value: 2023 },
  ]);

  const [amenities, setAmenities] = useState([
    { name: 'Swimming Pool', checked: false },
    { name: 'Garden', checked: false },
    { name: 'Garage', checked: false },
    { name: 'Air Conditioning', checked: false },
    { name: 'Heating', checked: false },
    { name: 'Internet', checked: false },
    { name: 'Furnished', checked: false },
    { name: 'Security System', checked: false },
    { name: 'Fireplace', checked: false },
    { name: 'Laundry', checked: false },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (name: string, value: number) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.name === name ? { ...feature, value } : feature
      )
    );
  };

  const toggleAmenity = (name: string) => {
    setAmenities(prev => 
      prev.map(amenity => 
        amenity.name === name ? { ...amenity, checked: !amenity.checked } : amenity
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/properties">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="images">Images & Media</TabsTrigger>
          <TabsTrigger value="location">Location & Map</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input id="title" placeholder="Enter property title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input id="price" type="number" className="pl-7" placeholder="Enter price" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the property in detail" 
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <Select>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Property Features</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {features.map((feature) => (
                      <div key={feature.name} className="space-y-2">
                        <Label htmlFor={feature.name} className="capitalize">
                          {feature.name === 'area' ? 'Area (sq ft)' : feature.name}
                        </Label>
                        <Input
                          id={feature.name}
                          type="number"
                          value={feature.value}
                          onChange={(e) => updateFeature(feature.name, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Property Status</h3>
                  <RadioGroup defaultValue="available" className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="available" id="available" />
                      <Label htmlFor="available">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="pending" />
                      <Label htmlFor="pending">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sold" id="sold" />
                      <Label htmlFor="sold">Sold</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Amenities</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Custom
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {amenities.map((amenity) => (
                      <div key={amenity.name} className="flex items-center space-x-2">
                        <Switch
                          id={`amenity-${amenity.name}`}
                          checked={amenity.checked}
                          onCheckedChange={() => toggleAmenity(amenity.name)}
                        />
                        <Label htmlFor={`amenity-${amenity.name}`}>{amenity.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Images & Media</CardTitle>
              <CardDescription>
                Upload images and videos of the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <Label>Property Images</Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {/* Image upload placeholder */}
                    <label className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary/20 bg-muted hover:border-primary/50 hover:bg-muted/70">
                      <div className="flex flex-col items-center justify-center space-y-2 p-4 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary" />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-primary">
                          Upload Images
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>

                    {/* Preview uploaded images */}
                    {images.map((image, index) => (
                      <div 
                        key={index} 
                        className="group relative aspect-square rounded-md border border-input overflow-hidden"
                      >
                        <img
                          src={image.preview}
                          alt={`Preview ${index}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="video">Video Tour URL</Label>
                  <Input id="video" placeholder="Enter YouTube or Vimeo URL" />
                  <p className="text-sm text-muted-foreground">
                    Add a video tour link from YouTube or Vimeo to showcase the property.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="virtual-tour">Virtual Tour URL</Label>
                  <Input id="virtual-tour" placeholder="Enter virtual tour URL" />
                  <p className="text-sm text-muted-foreground">
                    Add a 3D virtual tour link to allow potential buyers to explore the property.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Information</CardTitle>
              <CardDescription>
                Add the property location and map details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter street address" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Enter city" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" placeholder="Enter state or province" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code</Label>
                    <Input id="zipCode" placeholder="Enter zip or postal code" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Map Location</Label>
                  <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-10 w-10 mx-auto mb-2" />
                      <p>Interactive map will be displayed here</p>
                      <p className="text-sm">Click to set the exact property location</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" placeholder="e.g. 34.052235" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" placeholder="e.g. -118.243683" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline">Save as Draft</Button>
        <Button>Publish Property</Button>
      </div>
    </div>
  );
}