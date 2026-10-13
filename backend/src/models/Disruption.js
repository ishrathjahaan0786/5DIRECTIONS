import mongoose from 'mongoose'

const disruptionSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false,
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },
  orderNumber: {
    type: String,
    required: false
  },
  materialName: {
    type: String,
    required: true
  },
  supplierName: {
    type: String,
    required: true
  },
  affectedQuantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high'
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'investigating', 'resolved', 'mitigated'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Disruption = mongoose.models.Disruption || mongoose.model('Disruption', disruptionSchema)
export default Disruption
