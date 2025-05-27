"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { propertiesApi } from "@/lib/api";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Search,
  Filter,
  MapPin,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { log } from "console";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: "sale" | "rent" | "commercial";
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
  };
  amenities: string[];
  images: string[];
  status: string;
  featured: boolean;
  agent: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

function PropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    location: "",
    minPrice: "",
    maxPrice: "",
    category: "all",
    bedrooms: "all",
    bathrooms: "all",
    amenities: [] as string[],
  });

  const searchParams = useSearchParams();

  const fetchProperties = async (currentFilters = filters) => {
    // Skip API call during build or if window is not available (SSR)
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build query params
      const params: Record<string, string> = {};
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value && value !== "all" && !Array.isArray(value)) {
          params[key] = value;
        }
      });

      const response = await propertiesApi.getAll(params);
      setProperties(response.properties || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters = {
      type: searchParams.get("type") || "all",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      category: searchParams.get("category") || "all",
      bedrooms: searchParams.get("bedrooms") || "all",
      bathrooms: searchParams.get("bathrooms") || "all",
      amenities: [] as string[],
    };
    setFilters(initialFilters);
    fetchProperties(initialFilters);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const clearFilters = () => {
    const clearedFilters = {
      type: "all",
      location: "",
      minPrice: "",
      maxPrice: "",
      category: "all",
      bedrooms: "all",
      bathrooms: "all",
      amenities: [] as string[],
    };
    setFilters(clearedFilters);
    fetchProperties(clearedFilters);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Perfect Property
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover {properties.length} properties across major cities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link href="/properties/map">
                  <MapPin className="h-4 w-4" />
                  Map View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {Object.values(filters).some(
                (v) =>
                  v && v !== "all" && (Array.isArray(v) ? v.length > 0 : true)
              ) && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>

            <div className="text-sm text-muted-foreground">
              {loading ? "Loading..." : `${properties.length} properties found`}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="area-large">Largest Area</SelectItem>
                  <SelectItem value="featured">Featured First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange("type", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any type</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Location
                  </label>
                  <Input
                    placeholder="City, state, or address"
                    value={filters.location}
                    onChange={(e) =>
                      handleFilterChange("location", e.target.value)
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Any category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any category</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bedrooms
                  </label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) =>
                      handleFilterChange("bedrooms", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bathrooms
                  </label>
                  <Select
                    value={filters.bathrooms}
                    onValueChange={(value) =>
                      handleFilterChange("bathrooms", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-md shadow-sm hover:shadow-md transition-all"
                >
                  <Search className="h-3.5 w-3.5" />
                  Search Properties
                </Button>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  size="sm"
                  className="h-8 px-3 text-xs font-medium"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchProperties()}>Try Again</Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No properties found matching your criteria.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        ) : (
          <div
            className={cn(
              "gap-6",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col space-y-6"
            )}
          >
            {properties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                featured={viewMode === "list"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
