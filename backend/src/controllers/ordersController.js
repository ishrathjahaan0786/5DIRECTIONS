import { orders, materials } from '../data/mockData.js'

export const getAllOrders = (req, res) => {
  let result = [...orders]
  const { status, supplierId, buyer, stage } = req.query

  if (status) {
    result = result.filter(o => o.status.toLowerCase() === status.toLowerCase())
  }

  if (supplierId) {
    result = result.filter(o => o.supplierId === Number(supplierId))
  }

  if (buyer) {
    result = result.filter(o => o.buyer.toLowerCase().includes(buyer.toLowerCase()))
  }

  if (stage) {
    result = result.filter(o => o.stage === Number(stage))
  }

  res.json({
    success: true,
    total: result.length,
    data: result
  })
}

export const getOrderById = (req, res) => {
  const { id } = req.params
  const order = orders.find(o => o.id === id || o.poNumber === id)

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order ${id} not found`
    })
  }

  res.json({
    success: true,
    data: order
  })
}

export const createOrder = (req, res) => {
  const { buyer, supplierId, supplierName, material, qty, unit, unitPrice } = req.body

  if (!material || !qty || !supplierId) {
    return res.status(400).json({
      success: false,
      message: 'material, qty, and supplierId are required'
    })
  }

  const orderNum = `PO-2024-${String(orders.length + 1).padStart(3, '0')}`
  const totalVal = (Number(qty) * Number(unitPrice || 42)).toFixed(2)

  const newOrder = {
    id: orderNum,
    poNumber: orderNum,
    buyer: buyer || 'AeroDynamics Global Inc.',
    supplierId: Number(supplierId),
    supplierName: supplierName || 'Titan Works GmbH',
    material,
    qty: Number(qty),
    unit: unit || 'units',
    value: Number(totalVal),
    currency: 'USD',
    status: 'Order Placed',
    stage: 1, // 1: Order Placed, 2: QA & Inspection, 3: In Transit, 4: Delivered
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 14 * 86400000).toISOString(),
    trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    shippingCarrier: 'Global Freight Express'
  }

  orders.unshift(newOrder)

  res.status(201).json({
    success: true,
    message: 'Purchase Order created successfully',
    data: newOrder
  })
}

export const updateOrderStatus = (req, res) => {
  const { id } = req.params
  const { stage, status, trackingNumber, shippingCarrier } = req.body

  const order = orders.find(o => o.id === id || o.poNumber === id)
  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order ${id} not found`
    })
  }

  const STAGE_LABELS = {
    1: 'Order Placed',
    2: 'Processing & QA',
    3: 'In Transit',
    4: 'Delivered'
  }

  if (stage !== undefined) {
    order.stage = Number(stage)
    order.status = STAGE_LABELS[order.stage] || order.status
  }

  if (status) order.status = status
  if (trackingNumber) order.trackingNumber = trackingNumber
  if (shippingCarrier) order.shippingCarrier = shippingCarrier

  res.json({
    success: true,
    message: 'Order status updated',
    data: order
  })
}

export const respondToOrder = (req, res) => {
  const { id } = req.params
  const { action, notes } = req.body // 'accept', 'decline', 'counter'

  const order = orders.find(o => o.id === id || o.poNumber === id)
  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order ${id} not found`
    })
  }

  if (action === 'accept') {
    order.status = 'Processing & QA'
    order.stage = 2
    order.supplierAcceptedAt = new Date().toISOString()
  } else if (action === 'decline') {
    order.status = 'Declined by Supplier'
    order.declineReason = notes || 'Capacity constraint'
  } else if (action === 'counter') {
    order.status = 'Counter-Offer Pending'
    order.counterNotes = notes || 'Revised delivery date proposed'
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be accept, decline, or counter'
    })
  }

  res.json({
    success: true,
    message: `Order ${action}ed successfully`,
    data: order
  })
}
