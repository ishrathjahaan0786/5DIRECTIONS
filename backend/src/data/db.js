import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_FILE = path.join(__dirname, 'database.json')

const INITIAL_DATA = {
  users: [
    {
      id: 'usr-comp-01',
      email: 'company@5directions.com',
      passwordHash: bcrypt.hashSync('password123', 8),
      fullName: 'Sarah Jenkins',
      companyName: 'AeroDynamics Global Inc.',
      role: 'company',
      country: 'United States',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-supp-01',
      email: 'supplier@5directions.com',
      passwordHash: bcrypt.hashSync('password123', 8),
      fullName: 'Hans Becker',
      companyName: 'Titan Works GmbH',
      role: 'supplier',
      country: 'Germany',
      createdAt: new Date().toISOString()
    }
  ],
  materials: [
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
    }
  ],
  suppliers: [
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
  ],
  orders: [
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
      stage: 3,
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
    }
  ],
  disruptions: [
    {
      id: 'DIS-2026-01',
      severity: 'High',
      title: 'Rotterdam Port Congestion & Dock Strike',
      region: 'North-West Europe',
      affectedRoutes: ['Rotterdam to Hamburg', 'Rotterdam to US East Coast'],
      affectedMaterials: ['Inconel 718', 'Titanium Billets'],
      impactDelayDays: 6,
      recommendedAction: 'Reroute shipping via Gothenburg or air-freight allocation shift to Titan Works secondary facility.'
    }
  ]
}

// Load or initialize DB
function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8')
      return INITIAL_DATA
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8')
    const parsed = JSON.parse(content)
    if (!parsed.materials || parsed.materials.length === 0) {
      parsed.materials = INITIAL_DATA.materials
    }
    if (!parsed.suppliers || parsed.suppliers.length === 0) {
      parsed.suppliers = INITIAL_DATA.suppliers
    }
    return parsed
  } catch (err) {
    console.warn('DB read error, using memory fallback:', err)
    return INITIAL_DATA
  }
}

export const db = loadDb()

export function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save DB to disk:', err)
  }
}
