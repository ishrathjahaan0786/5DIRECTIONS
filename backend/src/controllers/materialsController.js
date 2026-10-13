import { materials } from '../data/mockData.js'

export const getAllMaterials = (req, res) => {
  let result = [...materials]
  const { search, category, supplierId, minPrice, maxPrice } = req.query

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      m =>
        m.name.toLowerCase().includes(q) ||
        m.sku.toLowerCase().includes(q) ||
        m.spec.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    )
  }

  if (category) {
    result = result.filter(m => m.category.toLowerCase() === category.toLowerCase())
  }

  if (supplierId) {
    result = result.filter(m => m.supplierId === Number(supplierId))
  }

  if (minPrice) {
    result = result.filter(m => m.unitPrice >= Number(minPrice))
  }

  if (maxPrice) {
    result = result.filter(m => m.unitPrice <= Number(maxPrice))
  }

  res.json({
    success: true,
    total: result.length,
    data: result
  })
}

export const getMaterialById = (req, res) => {
  const id = Number(req.params.id)
  const item = materials.find(m => m.id === id)

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Material with ID ${id} not found`
    })
  }

  res.json({
    success: true,
    data: item
  })
}

export const createMaterial = (req, res) => {
  const {
    name,
    abbr,
    sku,
    category,
    spec,
    form,
    stockQty,
    unit,
    unitPrice,
    leadTime,
    supplierId,
    supplierName,
    certifications
  } = req.body

  if (!name || !sku || !unitPrice) {
    return res.status(400).json({
      success: false,
      message: 'Name, SKU, and unit price are required'
    })
  }

  const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1

  const newMaterial = {
    id: newId,
    abbr: abbr || name.slice(0, 2).toUpperCase(),
    name,
    sku,
    category: category || 'Raw Materials',
    spec: spec || 'Standard Industrial',
    form: form || 'Sheet / Billet',
    stockQty: Number(stockQty) || 0,
    allocatedQty: 0,
    availableQty: Number(stockQty) || 0,
    unit: unit || 'kg',
    unitPrice: Number(unitPrice),
    currency: 'USD',
    leadTime: leadTime || '3-5 days',
    supplierId: supplierId || 1,
    supplierName: supplierName || 'Titan Works GmbH',
    certifications: Array.isArray(certifications) ? certifications : ['ISO 9001'],
    complianceStatus: 'Active'
  }

  materials.push(newMaterial)

  res.status(201).json({
    success: true,
    message: 'Material added successfully',
    data: newMaterial
  })
}

export const updateMaterial = (req, res) => {
  const id = Number(req.params.id)
  const index = materials.findIndex(m => m.id === id)

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Material with ID ${id} not found`
    })
  }

  const existing = materials[index]
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id // protect ID
  }

  // Recalculate available if stockQty changed
  if (req.body.stockQty !== undefined) {
    updated.availableQty = Math.max(0, updated.stockQty - (updated.allocatedQty || 0))
  }

  materials[index] = updated

  res.json({
    success: true,
    message: 'Material updated successfully',
    data: updated
  })
}

export const deleteMaterial = (req, res) => {
  const id = Number(req.params.id)
  const index = materials.findIndex(m => m.id === id)

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Material with ID ${id} not found`
    })
  }

  materials.splice(index, 1)

  res.json({
    success: true,
    message: `Material with ID ${id} removed successfully`
  })
}
