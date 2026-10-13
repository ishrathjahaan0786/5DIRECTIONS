export let users = [
  {
    id: 'usr-comp-01',
    email: 'company@5directions.com',
    password: 'password123',
    fullName: 'Sarah Jenkins',
    companyName: 'AeroDynamics Global Inc.',
    role: 'company',
    country: 'United States',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-supp-01',
    email: 'supplier@5directions.com',
    password: 'password123',
    fullName: 'Hans Becker',
    companyName: 'Titan Works GmbH',
    role: 'supplier',
    country: 'Germany',
    createdAt: new Date().toISOString()
  }
]

export let materials = [
  {
    id: 1,
    abbr: 'Ti',
    name: 'Titanium Ti-6Al-4V Grade 5',
    sku: 'TIT-GR5-408',
    category: 'Metals & Alloys',
    spec: 'ASTM B265 / AMS 4911',
    form: 'Hot-Rolled Billet / Sheet',
    stockQty: 8500,
    allocatedQty: 3200,
    availableQty: 5300,
    unit: 'kg',
    unitPrice: 42.0,
    currency: 'USD',
    leadTime: '48-72 hours',
    supplierId: 1,
    supplierName: 'Titan Works GmbH',
    certifications: ['AS9100D', 'ISO 9001', 'Nadcap'],
    complianceStatus: 'Active'
  },
  {
    id: 2,
    abbr: 'CF',
    name: 'Carbon Fiber Prepreg Toray T800S',
    sku: 'CF-T800-112',
    category: 'Composites',
    spec: 'Toray BMS 8-276 Rev L',
    form: 'Unidirectional Tape 300gsm',
    stockQty: 4200,
    allocatedQty: 1800,
    availableQty: 2400,
    unit: 'sq.m',
    unitPrice: 115.0,
    currency: 'USD',
    leadTime: '3-5 days',
    supplierId: 2,
    supplierName: 'Nippon Composite Tech',
    certifications: ['ISO 9001', 'EN 9100', 'Boeing D1-4426'],
    complianceStatus: 'Active'
  },
  {
    id: 3,
    abbr: 'In',
    name: 'Inconel 718 Nickel Superalloy Bar',
    sku: 'INC-718-921',
    category: 'Superalloys',
    spec: 'AMS 5662 / ASTM B637',
    form: 'Cold-Drawn Round Bar Ø45mm',
    stockQty: 1850,
    allocatedQty: 600,
    availableQty: 1250,
    unit: 'kg',
    unitPrice: 78.5,
    currency: 'USD',
    leadTime: '5-7 days',
    supplierId: 1,
    supplierName: 'Titan Works GmbH',
    certifications: ['AS9100D', 'ISO 9001', 'Nadcap Heat Treat'],
    complianceStatus: 'Active'
  },
  {
    id: 4,
    abbr: 'Al',
    name: 'Aerospace Aluminium 7075-T651 Plate',
    sku: 'AL-7075-303',
    category: 'Metals & Alloys',
    spec: 'AMS 4045 / ASTM B209',
    form: 'Stretched Plate 25mm thickness',
    stockQty: 14200,
    allocatedQty: 4000,
    availableQty: 10200,
    unit: 'kg',
    unitPrice: 16.5,
    currency: 'USD',
    leadTime: '24-48 hours',
    supplierId: 3,
    supplierName: 'AlloyCraft Nordic AB',
    certifications: ['ISO 9001', 'AS9100D', 'Airbus Approved'],
    complianceStatus: 'Active'
  },
  {
    id: 5,
    abbr: 'Cu',
    name: 'Beryllium Copper Alloy 25 (C17200)',
    sku: 'CU-BE25-502',
    category: 'Specialty Copper',
    spec: 'ASTM B194 / SAE J463',
    form: 'Precision Strip 0.5mm',
    stockQty: 3100,
    allocatedQty: 900,
    availableQty: 2200,
    unit: 'kg',
    unitPrice: 54.0,
    currency: 'USD',
    leadTime: '4-6 days',
    supplierId: 3,
    supplierName: 'AlloyCraft Nordic AB',
    certifications: ['ISO 9001'],
    complianceStatus: 'Active'
  }
]

