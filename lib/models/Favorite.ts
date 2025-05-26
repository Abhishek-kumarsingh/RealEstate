import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required']
  }
}, {
  timestamps: true
});

// Ensure a user can only favorite a property once
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
