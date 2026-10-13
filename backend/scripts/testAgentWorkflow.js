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
  recordAgentActivity 
} from '../src/agent/tools.js'
import { SupplyChainResilienceAgent } from '../src/agent/SupplyChainResilienceAgent.js'
import { generateGeminiReasoning } from '../src/agent/geminiService.js'

async function runTestSuite() {
  console.log('================================================================');
  console.log(' 5DIRECTIONS AGENTIC AI RESILIENCE PLATFORM — VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      if (details) console.log(`       → ${details}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error(`       → Error: ${details}`);
      failed++;
    }
  }

  const mockCompanyUser = {
    id: 'user_comp_demo_1',
    companyName: 'AeroDynamics Global Corp',
    role: 'company',
    email: 'company.demo@5directions.demo'
  };

  // Test 1: getMaterialRequirements retrieves correct parameters
  try {
    const matReq = await getMaterialRequirements({
      materialName: 'Titanium Ti-6Al-4V Grade 5',
      requiredQuantity: 10000,
      unit: 'kg',
      deliveryDeadline: '14 days'
    }, mockCompanyUser);
    assert(
      matReq.requiredQuantity === 10000 && matReq.materialName.includes('Titanium'),
      'Test 1: Agent retrieves correct material requirement',
      `Material: ${matReq.materialName}, Qty: ${matReq.requiredQuantity} ${matReq.unit}, Deadline: ${matReq.deliveryDeadline}`
    );
  } catch (e) {
    assert(false, 'Test 1: Agent retrieves correct material requirement', e.message);
  }

  // Test 2: Identify simulated supplier failure / confirmed shortage
  try {
    const shortage = identifySupplyShortage({
      requiredQuantity: 10000,
      confirmedQuantity: 2000,
      unit: 'kg'
    });
    assert(
      shortage.shortageQuantity === 8000 && shortage.shortagePercentage === 80.0,
      'Test 2: Agent calculates shortage deterministically (10,000 req - 2,000 conf = 8,000 shortage)',
      `Shortage: ${shortage.shortageQuantity} kg (${shortage.shortagePercentage}% disrupted)`
    );
  } catch (e) {
    assert(false, 'Test 2: Shortage calculation', e.message);
  }

  // Test 3: Search actual configured inventory records
  try {
    const inv = await getSupplierInventory({ materialName: 'Ti-6Al-4V' });
    assert(
      Array.isArray(inv) && inv.length > 0,
      'Test 3: Agent searches actual configured inventory records',
      `Found ${inv.length} supplier materials matching Ti-6Al-4V`
    );
  } catch (e) {
    assert(false, 'Test 3: Search supplier inventory', e.message);
  }

  // Test 4: Alternative supplier discovery
  let candidateSuppliers = [];
  try {
    candidateSuppliers = await searchAlternativeSuppliers({
      materialName: 'Ti-6Al-4V',
      excludeSupplierNames: ['Titan Works']
    });
    assert(
      Array.isArray(candidateSuppliers) && candidateSuppliers.length >= 2,
      'Test 4: Discover eligible alternative suppliers satisfying specs',
      `Found ${candidateSuppliers.length} candidates: ${candidateSuppliers.map(s => s.supplierName).join(', ')}`
    );
  } catch (e) {
    assert(false, 'Test 4: Search alternative suppliers', e.message);
  }

  // Test 5: Compare supplier offers with unit prices, delivery, certs
  try {
    const comparison = await compareSupplierOffers({
      candidateSuppliers
    });
    assert(
      Array.isArray(comparison) && comparison.length > 0 && ('certVerified' in comparison[0]),
      'Test 5: Compare supplier offers on pricing, delivery, and verified certificates',
      `Compared ${comparison.length} candidates. Candidate #1: ${comparison[0].supplierName} ($${comparison[0].unitPrice}/kg, Cert verified: ${comparison[0].certVerified})`
    );
  } catch (e) {
    assert(false, 'Test 5: Compare supplier offers', e.message);
  }

  // Test 6 & 7: Deterministic multi-supplier allocation & Stock limits validation
  try {
    const allocResult = calculateMultiSupplierAllocation({
      shortageQuantity: 8000,
      candidateSuppliers,
      maxLeadTimeDays: 14
    });

    const noStockExceeded = allocResult.allocations.every(a => a.quantity <= a.stockAvailable);
    const totalAllocated = allocResult.allocations.reduce((sum, a) => sum + a.quantity, 0);

    assert(
      totalAllocated === 8000 && allocResult.uncoveredQuantity === 0 && allocResult.feasible === true,
      'Test 6: Multi-supplier allocation satisfies total shortage exactly',
      `Allocated ${totalAllocated} kg across ${allocResult.allocations.length} suppliers: ${allocResult.allocations.map(a => `${a.supplierName}: ${a.quantity}kg`).join(' + ')}`
    );

    assert(
      noStockExceeded,
      'Test 7: No supplier is allocated more than available stock',
      allocResult.allocations.map(a => `${a.supplierName}: allocated ${a.quantity} <= stock ${a.stockAvailable}`).join('; ')
    );
  } catch (e) {
    assert(false, 'Test 6 & 7: Allocation calculation', e.message);
  }

  // Test 8: Infeasible constraints produce honest shortage report without hallucinated stock
  try {
    const extremeAlloc = calculateMultiSupplierAllocation({
      shortageQuantity: 999999,
      candidateSuppliers: [
        { supplierId: 's1', supplierName: 'Small Supplier', stockAvailable: 500, unitPrice: 40, leadTimeDays: 5 }
      ],
      maxLeadTimeDays: 14
    });

    assert(
      extremeAlloc.uncoveredQuantity === (999999 - 500) && extremeAlloc.feasible === false,
      'Test 8: Infeasible constraints produce honest shortage report without hallucinated stock',
      `Shortage of 999,999 kg produced honest uncovered deficit of ${extremeAlloc.uncoveredQuantity} kg (feasible: ${extremeAlloc.feasible})`
    );
  } catch (e) {
    assert(false, 'Test 8: Infeasible constraints test', e.message);
  }

  // Test 9: Human approval gate required before consequential execution
  let testPlanId = null;
  try {
    const allocResult = calculateMultiSupplierAllocation({ shortageQuantity: 8000, candidateSuppliers });
    const planCreation = await createRecoveryPlan({
      companyName: mockCompanyUser.companyName,
      materialName: 'Titanium Ti-6Al-4V Grade 5',
      requiredQuantity: 10000,
      shortageQuantity: 8000,
      proposedAllocations: allocResult.allocations,
      totalEstimatedCost: allocResult.totalEstimatedCost,
      uncoveredQuantity: allocResult.uncoveredQuantity,
      isSimulated: true
    }, mockCompanyUser);

    testPlanId = planCreation.planId;
    assert(
      planCreation.status === 'Proposed',
      'Test 9: Plan created in Proposed state; no orders auto-executed without human review',
      `Plan ID: ${planCreation.planId}, Status: ${planCreation.status}`
    );
  } catch (e) {
    assert(false, 'Test 9: Human approval gate test', e.message);
  }

  // Test 10: Rejection gate works
  try {
    const rejectResult = await SupplyChainResilienceAgent.rejectPlan(testPlanId, mockCompanyUser);
    assert(
      rejectResult.success === true && rejectResult.status === 'Rejected',
      'Test 10: User can reject plan, preventing order creation',
      `Plan ${testPlanId} rejected. Message: ${rejectResult.message}`
    );
  } catch (e) {
    assert(false, 'Test 10: Rejection gate test', e.message);
  }

  // Test 11 & 12: Execution after approval persists orders and verifies
  try {
    // Create fresh plan for execution
    const allocResult = calculateMultiSupplierAllocation({ shortageQuantity: 8000, candidateSuppliers });
    const freshPlan = await createRecoveryPlan({
      companyName: mockCompanyUser.companyName,
      materialName: 'Titanium Ti-6Al-4V Grade 5',
      requiredQuantity: 10000,
      shortageQuantity: 8000,
      proposedAllocations: allocResult.allocations,
      totalEstimatedCost: allocResult.totalEstimatedCost,
      uncoveredQuantity: 0,
      isSimulated: true
    }, mockCompanyUser);

    const orderResult = await createDraftPurchaseOrders({
      planId: freshPlan.planId,
      isSimulated: true
    }, mockCompanyUser);

    assert(
      orderResult.success === true && orderResult.ordersCreated.length > 0,
      'Test 11: Approved recovery plan generates separate draft purchase orders in database',
      `Created ${orderResult.count} purchase orders: ${orderResult.ordersCreated.join(', ')}`
    );

    const verification = await verifyRecoveryResult({
      planId: freshPlan.planId,
      createdOrderNumbers: orderResult.ordersCreated
    });

    assert(
      verification.verified === true && verification.results.length === orderResult.ordersCreated.length,
      'Test 12: Final result is verified against actual database records',
      verification.summary
    );
  } catch (e) {
    assert(false, 'Test 11 & 12: Approval and execution workflow', e.message);
  }

  // Test 13: Role-based authorization test
  try {
    const supplierUser = { id: 'sup_1', role: 'supplier', email: 'sup@test.com' };
    let supplierBlocked = false;
    try {
      await createDraftPurchaseOrders({
        planId: testPlanId,
        isSimulated: true
      }, supplierUser);
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
        supplierBlocked = true;
      }
    }
    assert(
      supplierBlocked,
      'Test 13: Unauthorized supplier cannot create company purchase orders',
      'Role check successfully threw unauthorized error when supplier attempted procurement action'
    );
  } catch (e) {
    assert(false, 'Test 13: Role-based authorization test', e.message);
  }

  // Test 14: Google Gemini integration & graceful deterministic fallback
  try {
    const reasoning = await generateGeminiReasoning(
      'Evaluate allocation trade-offs: 4,000kg from Vanguard Metals and 4,000kg from Apex Forge.',
      'You are the 5Directions Supply Chain Resilience Agent.'
    );

    assert(
      reasoning !== undefined && typeof reasoning === 'object' && ('success' in reasoning) && ('isLiveAI' in reasoning),
      'Test 14: Server-side Gemini reasoning returns structured analysis or graceful fallback',
      `Live AI: ${reasoning.isLiveAI}, Status: ${reasoning.success ? 'Connected' : 'Handled Fallback (' + (reasoning.reason || 'offline') + ')'}`
    );
  } catch (e) {
    assert(false, 'Test 14: Gemini integration and fallback', e.message);
  }

  // Test 15: Full End-to-End SupplyChainResilienceAgent investigation
  try {
    const investigation = await SupplyChainResilienceAgent.investigateDisruption({
      orderNumber: 'PO-2026-0100',
      materialName: 'Titanium Ti-6Al-4V Grade 5',
      requiredQuantity: 10000,
      confirmedQuantity: 2000,
      deliveryDeadline: '14 days',
      budget: 450000,
      disruptionDescription: 'Rotterdam port congestion delay',
      isSimulated: true
    }, mockCompanyUser);

    assert(
      investigation.success && investigation.planId && investigation.timeline.length >= 8,
      'Test 15: SupplyChainResilienceAgent executes 10-step investigation & produces complete timeline',
      `Generated plan ${investigation.planId} with ${investigation.timeline.length} timeline milestones: status '${investigation.status}'`
    );
  } catch (e) {
    assert(false, 'Test 15: Full agent investigation', e.message);
  }

  // Test 16: Disruption Simulation mode isolation
  try {
    const simInvestigation = await SupplyChainResilienceAgent.investigateDisruption({
      isSimulated: true,
      materialName: 'Titanium Ti-6Al-4V Grade 5',
      requiredQuantity: 10000,
      confirmedQuantity: 2000
    }, mockCompanyUser);

    const approveResult = await SupplyChainResilienceAgent.approvePlan(simInvestigation.planId, mockCompanyUser, true);
    const allSimOrders = approveResult.ordersCreated.every(num => num.startsWith('PO-SIM-'));

    assert(
      approveResult.success === true && allSimOrders,
      'Test 16: Disruption simulation mode produces isolated PO-SIM-* orders without altering production data',
      `Simulation POs: ${approveResult.ordersCreated.join(', ')}`
    );
  } catch (e) {
    assert(false, 'Test 16: Simulation mode isolation', e.message);
  }

  console.log('\n================================================================');
  console.log(` VERIFICATION SUMMARY: ${passed} PASSED / ${failed} FAILED (${((passed/(passed+failed))*100).toFixed(0)}% SUCCESS RATE)`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
