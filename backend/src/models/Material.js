import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
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
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  specification: {
    type: String,
    default: 'Standard Industrial Grade'
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'kg'
  },
  stockAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderQty: {
    type: Number,
    default: 100
  },
  leadTimeDays: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Material = mongoose.models.Material || mongoose.model('Material', materialSchema)
export default Material
