import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  _id: string;
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
    area: number;
    yearBuilt: number;
  };
  amenities: string[];
  images: string[];
  status: 'available' | 'pending' | 'sold';
  featured: boolean;
  agent: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['sale', 'rent', 'commercial']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['house', 'apartment', 'condo', 'office', 'retail', 'warehouse', 'land']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      lng: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  features: {
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Bathrooms cannot be negative']
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [1, 'Area must be at least 1 square foot']
    },
    yearBuilt: {
      type: Number,
      required: [true, 'Year built is required'],
      min: [1800, 'Year built cannot be before 1800'],
      max: [new Date().getFullYear() + 5, 'Year built cannot be more than 5 years in the future']
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  status: {
    type: String,
    enum: ['available', 'pending', 'sold'],
    default: 'available'
  },
  featured: {
    type: Boolean,
    default: false
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  }
}, {
  timestamps: true
});

// Index for search functionality
PropertySchema.index({ 
  title: 'text', 
  description: 'text',
  'location.city': 'text',
  'location.state': 'text',
  'location.address': 'text'
});

PropertySchema.index({ type: 1, status: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ featured: 1 });
PropertySchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
