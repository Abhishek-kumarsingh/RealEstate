// Temporary mock data for properties
export type Property = {
  id: string;
  title: string;
  description: string;
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
    area: number; // in square feet
    yearBuilt: number;
  };
  amenities: string[];
  images: string[];
  status: 'available' | 'pending' | 'sold';
  featured: boolean;
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
};

// Mock data for properties
export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Villa with Ocean View',
    description: 'Stunning modern villa with panoramic ocean views, featuring an infinity pool, spacious living areas, and high-end finishes throughout. Perfect for luxury living and entertaining.',
    price: 1250000,
    type: 'sale',
    category: 'house',
    location: {
      address: '123 Oceanfront Drive',
      city: 'Malibu',
      state: 'CA',
      zipCode: '90265',
      coordinates: {
        lat: 34.025922,
        lng: -118.779757,
      },
    },
    features: {
      bedrooms: 5,
      bathrooms: 4.5,
      area: 4200,
      yearBuilt: 2019,
    },
    amenities: [
      'Swimming Pool',
      'Ocean View',
      'Home Theater',
      'Smart Home System',
      'Wine Cellar',
      'Gourmet Kitchen',
      'Private Garden',
    ],
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
    ],
    status: 'available',
    featured: true,
    agent: {
      id: 'a1',
      name: 'Sarah Johnson',
      phone: '(310) 555-1234',
      email: 'sarah.johnson@realestatehub.com',
      avatar: 'https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg',
    },
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-10-20T14:45:00Z',
  },
  {
    id: '2',
    title: 'Downtown Luxury Apartment',
    description: 'Modern luxury apartment in the heart of downtown, featuring floor-to-ceiling windows, high-end appliances, and access to premium building amenities.',
    price: 4500,
    type: 'rent',
    category: 'apartment',
    location: {
      address: '456 City Center Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90017',
      coordinates: {
        lat: 34.052235,
        lng: -118.243683,
      },
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1500,
      yearBuilt: 2020,
    },
    amenities: [
      'Fitness Center',
      'Rooftop Lounge',
      'Concierge Service',
      'Pet Friendly',
      'In-unit Laundry',
      'Smart Home Features',
      'Secure Parking',
    ],
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
      'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    ],
    status: 'available',
    featured: true,
    agent: {
      id: 'a2',
      name: 'Michael Chen',
      phone: '(213) 555-5678',
      email: 'michael.chen@realestatehub.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    createdAt: '2023-09-28T09:15:00Z',
    updatedAt: '2023-10-05T11:20:00Z',
  },
  {
    id: '3',
    title: 'Waterfront Commercial Building',
    description: 'Prime commercial property with waterfront views, ideal for restaurants, retail, or office space. Featuring modern architecture and plenty of parking.',
    price: 3500000,
    type: 'commercial',
    category: 'office',
    location: {
      address: '789 Waterfront Way',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111',
      coordinates: {
        lat: 37.799722,
        lng: -122.398611,
      },
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 8500,
      yearBuilt: 2017,
    },
    amenities: [
      'Waterfront Views',
      'Private Parking',
      'High Ceilings',
      'Modern HVAC',
      'Freight Elevator',
      'Security System',
      'Fiber Internet',
    ],
    images: [
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
      'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg',
      'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg',
    ],
    status: 'available',
    featured: false,
    agent: {
      id: 'a3',
      name: 'Jessica Martinez',
      phone: '(415) 555-9012',
      email: 'jessica.martinez@realestatehub.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    createdAt: '2023-10-01T14:20:00Z',
    updatedAt: '2023-10-10T16:30:00Z',
  },
  {
    id: '4',
    title: 'Suburban Family Home',
    description: 'Beautiful family home in a quiet suburban neighborhood, featuring a spacious backyard, updated kitchen, and close proximity to schools and parks.',
    price: 750000,
    type: 'sale',
    category: 'house',
    location: {
      address: '101 Maple Street',
      city: 'Pasadena',
      state: 'CA',
      zipCode: '91101',
      coordinates: {
        lat: 34.147785,
        lng: -118.144515,
      },
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      yearBuilt: 2005,
    },
    amenities: [
      'Backyard',
      'Garage',
      'Updated Kitchen',
      'Fireplace',
      'Central Air',
      'Hardwood Floors',
      'Patio',
    ],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',
      'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg',
      'https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg',
    ],
    status: 'available',
    featured: true,
    agent: {
      id: 'a4',
      name: 'Robert Wilson',
      phone: '(626) 555-3456',
      email: 'robert.wilson@realestatehub.com',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
    createdAt: '2023-09-15T08:45:00Z',
    updatedAt: '2023-10-01T10:15:00Z',
  },
  {
    id: '5',
    title: 'Mountain Retreat Cabin',
    description: 'Cozy mountain cabin surrounded by nature, perfect for weekend getaways or year-round living. Features rustic charm with modern amenities.',
    price: 395000,
    type: 'sale',
    category: 'house',
    location: {
      address: '222 Pine Ridge Road',
      city: 'Big Bear',
      state: 'CA',
      zipCode: '92315',
      coordinates: {
        lat: 34.2439,
        lng: -116.9114,
      },
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      yearBuilt: 1995,
    },
    amenities: [
      'Fireplace',
      'Deck',
      'Mountain View',
      'Wood Stove',
      'Updated Kitchen',
      'Large Windows',
      'Hiking Trails Nearby',
    ],
    images: [
      'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg',
      'https://images.pexels.com/photos/803975/pexels-photo-803975.jpeg',
      'https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg',
      'https://images.pexels.com/photos/26143/pexels-photo.jpg',
    ],
    status: 'available',
    featured: false,
    agent: {
      id: 'a1',
      name: 'Sarah Johnson',
      phone: '(310) 555-1234',
      email: 'sarah.johnson@realestatehub.com',
      avatar: 'https://images.pexels.com/photos/5325840/pexels-photo-5325840.jpeg',
    },
    createdAt: '2023-10-05T11:30:00Z',
    updatedAt: '2023-10-15T09:45:00Z',
  },
  {
    id: '6',
    title: 'Luxury Beachfront Condo',
    description: 'Exquisite beachfront condo with stunning ocean views, gourmet kitchen, and access to resort-style amenities. Perfect for luxury coastal living.',
    price: 2200000,
    type: 'sale',
    category: 'condo',
    location: {
      address: '333 Coastal Highway',
      city: 'Santa Monica',
      state: 'CA',
      zipCode: '90402',
      coordinates: {
        lat: 34.0241,
        lng: -118.5070,
      },
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2200,
      yearBuilt: 2018,
    },
    amenities: [
      'Ocean View',
      'Private Balcony',
      'Pool',
      'Fitness Center',
      'Concierge',
      'Secured Parking',
      'Beach Access',
    ],
    images: [
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      'https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg',
      'https://images.pexels.com/photos/276554/pexels-photo-276554.jpeg',
      'https://images.pexels.com/photos/1707821/pexels-photo-1707821.jpeg',
    ],
    status: 'pending',
    featured: true,
    agent: {
      id: 'a2',
      name: 'Michael Chen',
      phone: '(213) 555-5678',
      email: 'michael.chen@realestatehub.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    createdAt: '2023-09-20T15:10:00Z',
    updatedAt: '2023-10-18T17:25:00Z',
  },
];

// Get featured properties
export const getFeaturedProperties = (): Property[] => {
  return properties.filter(property => property.featured);
};

// Get properties by type
export const getPropertiesByType = (type: 'sale' | 'rent' | 'commercial'): Property[] => {
  return properties.filter(property => property.type === type);
};

// Get property by ID
export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(property => property.id === id);
};

// Search properties with filters
export const searchProperties = (filters: {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}): Property[] => {
  return properties.filter(property => {
    // Type filter
    if (filters.type && property.type !== filters.type) return false;
    
    // Location filter (city or state)
    if (filters.location && 
        !property.location.city.toLowerCase().includes(filters.location.toLowerCase()) &&
        !property.location.state.toLowerCase().includes(filters.location.toLowerCase()) &&
        !property.location.address.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    
    // Property type filter
    if (filters.propertyType && filters.propertyType !== 'any' && 
        property.category !== filters.propertyType) {
      return false;
    }
    
    // Bedrooms filter
    if (filters.bedrooms && property.features.bedrooms < filters.bedrooms) return false;
    
    // Bathrooms filter
    if (filters.bathrooms && property.features.bathrooms < filters.bathrooms) return false;
    
    // Area range filter
    if (filters.minArea && property.features.area < filters.minArea) return false;
    if (filters.maxArea && property.features.area > filters.maxArea) return false;
    
    return true;
  });
};