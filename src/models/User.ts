import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string
  email?: string
  phone?: string
  password?: string
  image?: string
  provider?: string
  watchlist: string[] // Array of movie IDs
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    match: [/^[+]?[0-9]{10,15}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  image: {
    type: String
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials'
  },
  watchlist: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
})

// Ensure at least email or phone is provided
UserSchema.pre('validate', function() {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone must be provided')
    this.invalidate('phone', 'Either email or phone must be provided')
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)