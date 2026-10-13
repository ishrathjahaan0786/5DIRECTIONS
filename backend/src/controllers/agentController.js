import SupplyChainResilienceAgent from '../agent/SupplyChainResilienceAgent.js'
import RecoveryPlan from '../models/RecoveryPlan.js'
import { db } from '../data/db.js'
import { getDbStatus } from '../config/db.js'

export const investigate = async (req, res) => {
  try {
    const result = await SupplyChainResilienceAgent.investigateDisruption(req.body, req.user)
    return res.json(result)
  } catch (error) {
    console.error('[Agent API] Investigation failed:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete disruption investigation'
    })
  }
}

export const approvePlan = async (req, res) => {
  try {
    const { planId, isSimulated } = req.body
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' })
    }

    const result = await SupplyChainResilienceAgent.approvePlan(planId, req.user, isSimulated)
    return res.json(result)
  } catch (error) {
    console.error('[Agent API] Plan approval failed:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute recovery plan'
    })
  }
}

export const rejectPlan = async (req, res) => {
  try {
    const { planId } = req.body
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' })
    }

    const result = await SupplyChainResilienceAgent.rejectPlan(planId, req.user)
    return res.json(result)
  } catch (error) {
    console.error('[Agent API] Plan rejection failed:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject recovery plan'
    })
  }
}

export const getActivity = (req, res) => {
  const { sessionId } = req.params
  const activities = SupplyChainResilienceAgent.getSessionActivity(sessionId)
  return res.json({ success: true, activities })
}

export const getPlans = async (req, res) => {
  try {
    const dbStatus = getDbStatus()
    if (dbStatus.connected) {
      const plans = await RecoveryPlan.find().sort({ createdAt: -1 }).limit(10).lean()
      return res.json({ success: true, plans })
    }

    const localPlans = db.recoveryPlans || []
    return res.json({ success: true, plans: localPlans.slice(-10).reverse() })
  } catch (err) {
    return res.json({ success: true, plans: [] })
  }
}
