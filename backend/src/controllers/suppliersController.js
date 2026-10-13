import { suppliers, certificates } from '../data/mockData.js'

export const getAllSuppliers = (req, res) => {
  const { country, minReliability, search } = req.query
  let result = [...suppliers]

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      s => s.name.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
    )
  }

  if (country) {
    result = result.filter(s => s.country.toLowerCase() === country.toLowerCase())
  }

  if (minReliability) {
    result = result.filter(s => s.reliability >= Number(minReliability))
  }

  res.json({
    success: true,
    total: result.length,
    data: result
  })
}

export const getSupplierById = (req, res) => {
  const id = Number(req.params.id)
  const supplier = suppliers.find(s => s.id === id)

  if (!supplier) {
    return res.status(404).json({
      success: false,
      message: `Supplier with ID ${id} not found`
    })
  }

  const supplierCerts = certificates.filter(c => c.supplierId === id)

  res.json({
    success: true,
    data: {
      ...supplier,
      certificates: supplierCerts
    }
  })
}

export const compareSuppliers = (req, res) => {
  const { ids } = req.query
  if (!ids) {
    return res.status(400).json({
      success: false,
      message: 'Please provide comma-separated supplier IDs: ?ids=1,2,3'
    })
  }

  const idList = ids.split(',').map(Number)
  const matched = suppliers.filter(s => idList.includes(s.id))

  const metrics = [
    { key: 'country', label: 'Country & Location', format: s => `${s.flag} ${s.country} (${s.city})` },
    { key: 'rating', label: 'Supplier Rating', format: s => `${s.rating} / 5.0` },
    { key: 'reliability', label: 'Fulfillment Reliability', format: s => `${s.reliability}%` },
    { key: 'leadTimeHours', label: 'Average Lead Time', format: s => `${s.leadTimeHours} hrs` },
    { key: 'disruptionRisk', label: 'Disruption Risk Index', format: s => s.disruptionRisk },
    { key: 'certifications', label: 'Key Certifications', format: s => s.certifications.join(', ') }
  ]

  res.json({
    success: true,
    comparedCount: matched.length,
    suppliers: matched,
    comparisonMatrix: metrics.map(m => ({
      metric: m.label,
      values: matched.reduce((acc, s) => {
        acc[s.id] = m.format(s)
        return acc
      }, {})
    }))
  })
}

export const updateAllocations = (req, res) => {
  const { allocations } = req.body // array of { supplierId, share }

  if (!Array.isArray(allocations)) {
    return res.status(400).json({
      success: false,
      message: 'Allocations array required: [{ supplierId: 1, share: 50 }, ...]'
    })
  }

  const total = allocations.reduce((sum, a) => sum + Number(a.share || 0), 0)
  if (Math.abs(total - 100) > 1) {
    return res.status(400).json({
      success: false,
      message: `Total allocation must sum to 100% (currently ${total}%)`
    })
  }

  allocations.forEach(a => {
    const s = suppliers.find(item => item.id === Number(a.supplierId))
    if (s) {
      s.allocationShare = Number(a.share)
    }
  })

  res.json({
    success: true,
    message: 'Supplier allocations updated successfully',
    data: suppliers.map(s => ({
      id: s.id,
      name: s.name,
      share: s.allocationShare
    }))
  })
}
