import mongoose from 'mongoose'

const agentActivitySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  companyName: {
    type: String,
    default: 'AeroDynamics Global Inc.'
  },
  stepNumber: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  toolUsed: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  input: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'warning', 'failed'],
    default: 'success'
  },
  isSimulated: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const AgentActivity = mongoose.models.AgentActivity || mongoose.model('AgentActivity', agentActivitySchema)
export default AgentActivity
