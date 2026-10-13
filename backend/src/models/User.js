import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['company', 'supplier'],
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'United States'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Transform output to remove passwordHash
userSchema.methods.toSafeObject = function() {
  const obj = this.toObject()
  delete obj.passwordHash
  return obj
}

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
