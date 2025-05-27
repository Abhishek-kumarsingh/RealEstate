"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Upload, Plus, Trash2, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export default function NewPropertyPage() {
  const router = useRouter();
  const { token, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !token) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a property",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [loading, token, router, toast]);

  // Basic information
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("AVAILABLE");

  // Features
  const [features, setFeatures] = useState([
    { name: "bedrooms", value: 0 },
    { name: "bathrooms", value: 0 },
    { name: "area", value: 0 },
    { name: "yearBuilt", value: 2023 },
  ]);

  // Amenities
  const [amenities, setAmenities] = useState([
    { name: "Swimming Pool", checked: false },
    { name: "Garden", checked: false },
    { name: "Garage", checked: false },
    { name: "Air Conditioning", checked: false },
    { name: "Heating", checked: false },
    { name: "Internet", checked: false },
    { name: "Furnished", checked: false },
    { name: "Security System", checked: false },
    { name: "Fireplace", checked: false },
    { name: "Laundry", checked: false },
  ]);

  // Media
  const [images, setImages] = useState<
    { url: string; preview: string; file?: File }[]
  >([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [virtualTourUrl, setVirtualTourUrl] = useState("");

  // Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const { uploadImage, uploading, error } = useCloudinaryUpload();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const result = await uploadImage(file);
          return result
            ? { preview: URL.createObjectURL(file), url: result.url }
            : null;
        })
      );

      // Type assertion to ensure type safety
      const validImages = uploadedImages.filter(Boolean) as {
        preview: string;
        url: string;
      }[];
      setImages((prev) => [...prev, ...validImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (name: string, value: number) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.name === name ? { ...feature, value } : feature
      )
    );
  };

  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.map((amenity) =>
        amenity.name === name
          ? { ...amenity, checked: !amenity.checked }
          : amenity
      )
    );
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsSubmitting(true);

      // Extract feature values
      const bedrooms = features.find((f) => f.name === "bedrooms")?.value || 0;
      const bathrooms =
        features.find((f) => f.name === "bathrooms")?.value || 0;
      const area = features.find((f) => f.name === "area")?.value || 0;
      const yearBuilt =
        features.find((f) => f.name === "yearBuilt")?.value || 2023;

      // Extract checked amenities
      const checkedAmenities = amenities
        .filter((amenity) => amenity.checked)
        .map((amenity) => amenity.name);

      // Use Cloudinary URLs
      const imageUrls = images.map((image) => image.url);

      // Create the property data object
      const propertyData = {
        title,
        price: parseInt(price),
        description,
        type: propertyType,
        category,
        status: isDraft ? "DRAFT" : status,

        // Features
        bedrooms,
        bathrooms,
        area,
        yearBuilt,

        // Amenities
        amenities: checkedAmenities,

        // Media
        images: imageUrls,
        videoUrl,
        virtualTourUrl,

        // Location
        address,
        city,
        state,
        zipCode,
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,

        // Default values
        featured: false,
      };

      // Check if user is authenticated
      if (!token) {
        throw new Error("You must be logged in to create a property");
      }

      // Send the data to the API
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      const data = await response.json();

      toast({
        title: isDraft
          ? "Draft saved successfully"
          : "Property published successfully",
        description: `Property "${title}" has been ${
          isDraft ? "saved as draft" : "published"
        }.`,
      });

      // Redirect to the properties list
      router.push("/dashboard/properties");
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Property
          </h1>
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
                    <Input
                      id="title"
                      placeholder="Enter property title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        className="pl-7"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the property in detail"
                    className="min-h-[120px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <Select
                      value={propertyType}
                      onValueChange={setPropertyType}
                      required
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SALE">For Sale</SelectItem>
                        <SelectItem value="RENT">For Rent</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOUSE">House</SelectItem>
                        <SelectItem value="APARTMENT">Apartment</SelectItem>
                        <SelectItem value="CONDO">Condo</SelectItem>
                        <SelectItem value="LAND">Land</SelectItem>
                        <SelectItem value="OFFICE">Office</SelectItem>
                        <SelectItem value="RETAIL">Retail</SelectItem>
                        <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
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
                          {feature.name === "area"
                            ? "Area (sq ft)"
                            : feature.name}
                        </Label>
                        <Input
                          id={feature.name}
                          type="number"
                          value={feature.value}
                          onChange={(e) =>
                            updateFeature(
                              feature.name,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Property Status</h3>
                  <RadioGroup
                    value={status}
                    onValueChange={setStatus}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="AVAILABLE" id="available" />
                      <Label htmlFor="available">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PENDING" id="pending" />
                      <Label htmlFor="pending">Pending</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SOLD" id="sold" />
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
                      <div
                        key={amenity.name}
                        className="flex items-center space-x-2"
                      >
                        <Switch
                          id={`amenity-${amenity.name}`}
                          checked={amenity.checked}
                          onCheckedChange={() => toggleAmenity(amenity.name)}
                        />
                        <Label htmlFor={`amenity-${amenity.name}`}>
                          {amenity.name}
                        </Label>
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
                  <Input
                    id="video"
                    placeholder="Enter YouTube or Vimeo URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add a video tour link from YouTube or Vimeo to showcase the
                    property.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label htmlFor="virtual-tour">Virtual Tour URL</Label>
                  <Input
                    id="virtual-tour"
                    placeholder="Enter virtual tour URL"
                    value={virtualTourUrl}
                    onChange={(e) => setVirtualTourUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add a 3D virtual tour link to allow potential buyers to
                    explore the property.
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
                    <Input
                      id="address"
                      placeholder="Enter street address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      placeholder="Enter state or province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip/Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter zip or postal code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Map Location</Label>
                  <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-10 w-10 mx-auto mb-2" />
                      <p>Interactive map will be displayed here</p>
                      <p className="text-sm">
                        Click to set the exact property location
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      placeholder="e.g. 34.052235"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      placeholder="e.g. -118.243683"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save as Draft"
          )}
        </Button>
        <Button onClick={() => handleSubmit(false)} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            "Publish Property"
          )}
        </Button>
      </div>
    </div>
  );
}