export let suppliers = [
  {
    id: 1,
    name: 'Titan Works GmbH',
    country: 'Germany',
    flag: '🇩🇪',
    city: 'Stuttgart',
    rating: 4.9,
    reliability: 99.2,
    leadTimeHours: 48,
    certifications: ['AS9100D', 'ISO 9001', 'Nadcap'],
    materialsCount: 48,
    disruptionRisk: 'Low',
    verified: true,
    contactEmail: 'orders@titanworks.de',
    allocationShare: 45
  },
  {
    id: 2,
    name: 'Nippon Composite Tech',
    country: 'Japan',
    flag: '🇯🇵',
    city: 'Nagoya',
    rating: 4.8,
    reliability: 98.7,
    leadTimeHours: 72,
    certifications: ['ISO 9001', 'EN 9100', 'Boeing D1-4426'],
    materialsCount: 32,
    disruptionRisk: 'Low',
    verified: true,
    contactEmail: 'global@nipponcomposite.jp',
    allocationShare: 35
  },
  {
    id: 3,
    name: 'AlloyCraft Nordic AB',
    country: 'Sweden',
    flag: '🇸🇪',
    city: 'Gothenburg',
    rating: 4.7,
    reliability: 96.5,
    leadTimeHours: 96,
    certifications: ['ISO 9001', 'AS9100D'],
    materialsCount: 29,
    disruptionRisk: 'Moderate',
    verified: true,
    contactEmail: 'sales@alloycraft.se',
    allocationShare: 20
  }
]

export let orders = [
  {
    id: 'PO-2024-001',
    poNumber: 'PO-2024-001',
    buyer: 'AeroDynamics Global Inc.',
    supplierId: 1,
    supplierName: 'Titan Works GmbH',
    material: 'Titanium Ti-6Al-4V Grade 5',
    qty: 5000,
    unit: 'units',
    value: 210000,
    currency: 'USD',
    status: 'In Transit',
    stage: 3, // 1: Order Placed, 2: QA & Inspection, 3: In Transit, 4: Delivered
    createdAt: '2026-10-01T10:00:00Z',
    estimatedDelivery: '2026-10-18T18:00:00Z',
    trackingNumber: 'DHL-EX-99281048',
    shippingCarrier: 'DHL Global Forwarding Air Express'
  },
  {
    id: 'PO-2024-002',
    poNumber: 'PO-2024-002',
    buyer: 'AeroDynamics Global Inc.',
    supplierId: 2,
    supplierName: 'Nippon Composite Tech',
    material: 'Carbon Fiber Prepreg Toray T800S',
    qty: 2400,
    unit: 'sq.m',
    value: 276000,
    currency: 'USD',
    status: 'Processing & QA',
    stage: 2,
    createdAt: '2026-10-06T14:30:00Z',
    estimatedDelivery: '2026-10-24T12:00:00Z',
    trackingNumber: 'NIP-EXP-40192',
    shippingCarrier: 'Nippon Express Air Freight'
  },
  {
    id: 'PO-2024-003',
    poNumber: 'PO-2024-003',
    buyer: 'AeroDynamics Global Inc.',
    supplierId: 3,
    supplierName: 'AlloyCraft Nordic AB',
    material: 'Aerospace Aluminium 7075-T651 Plate',
    qty: 10000,
    unit: 'kg',
    value: 165000,
    currency: 'USD',
    status: 'Delivered',
    stage: 4,
    createdAt: '2026-09-15T09:15:00Z',
    estimatedDelivery: '2026-09-28T16:00:00Z',
    trackingNumber: 'SCH-TRK-771829',
    shippingCarrier: 'Schenker Logistics'
  }
]

export let disruptions = [
  {
    id: 'DIS-2026-01',
    severity: 'High',
    title: 'Rotterdam Port Congestion & Dock Strike',
    region: 'North-West Europe',
    affectedRoutes: ['Rotterdam to Hamburg', 'Rotterdam to US East Coast'],
    affectedMaterials: ['Inconel 718', 'Titanium Billets'],
    impactDelayDays: 6,
    recommendedAction: 'Reroute shipping via Gothenburg or air-freight allocation shift to Titan Works secondary facility.'
  },
  {
    id: 'DIS-2026-02',
    severity: 'Medium',
    title: 'Raw Resin Feedstock Price Hike in East Asia',
    region: 'East Asia',
    affectedRoutes: ['Tokyo to Long Beach'],
    affectedMaterials: ['Carbon Fiber Prepreg'],
    impactDelayDays: 3,
    recommendedAction: 'Trigger multi-supplier safety buffer allocation (+15% reserve stock).'
  }
]

export let certificates = [
  {
    id: 1,
    supplierId: 1,
    name: 'AS9100D Aerospace Quality Management',
    issuer: 'Bureau Veritas',
    validUntil: '2027-08-30',
    status: 'Valid',
    verificationHash: '0x9fa4b881c0392e'
  },
  {
    id: 2,
    supplierId: 1,
    name: 'Nadcap Heat Treating & NonDestructive Testing',
    issuer: 'PRI Nadcap',
    validUntil: '2027-01-15',
    status: 'Valid',
    verificationHash: '0x3ec8294a8201bf'
  },
  {
    id: 3,
    supplierId: 2,
    name: 'Boeing D1-4426 Composite System Approval',
    issuer: 'Boeing Quality Assurance',
    validUntil: '2026-12-31',
    status: 'Valid',
    verificationHash: '0x7bca0012e88102'
  }
]
