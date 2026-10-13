import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  country: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  tier: {
    type: String,
    enum: ['Tier 1', 'Tier 2', 'Tier 3'],
    default: 'Tier 1'
  },
  verified: {
    type: Boolean,
    default: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  leadTimeDays: {
    type: Number,
    default: 7
  },
  complianceScore: {
    type: Number,
    default: 95
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema)
export default Supplier
