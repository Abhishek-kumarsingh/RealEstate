"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Home,
  Building,
  Hotel,
  Filter,
  Search,
  Square,
  Circle,
  Trash2,
  MousePointer,
  GraduationCap,
  ShoppingCart,
  Train,
  Car,
  Coffee,
  Hospital,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  price: number;
  type: 'sale' | 'rent' | 'commercial';
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    yearBuilt: number;
  };
  images: string[];
  status: string;
  featured: boolean;
}

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  onPropertySelect?: (property: Property) => void;
  onPropertyHover?: (property: Property | null) => void;
  onSearchAreaChange?: (properties: Property[]) => void;
  className?: string;
  height?: string;
  showControls?: boolean;
  showFilters?: boolean;
  enableClustering?: boolean;
  clusterRadius?: number;
  enableDrawing?: boolean;
  showNeighborhoodInsights?: boolean;
}

interface PropertyCluster {
  id: string;
  properties: Property[];
  center: { lat: number; lng: number };
  bounds: { north: number; south: number; east: number; west: number };
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface SearchArea {
  id: string;
  type: 'rectangle' | 'circle';
  bounds: MapBounds;
  center?: { lat: number; lng: number };
  radius?: number;
  pixelBounds?: { x: number; y: number; width: number; height: number };
}

type DrawingMode = 'none' | 'rectangle' | 'circle';

interface NeighborhoodPoint {
  id: string;
  name: string;
  type: 'school' | 'amenity' | 'transit';
  category: string;
  coordinates: { lat: number; lng: number };
  rating?: number;
  description?: string;
  distance?: string;
}

interface NeighborhoodOverlays {
  schools: boolean;
  amenities: boolean;
  transit: boolean;
}

// Mock neighborhood data
const mockNeighborhoodPoints: NeighborhoodPoint[] = [
  // Schools
  { id: 'school1', name: 'Lincoln Elementary', type: 'school', category: 'Elementary', coordinates: { lat: 34.0522, lng: -118.2437 }, rating: 4.5, description: 'Highly rated public elementary school' },
  { id: 'school2', name: 'Roosevelt High School', type: 'school', category: 'High School', coordinates: { lat: 34.0612, lng: -118.2347 }, rating: 4.2, description: 'Award-winning high school with STEM programs' },
  { id: 'school3', name: 'UCLA', type: 'school', category: 'University', coordinates: { lat: 34.0689, lng: -118.4452 }, rating: 4.8, description: 'Top-ranked public university' },

  // Amenities
  { id: 'amenity1', name: 'Whole Foods Market', type: 'amenity', category: 'Grocery', coordinates: { lat: 34.0422, lng: -118.2537 }, rating: 4.3, description: 'Organic grocery store' },
  { id: 'amenity2', name: 'Starbucks Coffee', type: 'amenity', category: 'Coffee', coordinates: { lat: 34.0522, lng: -118.2337 }, rating: 4.1, description: 'Popular coffee chain' },
  { id: 'amenity3', name: 'Cedars-Sinai Medical', type: 'amenity', category: 'Hospital', coordinates: { lat: 34.0755, lng: -118.3785 }, rating: 4.6, description: 'Leading medical center' },
  { id: 'amenity4', name: 'Beverly Center', type: 'amenity', category: 'Shopping', coordinates: { lat: 34.0755, lng: -118.3618 }, rating: 4.2, description: 'Major shopping mall' },

  // Transit
  { id: 'transit1', name: 'Union Station', type: 'transit', category: 'Train', coordinates: { lat: 34.0560, lng: -118.2368 }, description: 'Major transit hub' },
  { id: 'transit2', name: 'Hollywood/Highland', type: 'transit', category: 'Metro', coordinates: { lat: 34.1016, lng: -118.3387 }, description: 'Metro Red Line station' },
  { id: 'transit3', name: 'LAX Airport', type: 'transit', category: 'Airport', coordinates: { lat: 33.9425, lng: -118.4081 }, description: 'Los Angeles International Airport' },
];

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  onPropertyHover,
  onSearchAreaChange,
  className,
  height = "400px",
  showControls = true,
  showFilters = false,
  enableClustering = true,
  clusterRadius = 50,
  enableDrawing = false,
  showNeighborhoodInsights = false
}) => {
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({ lat: 34.0522, lng: -118.2437 }); // LA center
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<PropertyCluster | null>(null);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [clusters, setClusters] = useState<PropertyCluster[]>([]);
  const [expandedCluster, setExpandedCluster] = useState<PropertyCluster | null>(null);

  // Drawing state
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('none');
  const [searchAreas, setSearchAreas] = useState<SearchArea[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [propertiesInArea, setPropertiesInArea] = useState<Property[]>(properties);

  // Neighborhood insights state
  const [neighborhoodOverlays, setNeighborhoodOverlays] = useState<NeighborhoodOverlays>({
    schools: false,
    amenities: false,
    transit: false
  });
  const [hoveredNeighborhoodPoint, setHoveredNeighborhoodPoint] = useState<NeighborhoodPoint | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  // Calculate map bounds based on properties
  const calculateBounds = (props: Property[]): MapBounds => {
    if (props.length === 0) {
      return { north: 34.1, south: 34.0, east: -118.2, west: -118.3 };
    }

    const lats = props.map(p => p.location.coordinates.lat);
    const lngs = props.map(p => p.location.coordinates.lng);

    return {
      north: Math.max(...lats) + 0.01,
      south: Math.min(...lats) - 0.01,
      east: Math.max(...lngs) + 0.01,
      west: Math.min(...lngs) - 0.01
    };
  };

  // Update center when properties change
  useEffect(() => {
    if (properties.length > 0) {
      const bounds = calculateBounds(properties);
      setCenter({
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2
      });
    }
  }, [properties]);

  // Filter properties by type
  useEffect(() => {
    if (typeFilter === 'all') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.type === typeFilter));
    }
  }, [properties, typeFilter]);

  // Calculate distance between two points in pixels
  const calculatePixelDistance = (
    lat1: number, lng1: number,
    lat2: number, lng2: number,
    mapWidth: number, mapHeight: number
  ): number => {
    const point1 = latLngToPixel(lat1, lng1, mapWidth, mapHeight);
    const point2 = latLngToPixel(lat2, lng2, mapWidth, mapHeight);

    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  };

  // Clustering algorithm
  const clusterProperties = (props: Property[]): PropertyCluster[] => {
    if (!enableClustering || !mapRef.current) {
      return props.map(prop => ({
        id: prop.id,
        properties: [prop],
        center: prop.location.coordinates,
        bounds: {
          north: prop.location.coordinates.lat,
          south: prop.location.coordinates.lat,
          east: prop.location.coordinates.lng,
          west: prop.location.coordinates.lng
        }
      }));
    }

    const mapRect = mapRef.current.getBoundingClientRect();
    const clustered: PropertyCluster[] = [];
    const processed = new Set<string>();

    props.forEach(property => {
      if (processed.has(property.id)) return;

      const cluster: PropertyCluster = {
        id: `cluster-${property.id}`,
        properties: [property],
        center: property.location.coordinates,
        bounds: {
          north: property.location.coordinates.lat,
          south: property.location.coordinates.lat,
          east: property.location.coordinates.lng,
          west: property.location.coordinates.lng
        }
      };

      processed.add(property.id);

      // Find nearby properties to cluster
      props.forEach(otherProperty => {
        if (processed.has(otherProperty.id)) return;

        const distance = calculatePixelDistance(
          property.location.coordinates.lat,
          property.location.coordinates.lng,
          otherProperty.location.coordinates.lat,
          otherProperty.location.coordinates.lng,
          mapRect.width,
          mapRect.height
        );

        if (distance <= clusterRadius) {
          cluster.properties.push(otherProperty);
          processed.add(otherProperty.id);

          // Update cluster bounds
          cluster.bounds.north = Math.max(cluster.bounds.north, otherProperty.location.coordinates.lat);
          cluster.bounds.south = Math.min(cluster.bounds.south, otherProperty.location.coordinates.lat);
          cluster.bounds.east = Math.max(cluster.bounds.east, otherProperty.location.coordinates.lng);
          cluster.bounds.west = Math.min(cluster.bounds.west, otherProperty.location.coordinates.lng);

          // Update cluster center (average)
          const totalLat = cluster.properties.reduce((sum, p) => sum + p.location.coordinates.lat, 0);
          const totalLng = cluster.properties.reduce((sum, p) => sum + p.location.coordinates.lng, 0);
          cluster.center = {
            lat: totalLat / cluster.properties.length,
            lng: totalLng / cluster.properties.length
          };
        }
      });

      clustered.push(cluster);
    });

    return clustered;
  };

  // Update clusters when properties or zoom changes
  useEffect(() => {
    const newClusters = clusterProperties(filteredProperties);
    setClusters(newClusters);
  }, [filteredProperties, zoom, enableClustering, clusterRadius]);

  // Convert pixel coordinates to lat/lng
  const pixelToLatLng = (x: number, y: number, mapWidth: number, mapHeight: number) => {
    const bounds = calculateBounds(properties);

    const lng = bounds.west + (x / mapWidth) * (bounds.east - bounds.west);
    const lat = bounds.north - (y / mapHeight) * (bounds.north - bounds.south);

    return { lat, lng };
  };

  // Check if a property is within a search area
  const isPropertyInArea = (property: Property, area: SearchArea): boolean => {
    const { lat, lng } = property.location.coordinates;

    if (area.type === 'rectangle') {
      return lat >= area.bounds.south &&
             lat <= area.bounds.north &&
             lng >= area.bounds.west &&
             lng <= area.bounds.east;
    } else if (area.type === 'circle' && area.center && area.radius) {
      const distance = Math.sqrt(
        Math.pow(lat - area.center.lat, 2) + Math.pow(lng - area.center.lng, 2)
      );
      return distance <= area.radius;
    }

    return false;
  };

  // Filter properties by search areas
  const filterPropertiesByAreas = (props: Property[]): Property[] => {
    if (searchAreas.length === 0) return props;

    return props.filter(property =>
      searchAreas.some(area => isPropertyInArea(property, area))
    );
  };

  // Update filtered properties when search areas change
  useEffect(() => {
    const areaFilteredProperties = filterPropertiesByAreas(filteredProperties);
    setPropertiesInArea(areaFilteredProperties);
    onSearchAreaChange?.(areaFilteredProperties);
  }, [searchAreas, filteredProperties, onSearchAreaChange]);

  // Convert lat/lng to pixel coordinates
  const latLngToPixel = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    const bounds = calculateBounds(filteredProperties);

    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * mapWidth;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * mapHeight;

    return { x, y };
  };

  // Format price for display
  const formatPrice = (price: number, type: string) => {
    if (type === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  // Get property icon
  const getPropertyIcon = (category: string) => {
    switch (category) {
      case 'house':
        return Home;
      case 'apartment':
      case 'condo':
        return Building;
      case 'office':
      case 'retail':
      case 'warehouse':
        return Building;
      default:
        return Hotel;
    }
  };

  // Get property color
  const getPropertyColor = (type: string, featured: boolean) => {
    if (featured) return 'bg-yellow-500 border-yellow-600';
    switch (type) {
      case 'sale':
        return 'bg-blue-500 border-blue-600';
      case 'rent':
        return 'bg-green-500 border-green-600';
      case 'commercial':
        return 'bg-purple-500 border-purple-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const handlePropertyClick = (property: Property) => {
    onPropertySelect?.(property);
    setCenter(property.location.coordinates);
    setExpandedCluster(null);
  };

  const handlePropertyHover = (property: Property | null) => {
    setHoveredProperty(property);
    onPropertyHover?.(property);
    setHoveredCluster(null);
  };

  const handleClusterClick = (cluster: PropertyCluster) => {
    if (cluster.properties.length === 1) {
      handlePropertyClick(cluster.properties[0]);
    } else {
      setExpandedCluster(expandedCluster?.id === cluster.id ? null : cluster);
      setCenter(cluster.center);
      setSelectedProperty(null);
    }
  };

  const handleClusterHover = (cluster: PropertyCluster | null) => {
    setHoveredCluster(cluster);
    setHoveredProperty(null);
  };

  // Drawing event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (drawingMode === 'none' || !enableDrawing) return;

    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentDraw({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || drawingMode === 'none') return;

    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingMode === 'rectangle') {
      setCurrentDraw({
        x: Math.min(drawStart.x, x),
        y: Math.min(drawStart.y, y),
        width: Math.abs(x - drawStart.x),
        height: Math.abs(y - drawStart.y)
      });
    } else if (drawingMode === 'circle') {
      const radius = Math.sqrt(
        Math.pow(x - drawStart.x, 2) + Math.pow(y - drawStart.y, 2)
      );
      setCurrentDraw({
        x: drawStart.x - radius,
        y: drawStart.y - radius,
        width: radius * 2,
        height: radius * 2
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !currentDraw || drawingMode === 'none') return;

    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Create search area
    const newArea: SearchArea = {
      id: `area-${Date.now()}`,
      type: drawingMode,
      bounds: { north: 0, south: 0, east: 0, west: 0 },
      pixelBounds: currentDraw
    };

    if (drawingMode === 'rectangle') {
      const topLeft = pixelToLatLng(currentDraw.x, currentDraw.y, rect.width, rect.height);
      const bottomRight = pixelToLatLng(
        currentDraw.x + currentDraw.width,
        currentDraw.y + currentDraw.height,
        rect.width,
        rect.height
      );

      newArea.bounds = {
        north: topLeft.lat,
        south: bottomRight.lat,
        east: bottomRight.lng,
        west: topLeft.lng
      };
    } else if (drawingMode === 'circle') {
      const center = pixelToLatLng(drawStart.x, drawStart.y, rect.width, rect.height);
      const edge = pixelToLatLng(
        drawStart.x + currentDraw.width / 2,
        drawStart.y,
        rect.width,
        rect.height
      );
      const radius = Math.abs(edge.lng - center.lng);

      newArea.center = center;
      newArea.radius = radius;
      newArea.bounds = {
        north: center.lat + radius,
        south: center.lat - radius,
        east: center.lng + radius,
        west: center.lng - radius
      };
    }

    setSearchAreas(prev => [...prev, newArea]);
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentDraw(null);
    setDrawingMode('none');
  };

  const clearSearchAreas = () => {
    setSearchAreas([]);
    setDrawingMode('none');
  };

  const removeSearchArea = (areaId: string) => {
    setSearchAreas(prev => prev.filter(area => area.id !== areaId));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={cn(
      "relative overflow-hidden",
      isFullscreen && "fixed inset-0 z-50 rounded-none",
      className
    )}>
      {/* Map Container */}
      <div
        ref={mapRef}
        className={cn(
          "relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950",
          drawingMode !== 'none' && "cursor-crosshair"
        )}
        style={{ height: isFullscreen ? '100vh' : height }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Search Area Overlays */}
        {searchAreas.map((area) => {
          const mapRect = mapRef.current?.getBoundingClientRect();
          if (!mapRect || !area.pixelBounds) return null;

          const { x, y, width, height } = area.pixelBounds;

          return (
            <div key={area.id} className="absolute pointer-events-none">
              {area.type === 'rectangle' ? (
                <div
                  className="absolute border-2 border-primary bg-primary/10 rounded"
                  style={{
                    left: x,
                    top: y,
                    width: width,
                    height: height
                  }}
                />
              ) : (
                <div
                  className="absolute border-2 border-primary bg-primary/10 rounded-full"
                  style={{
                    left: x,
                    top: y,
                    width: width,
                    height: height
                  }}
                />
              )}

              {/* Remove button */}
              <button
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors pointer-events-auto"
                style={{ left: x + width - 12, top: y - 12 }}
                onClick={() => removeSearchArea(area.id)}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Current Drawing Overlay */}
        {isDrawing && currentDraw && (
          <div className="absolute pointer-events-none">
            {drawingMode === 'rectangle' ? (
              <div
                className="absolute border-2 border-dashed border-primary bg-primary/5"
                style={{
                  left: currentDraw.x,
                  top: currentDraw.y,
                  width: currentDraw.width,
                  height: currentDraw.height
                }}
              />
            ) : (
              <div
                className="absolute border-2 border-dashed border-primary bg-primary/5 rounded-full"
                style={{
                  left: currentDraw.x,
                  top: currentDraw.y,
                  width: currentDraw.width,
                  height: currentDraw.height
                }}
              />
            )}
          </div>
        )}

        {/* Cluster Markers */}
        {clusters.map((cluster) => {
          const mapRect = mapRef.current?.getBoundingClientRect();
          if (!mapRect) return null;

          const { x, y } = latLngToPixel(
            cluster.center.lat,
            cluster.center.lng,
            mapRect.width,
            mapRect.height
          );

          const isClusterHovered = hoveredCluster?.id === cluster.id;
          const isClusterExpanded = expandedCluster?.id === cluster.id;
          const isSingleProperty = cluster.properties.length === 1;
          const property = cluster.properties[0];

          if (isSingleProperty) {
            // Render single property marker
            const Icon = getPropertyIcon(property.category);
            const isSelected = selectedProperty?.id === property.id;
            const isHovered = hoveredProperty?.id === property.id;

            return (
              <div
                key={cluster.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
                  isSelected && "z-30 scale-125",
                  isHovered && "z-20 scale-110"
                )}
                style={{ left: x, top: y }}
                onClick={() => handlePropertyClick(property)}
                onMouseEnter={() => handlePropertyHover(property)}
                onMouseLeave={() => handlePropertyHover(null)}
              >
                {/* Property Marker */}
                <div className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all",
                  getPropertyColor(property.type, property.featured),
                  isSelected && "ring-4 ring-white ring-opacity-50",
                  isHovered && "shadow-xl"
                )}>
                  <Icon className="w-4 h-4 text-white" />

                  {/* Featured Badge */}
                  {property.featured && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
                  )}
                </div>

                {/* Property Info Popup */}
                {(isSelected || isHovered) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-3 z-40">
                    <div className="text-sm font-semibold truncate">{property.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {property.location.city}, {property.location.state}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="font-bold text-primary">
                        {formatPrice(property.price, property.type)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {property.features.bedrooms}bd {property.features.bathrooms}ba
                      </Badge>
                    </div>

                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
                  </div>
                )}
              </div>
            );
          } else {
            // Render cluster marker
            return (
              <div
                key={cluster.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
                  isClusterExpanded && "z-30 scale-110",
                  isClusterHovered && "z-20 scale-105"
                )}
                style={{ left: x, top: y }}
                onClick={() => handleClusterClick(cluster)}
                onMouseEnter={() => handleClusterHover(cluster)}
                onMouseLeave={() => handleClusterHover(null)}
              >
                {/* Cluster Marker */}
                <div className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full border-3 shadow-lg transition-all bg-primary border-primary-foreground",
                  isClusterExpanded && "ring-4 ring-primary ring-opacity-30",
                  isClusterHovered && "shadow-xl"
                )}>
                  <span className="text-white font-bold text-sm">
                    {cluster.properties.length}
                  </span>
                </div>

                {/* Cluster Info Popup */}
                {(isClusterExpanded || isClusterHovered) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-3 z-40">
                    <div className="text-sm font-semibold mb-2">
                      {cluster.properties.length} Properties
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>For Sale:</span>
                        <span>{cluster.properties.filter(p => p.type === 'sale').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>For Rent:</span>
                        <span>{cluster.properties.filter(p => p.type === 'rent').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commercial:</span>
                        <span>{cluster.properties.filter(p => p.type === 'commercial').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Featured:</span>
                        <span>{cluster.properties.filter(p => p.featured).length}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Click to {isClusterExpanded ? 'collapse' : 'expand'}
                    </div>

                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800" />
                  </div>
                )}

                {/* Expanded Cluster Properties */}
                {isClusterExpanded && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
                    {cluster.properties.map((prop, index) => {
                      const angle = (index / cluster.properties.length) * 2 * Math.PI;
                      const radius = 40;
                      const offsetX = Math.cos(angle) * radius;
                      const offsetY = Math.sin(angle) * radius;
                      const Icon = getPropertyIcon(prop.category);

                      return (
                        <div
                          key={prop.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                          style={{
                            left: offsetX,
                            top: offsetY,
                            animationDelay: `${index * 50}ms`
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyClick(prop);
                          }}
                          onMouseEnter={() => handlePropertyHover(prop)}
                          onMouseLeave={() => handlePropertyHover(null)}
                        >
                          <div className={cn(
                            "relative flex items-center justify-center w-6 h-6 rounded-full border-2 shadow-lg transition-all",
                            getPropertyColor(prop.type, prop.featured)
                          )}>
                            <Icon className="w-3 h-3 text-white" />
                            {prop.featured && (
                              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full border border-white" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        })}

        {/* Map Controls */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              className="bg-white/90 hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              className="bg-white/90 hover:bg-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={toggleFullscreen}
              className="bg-white/90 hover:bg-white"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {/* Drawing Controls */}
            {enableDrawing && (
              <>
                <div className="border-t border-gray-300 my-1"></div>
                <Button
                  size="icon"
                  variant={drawingMode === 'rectangle' ? 'default' : 'secondary'}
                  onClick={() => setDrawingMode(drawingMode === 'rectangle' ? 'none' : 'rectangle')}
                  className="bg-white/90 hover:bg-white"
                  title="Draw Rectangle"
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={drawingMode === 'circle' ? 'default' : 'secondary'}
                  onClick={() => setDrawingMode(drawingMode === 'circle' ? 'none' : 'circle')}
                  className="bg-white/90 hover:bg-white"
                  title="Draw Circle"
                >
                  <Circle className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setDrawingMode('none')}
                  className="bg-white/90 hover:bg-white"
                  title="Select Mode"
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
                {searchAreas.length > 0 && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={clearSearchAreas}
                    className="bg-red-500/90 hover:bg-red-500"
                    title="Clear All Areas"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        )}

        {/* Type Filters */}
        {showFilters && (
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant={typeFilter === 'all' ? 'default' : 'secondary'}
              onClick={() => setTypeFilter('all')}
              className="bg-white/90 hover:bg-white"
            >
              All ({properties.length})
            </Button>
            <Button
              size="sm"
              variant={typeFilter === 'sale' ? 'default' : 'secondary'}
              onClick={() => setTypeFilter('sale')}
              className="bg-white/90 hover:bg-white"
            >
              Sale ({properties.filter(p => p.type === 'sale').length})
            </Button>
            <Button
              size="sm"
              variant={typeFilter === 'rent' ? 'default' : 'secondary'}
              onClick={() => setTypeFilter('rent')}
              className="bg-white/90 hover:bg-white"
            >
              Rent ({properties.filter(p => p.type === 'rent').length})
            </Button>
            <Button
              size="sm"
              variant={typeFilter === 'commercial' ? 'default' : 'secondary'}
              onClick={() => setTypeFilter('commercial')}
              className="bg-white/90 hover:bg-white"
            >
              Commercial ({properties.filter(p => p.type === 'commercial').length})
            </Button>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 text-xs">
          <div className="font-semibold mb-2">Map Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>For Sale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>For Rent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Commercial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Featured</span>
            </div>
            {enableClustering && (
              <>
                <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2+</span>
                  </div>
                  <span>Property Cluster</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Click clusters to expand
                </div>
              </>
            )}
            {enableDrawing && (
              <>
                <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>🔲 Rectangle: Draw search area</div>
                  <div>⭕ Circle: Draw search radius</div>
                  <div>🗑️ Click X to remove areas</div>
                  {searchAreas.length > 0 && (
                    <div className="text-primary font-medium">
                      {propertiesInArea.length} properties in search areas
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Property Count */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-2 text-sm font-medium">
          {searchAreas.length > 0 ? (
            <div className="text-center">
              <div>{propertiesInArea.length} in search areas</div>
              <div className="text-xs text-muted-foreground">of {filteredProperties.length} total</div>
            </div>
          ) : (
            <div>{filteredProperties.length} Properties</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PropertyMap;
