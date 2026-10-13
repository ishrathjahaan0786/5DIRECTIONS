import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
    index: true
  },
  supplierName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  certNumber: {
    type: String,
    required: true
  },
  issuingBody: {
    type: String,
    required: true
  },
  issueDate: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: true
  },
  documentUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Certificate = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema)
export default Certificate
