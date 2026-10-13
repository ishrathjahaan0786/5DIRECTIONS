import mongoose from 'mongoose'

const allocationItemSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: false
  },
  supplierName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  leadTimeDays: {
    type: Number,
    default: 7
  },
  certVerified: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  orderNumber: {
    type: String,
    default: null
  }
}, { _id: false })

const recoveryPlanSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false,
    index: true
  },
  companyName: {
    type: String,
    default: 'AeroDynamics Global Inc.'
  },
  originalOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },
  originalOrderNumber: {
    type: String,
    default: null
  },
  materialName: {
    type: String,
    required: true
  },
  requiredQuantity: {
    type: Number,
    required: true
  },
  shortageQuantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  deliveryDeadline: {
    type: String,
    default: '14 days'
  },
  budget: {
    type: Number,
    default: null
  },
  proposedAllocations: [allocationItemSchema],
  totalEstimatedCost: {
    type: Number,
    required: true
  },
  uncoveredQuantity: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Proposed', 'Approved', 'Rejected', 'Executed'],
    default: 'Proposed',
    index: true
  },
  reasoning: {
    type: String,
    default: ''
  },
  risks: [{
    type: String
  }],
  isSimulated: {
    type: Boolean,
    default: false,
    index: true
  },
  executedOrders: [{
    type: String
  }],
  executionSummary: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const RecoveryPlan = mongoose.models.RecoveryPlan || mongoose.model('RecoveryPlan', recoveryPlanSchema)
export default RecoveryPlan
