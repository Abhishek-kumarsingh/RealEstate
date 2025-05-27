"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { propertiesApi, inquiriesApi } from "@/lib/api";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useChat } from "@/lib/contexts/ChatContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  DollarSign,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Send,
  Loader2,
  ArrowLeft,
  Share,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PropertyDetailPage() {
  const params = useParams();
  const { user, token } = useAuth();
  const { createChat, setActiveChat } = useChat();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    message: "",
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError("");

      // Skip API call during build or if window is not available (SSR)
      if (typeof window === "undefined") {
        setError("Property not found");
        setLoading(false);
        return;
      }

      // If not a mock property, try to fetch from API
      const response = await propertiesApi.getById(params.id as string);
      console.log(response.property);

      setProperty(response.property);
    } catch (err: any) {
      setError(err.message || "Failed to fetch property");
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      // Redirect to login
      return;
    }

    setInquiryLoading(true);
    try {
      await inquiriesApi.create(
        {
          propertyId: property.id,
          message: inquiryData.message,
          contactInfo: {
            name: inquiryData.name,
            email: inquiryData.email,
            phone: inquiryData.phone,
          },
        },
        token
      );

      setInquirySuccess(true);
      setShowInquiryForm(false);
      setInquiryData({
        message: "",
        name: user.name || "",
        email: user.email || "",
        phone: "",
      });
    } catch (err: any) {
      console.error("Error sending inquiry:", err);
    } finally {
      setInquiryLoading(false);
    }
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return type === "rent" ? `${formatted}/mo` : formatted;
  };

  const handleStartChat = () => {
    if (!user || !property) return;

    const chat = createChat(property.agent.email, property.id);
    setActiveChat(chat);

    // Scroll to top to show floating chat
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 lg:px-8 py-8 mt-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-6 lg:px-8 py-8 mt-20">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error || "Property not found"}</p>
            <Link href="/properties">
              <Button>Back to Properties</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-8 py-8 mt-20">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/properties">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </Link>
      </div>

      {inquirySuccess && (
        <Alert className="mb-6">
          <AlertDescription>
            Your inquiry has been sent successfully! The agent will contact you
            soon.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={property.images[0].url}
              alt={property.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground">
                For{" "}
                {property.type === "sale"
                  ? "Sale"
                  : property.type === "rent"
                  ? "Rent"
                  : "Commercial"}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="icon" variant="secondary">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {property.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <MapPin className="h-4 w-4" />
                    {property.address +
                      ", " +
                      property.city +
                      ", " +
                      property.state +
                      " " +
                      property.zipCode +
                      " " +
                      property.country}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(property.price, property.type)}
                  </div>
                  {property.featured && (
                    <Badge variant="secondary" className="mt-1">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <span>{property.area} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Built {property.yearBuilt}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map(
                      (amenity: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {amenity}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={property.agent.avatar}
                    alt={property.agent.name}
                  />
                  <AvatarFallback>
                    {property.agent.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{property.agent.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Real Estate Agent
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{property.agent.email}</span>
                </div>
                {property.agent.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{property.agent.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                {user && (
                  <Button className="w-full" onClick={handleStartChat}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                )}

                {property.agent.phone && (
                  <Button className="w-full" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Agent
                  </Button>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowInquiryForm(true)}
                  disabled={!user}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </Button>

                {!user && (
                  <p className="text-xs text-muted-foreground text-center">
                    <Link
                      href="/login"
                      className="text-primary hover:underline"
                    >
                      Login
                    </Link>{" "}
                    to contact agent
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Form */}
          {showInquiryForm && user && (
            <Card>
              <CardHeader>
                <CardTitle>Send Inquiry</CardTitle>
                <CardDescription>
                  Get in touch with the agent about this property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInquiry} className="space-y-4">
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="I'm interested in this property..."
                      value={inquiryData.message}
                      onChange={(e) =>
                        setInquiryData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      required
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={inquiryData.name}
                        onChange={(e) =>
                          setInquiryData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inquiryData.email}
                        onChange={(e) =>
                          setInquiryData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={inquiryData.phone}
                        onChange={(e) =>
                          setInquiryData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={inquiryLoading}
                      className="flex-1"
                    >
                      {inquiryLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowInquiryForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
