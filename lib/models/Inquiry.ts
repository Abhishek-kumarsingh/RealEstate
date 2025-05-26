import mongoose, { Document, Schema } from 'mongoose';

export interface IInquiry extends Document {
  _id: string;
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  message: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'responded' | 'closed';
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
  },
  response: {
    type: String,
    maxlength: [1000, 'Response cannot be more than 1000 characters']
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
InquirySchema.index({ property: 1, user: 1 });
InquirySchema.index({ agent: 1, status: 1 });
InquirySchema.index({ createdAt: -1 });

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
