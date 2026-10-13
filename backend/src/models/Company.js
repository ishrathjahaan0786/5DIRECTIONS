import mongoose from 'mongoose'

const companySchema = new mongoose.Schema({
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
    default: 'United States'
  },
  industry: {
    type: String,
    default: 'Aerospace & Advanced Manufacturing'
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Company = mongoose.models.Company || mongoose.model('Company', companySchema)
export default Company
