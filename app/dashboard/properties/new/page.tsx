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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  MapPin,
  Loader2,
  ArrowRight,
  Check,
  AlertCircle,
  Home,
  Camera,
  Map
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export default function NewPropertyPage() {
  const router = useRouter();
  const { token, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Property Details",
      description: "Basic information and features",
      icon: Home,
    },
    {
      id: 2,
      title: "Images & Media",
      description: "Photos and virtual tours",
      icon: Camera,
    },
    {
      id: 3,
      title: "Location & Map",
      description: "Address and map location",
      icon: Map,
    },
  ];

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

  // Validation functions
  const validateStep1 = () => {
    const errors = [];
    if (!title.trim()) errors.push("Property title is required");
    if (!price.trim()) errors.push("Price is required");
    if (!description.trim()) errors.push("Description is required");
    if (!propertyType) errors.push("Property type is required");
    if (!category) errors.push("Category is required");
    return errors;
  };

  const validateStep2 = () => {
    const errors = [];
    if (images.length === 0) errors.push("At least one image is required");
    return errors;
  };

  const validateStep3 = () => {
    const errors = [];
    if (!address.trim()) errors.push("Address is required");
    if (!city.trim()) errors.push("City is required");
    if (!state.trim()) errors.push("State is required");
    if (!zipCode.trim()) errors.push("Zip code is required");
    return errors;
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return [];
    }
  };

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return validateStep1().length === 0;
      case 2:
        return validateStep2().length === 0;
      case 3:
        return validateStep3().length === 0;
      default:
        return false;
    }
  };

  // Step navigation
  const nextStep = () => {
    const errors = validateCurrentStep();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    // Allow going to previous steps or next step if current is valid
    if (stepNumber < currentStep || (stepNumber === currentStep + 1 && isStepValid(currentStep))) {
      if (stepNumber === currentStep + 1) {
        nextStep();
      } else {
        setCurrentStep(stepNumber);
      }
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) return "completed";
    if (stepNumber === currentStep) return "current";
    if (stepNumber < currentStep) return "completed";
    return "upcoming";
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPropertyDetails();
      case 2:
        return renderImagesMedia();
      case 3:
        return renderLocationMap();
      default:
        return null;
    }
  };

  const renderPropertyDetails = () => (
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
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                placeholder="Enter property title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
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
            <Label htmlFor="description">Description *</Label>
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
              <Label htmlFor="type">Property Type *</Label>
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
              <Label htmlFor="category">Category *</Label>
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
  );

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

      {/* Progress Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Step {currentStep} of {steps.length}</h2>
          <div className="text-sm text-muted-foreground">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </div>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center space-x-8 py-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(stepNumber);
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 cursor-pointer transition-all ${
                status === "current" ? "scale-110" : ""
              }`}
              onClick={() => goToStep(stepNumber)}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  status === "completed"
                    ? "bg-primary border-primary text-primary-foreground"
                    : status === "current"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {status === "completed" ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <StepIcon className="h-6 w-6" />
                )}
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  status === "current" ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
              {status === "completed" && (
                <Badge variant="secondary" className="text-xs">
                  Complete
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-4">
          {currentStep === steps.length ? (
            <>
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
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !isStepValid(currentStep)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Property"
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderImagesMedia = () => (
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
            <Label>Property Images *</Label>
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
            {images.length === 0 && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                At least one image is required to proceed
              </p>
            )}
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
  );

  const renderLocationMap = () => (
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
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Enter street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
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
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                placeholder="Enter state or province"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip/Postal Code *</Label>
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
  );
}
