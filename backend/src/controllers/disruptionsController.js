import { disruptions, suppliers, orders, materials } from '../data/mockData.js'

export const getAllDisruptions = (req, res) => {
  res.json({
    success: true,
    total: disruptions.length,
    data: disruptions
  })
}

export const createDisruptionAlert = (req, res) => {
  const { severity, title, region, affectedRoutes, affectedMaterials, impactDelayDays, recommendedAction } = req.body

  if (!title || !severity) {
    return res.status(400).json({
      success: false,
      message: 'Title and severity are required'
    })
  }

  const newAlert = {
    id: `DIS-2026-${String(disruptions.length + 1).padStart(2, '0')}`,
    severity: severity || 'Medium',
    title,
    region: region || 'Global',
    affectedRoutes: affectedRoutes || [],
    affectedMaterials: affectedMaterials || [],
    impactDelayDays: Number(impactDelayDays) || 3,
    recommendedAction: recommendedAction || 'Review buffer stocks and reroute shipments'
  }

  disruptions.unshift(newAlert)

  res.status(201).json({
    success: true,
    message: 'Disruption alert registered',
    data: newAlert
  })
}

export const getRiskOverview = (req, res) => {
  const activeDisruptions = disruptions.length
  const totalSuppliers = suppliers.length
  const avgReliability = (
    suppliers.reduce((acc, s) => acc + s.reliability, 0) / (totalSuppliers || 1)
  ).toFixed(1)

  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length
  const totalSpend = orders.reduce((acc, o) => acc + (o.value || 0), 0)

  res.json({
    success: true,
    data: {
      riskIndex: 'Low-to-Moderate (84/100 Resilient)',
      activeDisruptions,
      totalSuppliers,
      avgReliability: `${avgReliability}%`,
      activeOrdersCount,
      totalSpendFormatted: `$${totalSpend.toLocaleString()}`,
      networkStatus: 'Operational - 2 alternate routes active'
    }
  })
}
