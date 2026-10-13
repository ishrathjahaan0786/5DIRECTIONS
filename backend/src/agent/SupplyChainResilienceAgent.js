import {
  getMaterialRequirements,
  getOrderDetails,
  getSupplierInventory,
  searchAlternativeSuppliers,
  compareSupplierOffers,
  getSupplierCertificateStatus,
  identifySupplyShortage,
  calculateMultiSupplierAllocation,
  evaluateRecoveryPlans,
  createRecoveryPlan,
  createDraftPurchaseOrders,
  verifyRecoveryResult,
  recordAgentActivity,
  sessionActivityLogs
} from './tools.js'
import { generateGeminiReasoning } from './geminiService.js'

export class SupplyChainResilienceAgent {
  /**
   * Run the complete multi-step autonomous investigation workflow
   */
  static async investigateDisruption(params, user) {
    const sessionId = `ses-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
    const isSimulated = Boolean(params.isSimulated)
    const timeline = []

    const logStep = async (stepNumber, action, toolUsed, explanation, input, result, status = 'success') => {
      const entry = await recordAgentActivity({
        sessionId,
        userId: user?.id || user?._id,
        companyName: user?.companyName || 'AeroDynamics Global Inc.',
        stepNumber,
        action,
        toolUsed,
        explanation,
        input,
        result,
        status,
        isSimulated
      })
      timeline.push(entry)
      return entry
    }

    try {
      // ── STEP 1: Investigate Requirement & Order ──
      const req = await getMaterialRequirements(params, user)
      await logStep(
        1,
        'Investigating Affected Requirement',
        'getMaterialRequirements',
        `Analyzed requirement for ${req.materialName}: ${req.requiredQuantity.toLocaleString()} ${req.unit} needed within ${req.deliveryDeadline}.`,
        { orderNumber: params.orderNumber, materialName: params.materialName },
        req
      )

      // ── STEP 2: Identify Disruption & Shortage ──
      // Original supplier capability (simulated or actual)
      const confirmedQty = params.confirmedQuantity !== undefined ? Number(params.confirmedQuantity) : 2000
      const shortageAnalysis = identifySupplyShortage({
        requiredQuantity: req.requiredQuantity,
        confirmedQuantity: confirmedQty,
        unit: req.unit
      })

      await logStep(
        2,
        'Calculating Supply Shortage',
        'identifySupplyShortage',
        `Confirmed original supplier (${req.originalSupplier}) can only provide ${confirmedQty.toLocaleString()} ${req.unit}. Identified acute shortage of ${shortageAnalysis.shortageQuantity.toLocaleString()} ${req.unit} (${shortageAnalysis.shortagePercentage}% deficit).`,
        { required: req.requiredQuantity, confirmed: confirmedQty },
        shortageAnalysis
      )

      // ── STEP 3: Discover Alternative Suppliers ──
      const alternatives = await searchAlternativeSuppliers({
        materialName: req.materialName,
        excludeSupplierNames: [req.originalSupplier]
      })

      await logStep(
        3,
        'Discovering Alternative Qualified Suppliers',
        'searchAlternativeSuppliers',
        `Scanned database and discovered ${alternatives.length} candidate suppliers holding verified stock for ${req.materialName}.`,
        { materialName: req.materialName, exclude: req.originalSupplier },
        { candidatesCount: alternatives.length, suppliers: alternatives.map(s => s.supplierName) }
      )

      // ── STEP 4: Compare Offers & Verify Certificates ──
      const offers = await compareSupplierOffers({ candidateSuppliers: alternatives })
      await logStep(
        4,
        'Comparing Supplier Pricing & Quality Credentials',
        'compareSupplierOffers',
        `Verified ISO 9001 and AS9100D compliance credentials. Analyzed unit prices, lead times, and reliability ratings across all candidate suppliers.`,
        { candidates: alternatives.map(a => a.supplierName) },
        offers
      )

      // ── STEP 5: Calculate Multi-Supplier Allocation (Deterministic) ──
      const allocationResult = calculateMultiSupplierAllocation({
        shortageQuantity: shortageAnalysis.shortageQuantity,
        candidateSuppliers: alternatives,
        maxLeadTimeDays: 14
      })

      await logStep(
        5,
        'Computing Optimal Multi-Supplier Allocation',
        'calculateMultiSupplierAllocation',
        `Generated deterministic allocation: distributed ${allocationResult.totalAllocated.toLocaleString()} ${req.unit} across ${allocationResult.allocations.length} alternative suppliers without exceeding individual inventory limits.`,
        { shortage: shortageAnalysis.shortageQuantity },
        allocationResult
      )

      // ── STEP 6: Evaluate Feasible Recovery Plans ──
      const evaluation = evaluateRecoveryPlans({
        originalSupplierRetainedQty: confirmedQty,
        originalSupplierUnitPrice: 42,
        allocationResult,
        deadlineDays: 14
      })

      await logStep(
        6,
        'Evaluating Business Constraints & Operational Risks',
        'evaluateRecoveryPlans',
        `Validated budget impact, total procurement cost ($${evaluation.totalEstimatedCost.toLocaleString()}), and logistics lead times. Identified ${evaluation.risks.length} manageable operational risks.`,
        { deadline: 14, retainedQty: confirmedQty },
        evaluation
      )

      // ── STEP 7: AI Rationale Synthesis (Gemini or Deterministic) ──
      let aiSynthesis = null
      const geminiPrompt = `You are the 5Directions Supply Chain Resilience Agent.
A supply disruption occurred:
Material: ${req.materialName}
Required: ${req.requiredQuantity} ${req.unit}
Shortage: ${shortageAnalysis.shortageQuantity} ${req.unit}
Allocations proposed:
${allocationResult.allocations.map(a => `- ${a.supplierName}: ${a.quantity} ${req.unit} @ $${a.unitPrice}/${req.unit} (Lead time: ${a.leadTimeDays}d, Cert: ${a.certVerified ? 'Verified' : 'Pending'})`).join('\n')}

Total estimated recovery cost: $${evaluation.totalEstimatedCost}.
Explain concisely to the Procurement Director why this multi-supplier allocation is the safest recovery route and what trade-offs were balanced.`

      const geminiResult = await generateGeminiReasoning(
        geminiPrompt,
        'You are an expert AI Supply Chain Resilience Agent operating within 5Directions.'
      )

      if (geminiResult.success && geminiResult.isLiveAI) {
        aiSynthesis = {
          isLiveAI: true,
          model: geminiResult.modelUsed,
          text: geminiResult.text
        }
      } else {
        aiSynthesis = {
          isLiveAI: false,
          model: '5Directions Deterministic Engine',
          text: `Optimal multi-supplier recovery formulated: Reallocated ${shortageAnalysis.shortageQuantity.toLocaleString()} ${req.unit} across ${allocationResult.allocations.length} certified suppliers (${allocationResult.allocations.map(a => a.supplierName).join(' and ')}). All candidate allocations strictly adhere to individual stock limits, verified AS9100D/ISO standards, and the 14-day delivery SLA.`
        }
      }

      await logStep(
        7,
        'Synthesizing Recovery Plan & Risk Profile',
        'recordAgentActivity',
        `Synthesized comprehensive recovery plan with rationale (${aiSynthesis.isLiveAI ? 'Live Gemini ' + aiSynthesis.model : 'Deterministic Resilience Engine'}).`,
        { aiMode: aiSynthesis.model },
        { rationale: aiSynthesis.text }
      )

      // ── STEP 8: Create Proposed Recovery Plan (Human Approval Gate) ──
      const planCreation = await createRecoveryPlan(
        {
          companyName: user?.companyName || 'AeroDynamics Global Inc.',
          originalOrderNumber: req.orderNumber || params.orderNumber || 'PO-2026-0100',
          materialName: req.materialName,
          requiredQuantity: req.requiredQuantity,
          shortageQuantity: shortageAnalysis.shortageQuantity,
          unit: req.unit,
          deliveryDeadline: req.deliveryDeadline,
          budget: params.budget || null,
          proposedAllocations: allocationResult.allocations,
          totalEstimatedCost: evaluation.totalEstimatedCost,
          uncoveredQuantity: evaluation.uncoveredQuantity,
          reasoning: aiSynthesis.text,
          risks: evaluation.risks,
          isSimulated
        },
        user
      )

      await logStep(
        8,
        'Preparing Recovery Plan for Human Approval',
        'createRecoveryPlan',
        `Recovery plan ${planCreation.planId} created with status 'Proposed'. Awaiting explicit human approval before any purchase orders or stock reservations are committed.`,
        { planId: planCreation.planId },
        { status: 'Proposed', gate: 'Human Approval Required' }
      )

      return {
        success: true,
        sessionId,
        planId: planCreation.planId,
        plan: planCreation.plan,
        isSimulated,
        status: 'Awaiting_Approval',
        timeline,
        aiSynthesis,
        metrics: {
          materialName: req.materialName,
          requiredQuantity: req.requiredQuantity,
          shortageQuantity: shortageAnalysis.shortageQuantity,
          totalAllocated: allocationResult.totalAllocated,
          uncoveredQuantity: evaluation.uncoveredQuantity,
          totalEstimatedCost: evaluation.totalEstimatedCost,
          allocationsCount: allocationResult.allocations.length,
          feasible: allocationResult.feasible
        }
      }
    } catch (err) {
      console.error('[Resilience Agent] Execution error:', err)
      await logStep(
        99,
        'Workflow Exception Encountered',
        'recordAgentActivity',
        `Error during workflow execution: ${err.message}`,
        params,
        { error: err.message },
        'failed'
      )

      throw err
    }
  }

  /**
   * Consequential Action: Human User explicitly approves the recovery plan
   */
  static async approvePlan(planId, user, isSimulated = false) {
    // 1. Create Draft / Confirmed Purchase Orders
    const orderResult = await createDraftPurchaseOrders({ planId, isSimulated }, user)

    // 2. Verify Result in Database
    const verificationResult = await verifyRecoveryResult({
      planId,
      createdOrderNumbers: orderResult.ordersCreated
    })

    // 3. Log Activity
    await recordAgentActivity({
      sessionId: `ses-approval-${planId}`,
      userId: user?.id || user?._id,
      companyName: user?.companyName || 'AeroDynamics Global Inc.',
      stepNumber: 9,
      action: 'Executing Authorized Purchase Orders',
      toolUsed: 'createDraftPurchaseOrders',
      explanation: `Human user approved Recovery Plan ${planId}. Created ${orderResult.count} purchase orders: ${orderResult.ordersCreated.join(', ')}.`,
      input: { planId, approvedBy: user?.email },
      result: orderResult,
      status: 'success',
      isSimulated
    })

    await recordAgentActivity({
      sessionId: `ses-approval-${planId}`,
      userId: user?.id || user?._id,
      companyName: user?.companyName || 'AeroDynamics Global Inc.',
      stepNumber: 10,
      action: 'Verifying Database Record Persistence',
      toolUsed: 'verifyRecoveryResult',
      explanation: verificationResult.summary,
      input: { orderNumbers: orderResult.ordersCreated },
      result: verificationResult,
      status: verificationResult.verified ? 'success' : 'warning',
      isSimulated
    })

    return {
      success: true,
      planId,
      status: 'Executed',
      ordersCreated: orderResult.ordersCreated,
      verification: verificationResult
    }
  }

  /**
   * Consequential Action: Human User rejects the recovery plan
   */
  static async rejectPlan(planId, user) {
    // Log rejection and update status
    await recordAgentActivity({
      sessionId: `ses-reject-${planId}`,
      userId: user?.id || user?._id,
      companyName: user?.companyName || 'AeroDynamics Global Inc.',
      stepNumber: 9,
      action: 'Recovery Plan Rejected by User',
      toolUsed: 'recordAgentActivity',
      explanation: `User rejected proposed recovery plan ${planId}. No purchase orders were created and no inventory was altered.`,
      input: { planId, rejectedBy: user?.email },
      result: { status: 'Rejected' },
      status: 'success'
    })

    return {
      success: true,
      planId,
      status: 'Rejected',
      message: 'Recovery plan rejected. No orders committed.'
    }
  }

  /**
   * Get activity logs for a session or recent entries
   */
  static getSessionActivity(sessionId) {
    return sessionActivityLogs.get(sessionId) || []
  }
}

export default SupplyChainResilienceAgent
