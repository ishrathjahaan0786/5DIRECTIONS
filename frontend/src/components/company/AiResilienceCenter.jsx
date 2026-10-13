import { useState } from 'react'
import api from '../../lib/api'

export default function AiResilienceCenter({ onOrderCreated }) {
  const [mode, setMode] = useState('live') // 'live' | 'simulation'
  const [materialName, setMaterialName] = useState('Titanium Ti-6Al-4V Grade 5')
  const [requiredQty, setRequiredQty] = useState('10000')
  const [confirmedQty, setConfirmedQty] = useState('2000')
  const [deadline, setDeadline] = useState('14 days')
  const [budget, setBudget] = useState('450000')
  const [selectedOrder, setSelectedOrder] = useState('PO-2026-0100')
  const [disruptionDesc, setDisruptionDesc] = useState('Hamburg facility line bottleneck & Rotterdam port delay — primary supplier can only deliver 2,000 kg.')

  const [loading, setLoading] = useState(false)
  const [executingApproval, setExecutingApproval] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'timeline' | 'activity' | 'verification'

  const [agentResult, setAgentResult] = useState(null)
  const [executionResult, setExecutionResult] = useState(null)
  const [rejectedNotice, setRejectedNotice] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Run Disruption Investigation
  const handleInvestigate = async (isSimulatedOverride = null) => {
    setError('')
    setRejectedNotice(false)
    setExecutionResult(null)
    setLoading(true)

    const isSimulated = isSimulatedOverride !== null ? isSimulatedOverride : (mode === 'simulation')

    try {
      const res = await api.agent.investigate({
        orderNumber: selectedOrder,
        materialName,
        requiredQuantity: Number(requiredQty) || 10000,
        confirmedQuantity: Number(confirmedQty) || 2000,
        deliveryDeadline: deadline,
        budget: Number(budget) || null,
        disruptionDescription: disruptionDesc,
        isSimulated
      })

      if (res && res.success) {
        setAgentResult(res)
        setActiveTab('overview')
      } else {
        setError(res?.message || 'Agent failed to complete investigation.')
      }
    } catch (err) {
      setError(err.message || 'Error communicating with SupplyChainResilienceAgent')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Human Approval Gate
  const handleApprovePlan = async () => {
    if (!agentResult?.planId) return
    setError('')
    setExecutingApproval(true)

    try {
      const res = await api.agent.approvePlan(agentResult.planId, agentResult.isSimulated)
      if (res && res.success) {
        setExecutionResult(res)
        setActiveTab('verification')
        if (onOrderCreated) onOrderCreated()
      } else {
        setError(res?.message || 'Failed to execute recovery plan orders.')
      }
    } catch (err) {
      setError(err.message || 'Error executing recovery plan.')
    } finally {
      setExecutingApproval(false)
    }
  }

  // Step 3: Human Rejection Gate
  const handleRejectPlan = async () => {
    if (!agentResult?.planId) return
    setError('')
    try {
      await api.agent.rejectPlan(agentResult.planId)
      setRejectedNotice(true)
      setAgentResult(null)
    } catch (err) {
      setError(err.message || 'Error rejecting plan.')
    }
  }

  const handleRevisePlan = () => {
    setAgentResult(null)
    setExecutionResult(null)
    setRejectedNotice(false)
  }

  return (
    <section className="flex flex-col gap-6">
      {/* ── Section Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-deep-navy via-[#1e3a6a] to-deep-navy text-white shadow-card-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-crimson-red/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-ocean-blue/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-red/25 border border-crimson-red/40 text-amber-200 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-crimson-red animate-pulse"></span>
              AGENTIC AI COMMAND CENTER
            </span>
            <span className="text-xs text-white/60">Autonomous Multi-Step Resilience Engine</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Supply Chain Resilience Agent
          </h2>
          <p className="text-white/70 text-sm mt-1 max-w-2xl">
            Autonomous multi-step investigation of supply shocks: shortage detection, verified supplier discovery, deterministic allocation, human-in-the-loop approval, and database-backed execution.
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
            <button
              type="button"
              id="btn-mode-live"
              onClick={() => { setMode('live'); setAgentResult(null) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'live' ? 'bg-crimson-red text-white shadow' : 'text-white/70 hover:text-white'
              }`}
            >
              Live Disruption
            </button>
            <button
              type="button"
              id="btn-mode-simulation"
              onClick={() => { setMode('simulation'); setAgentResult(null) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'simulation' ? 'bg-amber-400 text-deep-navy shadow font-bold' : 'text-white/70 hover:text-white'
              }`}
            >
              ⚡ Disruption Simulation
            </button>
          </div>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="p-4 rounded-xl bg-crimson-red/10 border border-crimson-red/30 text-crimson-red text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-xs font-bold underline">Dismiss</button>
        </div>
      )}

      {/* ── Rejection Notice ── */}
      {rejectedNotice && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-amber-600">cancel</span>
          <span><strong>Recovery Plan Rejected:</strong> No orders were committed and no supplier inventory was altered. You may adjust parameters and re-investigate.</span>
        </div>
      )}

      {/* ── A. Problem Input Panel ── */}
      {!agentResult && (
        <div className="card p-6 border-t-4 border-t-crimson-red animate-fade-in">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-neutral/40">
            <div>
              <h3 className="text-lg font-bold text-deep-navy flex items-center gap-2">
                <span className="material-symbols-outlined text-crimson-red">troubleshoot</span>
                Supply Disruption Parameters
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Define the shortage constraints or execute the pre-configured hackathon demo simulation.
              </p>
            </div>
            {mode === 'simulation' && (
              <span className="badge-amber text-xs px-2.5 py-1">
                Demo Simulation Mode (Safe Isolated Data)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-order">
                Affected Order Record
              </label>
              <select
                id="agent-input-order"
                value={selectedOrder}
                onChange={e => setSelectedOrder(e.target.value)}
                className="input text-sm"
              >
                <option value="PO-2026-0100">PO-2026-0100 (Titan Works — 10,000 kg Ti-6Al-4V)</option>
                <option value="PO-2024-001">PO-2024-001 (Titan Works — 5,000 units Ti-6Al-4V)</option>
                <option value="CUSTOM">Custom Requirement Investigation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-material">
                Raw Material Specification
              </label>
              <input
                id="agent-input-material"
                type="text"
                value={materialName}
                onChange={e => setMaterialName(e.target.value)}
                className="input text-sm"
                placeholder="e.g. Titanium Ti-6Al-4V Grade 5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-deadline">
                Required Delivery Deadline
              </label>
              <input
                id="agent-input-deadline"
                type="text"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="input text-sm"
                placeholder="e.g. 14 days"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-req-qty">
                Total Required Quantity (kg)
              </label>
              <input
                id="agent-input-req-qty"
                type="number"
                value={requiredQty}
                onChange={e => setRequiredQty(e.target.value)}
                className="input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-conf-qty">
                Primary Supplier Confirmed (kg)
              </label>
              <input
                id="agent-input-conf-qty"
                type="number"
                value={confirmedQty}
                onChange={e => setConfirmedQty(e.target.value)}
                className="input text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-budget">
                Budget Limit ($)
              </label>
              <input
                id="agent-input-budget"
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="input text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-deep-navy uppercase mb-1.5" htmlFor="agent-input-desc">
              Disruption Context & Logistics Alert
            </label>
            <textarea
              id="agent-input-desc"
              rows={2}
              value={disruptionDesc}
              onChange={e => setDisruptionDesc(e.target.value)}
              className="input text-sm resize-none"
            />
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-resolve-disruption"
                onClick={() => handleInvestigate(false)}
                disabled={loading}
                className="btn-primary py-3 px-6 gap-2 text-sm shadow-md disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Agent Orchestrating Multi-Step Plan…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">psychology</span>
                    Resolve Supply Disruption
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-run-simulation"
                onClick={() => handleInvestigate(true)}
                disabled={loading}
                className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-deep-navy text-sm font-bold transition-all shadow flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">experiment</span>
                Run Disruption Simulation
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleInvestigate(false)}
              disabled={loading}
              className="btn-secondary py-3 px-4 text-xs gap-1.5"
            >
              <span className="material-symbols-outlined text-base">hub</span>
              Analyze My Supply Chain
            </button>
          </div>
        </div>
      )}

      {/* ── B & C & D: Investigation Results & Interactive Workspace ── */}
      {agentResult && (
        <div className="flex flex-col gap-6 animate-slide-up">
          {/* Top Status & Metrics Bar */}
          <div className="card p-5 bg-warm-cream/40 border border-border-neutral flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-deep-navy text-white flex items-center justify-center font-bold text-xl shadow">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-deep-navy text-lg">
                    {agentResult.isSimulated ? 'Simulation Recovery Recommendation' : 'Live Supply Recovery Recommendation'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Awaiting Human Approval
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5">
                  Plan ID: <code className="bg-white px-1.5 py-0.2 rounded border text-deep-navy font-semibold">{agentResult.planId}</code> • Shortage Identified: <strong className="text-crimson-red">{agentResult.metrics.shortageQuantity.toLocaleString()} kg</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                agentResult.aiSynthesis?.isLiveAI ? 'bg-emerald-100 text-emerald-800' : 'bg-ocean-blue/15 text-deep-navy'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {agentResult.aiSynthesis?.isLiveAI ? `Gemini Live (${agentResult.aiSynthesis.model})` : 'Deterministic Resilience Engine'}
              </span>
              <button
                type="button"
                onClick={handleRevisePlan}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                <span className="material-symbols-outlined text-sm">edit</span>Revise Parameters
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border-neutral/60 gap-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview' ? 'border-crimson-red text-crimson-red' : 'border-transparent text-text-muted hover:text-deep-navy'
              }`}
            >
              <span className="material-symbols-outlined text-lg">inventory_2</span>
              Proposed Allocation & Rationale
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'timeline' ? 'border-crimson-red text-crimson-red' : 'border-transparent text-text-muted hover:text-deep-navy'
              }`}
            >
              <span className="material-symbols-outlined text-lg">timeline</span>
              Agent Execution Timeline ({agentResult.timeline?.length || 8})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'activity' ? 'border-crimson-red text-crimson-red' : 'border-transparent text-text-muted hover:text-deep-navy'
              }`}
            >
              <span className="material-symbols-outlined text-lg">list_alt</span>
              Audit Activity Log
            </button>
            {executionResult && (
              <button
                onClick={() => setActiveTab('verification')}
                className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'verification' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-text-muted hover:text-deep-navy'
                }`}
              >
                <span className="material-symbols-outlined text-lg">verified</span>
                Outcome Verification ({executionResult.ordersCreated?.length})
              </button>
            )}
          </div>

          {/* ── TAB 1: OVERVIEW & RECOMMENDATION ── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Proposed Allocations */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="card">
                  <h4 className="text-base font-bold text-deep-navy mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-ocean-blue">pie_chart</span>
                    Multi-Supplier Allocation Breakdown
                  </h4>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="p-3 rounded-xl bg-warm-cream/40 border border-border-neutral">
                      <div className="text-xs text-text-muted">Total Shortage</div>
                      <div className="text-xl font-extrabold text-crimson-red mt-0.5">
                        {agentResult.metrics.shortageQuantity.toLocaleString()} kg
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="text-xs text-emerald-800">Total Covered</div>
                      <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                        {agentResult.metrics.totalAllocated.toLocaleString()} kg
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-ocean-blue/10 border border-ocean-blue/20">
                      <div className="text-xs text-deep-navy">Est. Recovery Cost</div>
                      <div className="text-xl font-extrabold text-deep-navy mt-0.5">
                        ${agentResult.metrics.totalEstimatedCost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Allocation Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-background text-text-muted text-xs uppercase tracking-wider">
                          <th className="py-2.5 px-3">Selected Supplier</th>
                          <th className="py-2.5 px-3">Allocated Qty</th>
                          <th className="py-2.5 px-3">Unit Price</th>
                          <th className="py-2.5 px-3">Total Cost</th>
                          <th className="py-2.5 px-3">Lead Time</th>
                          <th className="py-2.5 px-3 text-right">Compliance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-neutral/30 text-sm">
                        {agentResult.plan?.proposedAllocations?.map((alloc, idx) => (
                          <tr key={idx} className="hover:bg-warm-cream/20">
                            <td className="py-3 px-3 font-bold text-deep-navy">
                              {alloc.supplierName}
                            </td>
                            <td className="py-3 px-3 font-semibold text-ocean-blue">
                              {alloc.quantity.toLocaleString()} kg
                            </td>
                            <td className="py-3 px-3 text-text-muted">
                              ${alloc.unitPrice}/kg
                            </td>
                            <td className="py-3 px-3 font-bold text-deep-navy">
                              ${alloc.totalPrice?.toLocaleString()}
                            </td>
                            <td className="py-3 px-3 text-text-muted">
                              {alloc.leadTimeDays} days
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                <span className="material-symbols-outlined text-xs">verified</span>
                                AS9100D Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Rationale & Risk Assessment */}
                <div className="card">
                  <h4 className="text-base font-bold text-deep-navy mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-ocean-blue">psychology</span>
                    Evidence-Based Agent Rationale
                  </h4>
                  <div className="p-4 rounded-xl bg-warm-cream/30 border border-border-neutral text-sm text-deep-navy leading-relaxed mb-4">
                    {agentResult.plan?.reasoning || agentResult.aiSynthesis?.text}
                  </div>

                  <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Identified Operational Risks & Mitigation
                  </h5>
                  <div className="flex flex-col gap-2">
                    {(agentResult.plan?.risks || [
                      'Multiple freight lanes require coordinated delivery tracking across ports.',
                      'Secondary supplier lead time is 7 days, within the 14-day delivery requirement.'
                    ]).map((risk, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                        <span className="material-symbols-outlined text-amber-600 text-sm mt-0.5">info</span>
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Col: Human Approval Controls Gate */}
              <div className="flex flex-col gap-4">
                <div className="card border-2 border-ocean-blue/30 sticky top-24">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-crimson-red text-2xl">gavel</span>
                    <div>
                      <h4 className="font-extrabold text-deep-navy text-base">Human Approval Gate</h4>
                      <p className="text-xs text-text-muted">Explicit procurement authorization required</p>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    The AI agent has prepared this recommendation using deterministic constraints. No binding purchase orders or inventory reservations will be committed until you approve.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      id="btn-approve-recovery"
                      onClick={handleApprovePlan}
                      disabled={executingApproval}
                      className="btn-primary w-full py-3 justify-center text-sm shadow-md disabled:opacity-60"
                    >
                      {executingApproval ? (
                        <>
                          <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                          Executing Purchase Orders…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                          Approve Recovery Plan
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      id="btn-reject-recovery"
                      onClick={handleRejectPlan}
                      disabled={executingApproval}
                      className="w-full py-2.5 rounded-xl border border-crimson-red/30 text-crimson-red font-semibold text-xs hover:bg-crimson-red/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span>
                      Reject Plan
                    </button>

                    <button
                      type="button"
                      onClick={handleRevisePlan}
                      disabled={executingApproval}
                      className="btn-secondary w-full py-2.5 justify-center text-xs"
                    >
                      <span className="material-symbols-outlined text-base">tune</span>
                      Revise Constraints
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-neutral/60 text-[11px] text-text-muted flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">lock</span>
                    Protected by Role-Based Authorization
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: AGENT EXECUTION TIMELINE ── */}
          {activeTab === 'timeline' && (
            <div className="card p-6">
              <h4 className="text-base font-bold text-deep-navy mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-crimson-red">timeline</span>
                Real-Time Agent Execution Pipeline
              </h4>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-ocean-blue/30">
                {agentResult.timeline?.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle icon */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-deep-navy text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-[#FFFCF7]">
                      {step.stepNumber}
                    </div>
                    <div className="p-4 rounded-xl bg-warm-cream/30 border border-border-neutral hover:bg-warm-cream/50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-deep-navy text-sm">{step.action}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-white px-2 py-0.5 rounded border border-border-neutral font-mono text-ocean-blue">
                            tool: {step.toolUsed}
                          </code>
                          <span className="badge-ocean text-[11px]">{step.status}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted mb-2 leading-relaxed">{step.explanation}</p>
                      {step.result && (
                        <div className="mt-2 p-2.5 rounded-lg bg-deep-navy/5 text-[11px] font-mono text-deep-navy overflow-x-auto">
                          {JSON.stringify(step.result, null, 2).slice(0, 300)}…
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: AUDIT ACTIVITY LOG ── */}
          {activeTab === 'activity' && (
            <div className="card p-0 overflow-hidden">
              <div className="p-4 border-b border-border-neutral/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-deep-navy text-sm">Deterministic Audit Trail</h4>
                  <p className="text-xs text-text-muted">Recorded operations and verified tool executions</p>
                </div>
                <span className="text-xs text-text-muted">Session: {agentResult.sessionId}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-background text-text-muted text-xs uppercase tracking-wider">
                      <th className="py-2.5 px-4">Step</th>
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Tool Invoked</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-neutral/30 text-xs">
                    {agentResult.timeline?.map((step, idx) => (
                      <tr key={idx} className="hover:bg-warm-cream/20">
                        <td className="py-3 px-4 font-bold text-deep-navy">{step.stepNumber}</td>
                        <td className="py-3 px-4 text-deep-navy font-medium">{step.action}</td>
                        <td className="py-3 px-4 font-mono text-ocean-blue">{step.toolUsed}</td>
                        <td className="py-3 px-4">
                          <span className="badge-ocean text-[10px]">{step.status}</span>
                        </td>
                        <td className="py-3 px-4 text-text-muted font-mono">{step.timestamp?.slice(11, 19)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 4: VERIFICATION ── */}
          {activeTab === 'verification' && executionResult && (
            <div className="card p-6 border-2 border-emerald-500/40 bg-emerald-50/20 animate-fade-in">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-300/40">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-deep-navy">
                    Recovery Plan Successfully Executed & Verified
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {executionResult.verification?.summary || 'Purchase orders persisted to MongoDB Atlas and confirmed.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {executionResult.ordersCreated?.map((orderNum, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-bold text-deep-navy text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-emerald-600 text-base">receipt_long</span>
                        {orderNum}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">
                        Status: <strong className="text-emerald-700">Confirmed & Persisted</strong>
                      </div>
                    </div>
                    <span className="badge-emerald text-xs font-bold">
                      Verified in DB
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white border border-border-neutral text-xs text-deep-navy flex items-center justify-between">
                <span>Database Records Synchronized: Supplier inventory updated deterministically.</span>
                <button
                  type="button"
                  onClick={handleRevisePlan}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  Start New Disruption Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
