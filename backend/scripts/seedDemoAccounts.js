import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import User from '../src/models/User.js'
import Supplier from '../src/models/Supplier.js'
import Company from '../src/models/Company.js'
import Material from '../src/models/Material.js'
import Order from '../src/models/Order.js'
import Certificate from '../src/models/Certificate.js'
import Disruption from '../src/models/Disruption.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_FILE = path.join(__dirname, '../src/data/database.json')

async function seed() {
  console.log('\n======================================================')
  console.log(' 5Directions — Provisioning Verified Demo Accounts & Data')
  console.log('======================================================\n')

  const salt = await bcrypt.genSalt(10)
  const demoPasswordHash = await bcrypt.hash('Demo@12345', salt)

  // 1. Prepare Core Demo Records
  const demoUsers = [
    {
      email: 'company.demo@5directions.demo',
      passwordHash: demoPasswordHash,
      role: 'company',
      fullName: 'Sarah Jenkins (Procurement Dir)',
      companyName: 'AeroDynamics Global Inc.',
      country: 'United States'
    },
    {
      email: 'supplier.demo@5directions.demo',
      passwordHash: demoPasswordHash,
      role: 'supplier',
      fullName: 'Hans Becker (Head of Sales)',
      companyName: 'Titan Works GmbH',
      country: 'Germany'
    }
  ]

  // Update local file database.json first to ensure immediate offline/local availability
  try {
    let localDb = { users: [], materials: [], suppliers: [], orders: [], disruptions: [] }
    if (fs.existsSync(DB_FILE)) {
      try {
        localDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
      } catch (e) {
        // use default
      }
    }

    // Upsert demo users in localDb
    for (const u of demoUsers) {
      const idx = localDb.users.findIndex(existing => existing.email.toLowerCase() === u.email.toLowerCase())
      const userRecord = {
        id: idx >= 0 ? localDb.users[idx].id : `usr-${u.role.slice(0, 4)}-demo`,
        email: u.email,
        passwordHash: u.passwordHash,
        fullName: u.fullName,
        companyName: u.companyName,
        role: u.role,
        country: u.country,
        createdAt: new Date().toISOString()
      }
      if (idx >= 0) {
        localDb.users[idx] = userRecord
      } else {
        localDb.users.push(userRecord)
      }
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(localDb, null, 2), 'utf-8')
    console.log('✅ Local file database.json synchronized with demo accounts.')
  } catch (err) {
    console.warn('⚠️ Local file sync note:', err.message)
  }

  // 2. Connect to MongoDB Atlas if URI is provided
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log('\nℹ️ Note: MONGODB_URI is not set. Demo accounts have been provisioned in local storage.')
    console.log('   Once MONGODB_URI is configured in Render or .env, re-run `npm run seed` to provision Atlas.')
    console.log('\n------------------------------------------------------')
    console.log(' DEMO CREDENTIALS:')
    console.log(' 🏢 Company Demo:  company.demo@5directions.demo  /  Demo@12345')
    console.log(' 🏭 Supplier Demo: supplier.demo@5directions.demo /  Demo@12345')
    console.log('------------------------------------------------------\n')
    process.exit(0)
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    console.log('✅ Connected to MongoDB Atlas cluster for provisioning.')

    // Seed Users
    let companyUser = await User.findOne({ email: demoUsers[0].email })
    if (!companyUser) {
      companyUser = await User.create(demoUsers[0])
      console.log('Created Company User in Atlas:', companyUser.email)
    } else {
      companyUser.passwordHash = demoPasswordHash
      await companyUser.save()
      console.log('Updated Company User password in Atlas:', companyUser.email)
    }

    let supplierUser = await User.findOne({ email: demoUsers[1].email })
    if (!supplierUser) {
      supplierUser = await User.create(demoUsers[1])
      console.log('Created Supplier User in Atlas:', supplierUser.email)
    } else {
      supplierUser.passwordHash = demoPasswordHash
      await supplierUser.save()
      console.log('Updated Supplier User password in Atlas:', supplierUser.email)
    }

    // Seed Company Record
    let companyRecord = await Company.findOne({ name: 'AeroDynamics Global Inc.' })
    if (!companyRecord) {
      companyRecord = await Company.create({
        userId: companyUser._id,
        name: 'AeroDynamics Global Inc.',
        country: 'United States',
        industry: 'Aerospace & Defense Procurement',
        contactEmail: 'procurement@aerodynamics.com'
      })
      console.log('Created Company Profile in Atlas:', companyRecord.name)
    }

    // Seed Suppliers
    const suppliersData = [
      {
        userId: supplierUser._id,
        name: 'Titan Works GmbH',
        country: 'Germany',
        rating: 4.9,
        tier: 'Tier 1',
        verified: true,
        contactEmail: 'supplier.demo@5directions.demo',
        leadTimeDays: 5,
        complianceScore: 99
      },
      {
        name: 'Vanguard Metals International',
        country: 'United States',
        rating: 4.8,
        tier: 'Tier 1',
        verified: true,
        contactEmail: 'procurement@vanguardmetals.com',
        leadTimeDays: 7,
        complianceScore: 97
      },
      {
        name: 'Apex Forge & Precision Alloys',
        country: 'Japan',
        rating: 4.7,
        tier: 'Tier 2',
        verified: true,
        contactEmail: 'contact@apexforge.jp',
        leadTimeDays: 10,
        complianceScore: 94
      },
      {
        name: 'Nordic Alloy Works AB',
        country: 'Sweden',
        rating: 4.6,
        tier: 'Tier 2',
        verified: true,
        contactEmail: 'sales@nordicalloy.se',
        leadTimeDays: 8,
        complianceScore: 92
      }
    ]

    const createdSuppliers = {}
    for (const sup of suppliersData) {
      let existing = await Supplier.findOne({ name: sup.name })
      if (!existing) {
        existing = await Supplier.create(sup)
        console.log('Created Supplier in Atlas:', existing.name)
      }
      createdSuppliers[sup.name] = existing
    }

    // Seed Materials
    const materialsData = [
      {
        supplierId: createdSuppliers['Titan Works GmbH']._id,
        supplierName: 'Titan Works GmbH',
        name: 'Titanium Ti-6Al-4V Grade 5',
        category: 'Metals & Alloys',
        specification: 'ASTM B265 / AMS 4911 Aerospace Grade',
        pricePerUnit: 42.0,
        unit: 'kg',
        stockAvailable: 3500, // primary stock (limited to demonstrate multi-supplier recovery!)
        minOrderQty: 200,
        leadTimeDays: 5
      },
      {
        supplierId: createdSuppliers['Vanguard Metals International']._id,
        supplierName: 'Vanguard Metals International',
        name: 'Titanium Ti-6Al-4V Grade 5',
        category: 'Metals & Alloys',
        specification: 'ASTM B265 / AMS 4911 Aerospace Grade',
        pricePerUnit: 44.5,
        unit: 'kg',
        stockAvailable: 4500,
        minOrderQty: 500,
        leadTimeDays: 7
      },
      {
        supplierId: createdSuppliers['Apex Forge & Precision Alloys']._id,
        supplierName: 'Apex Forge & Precision Alloys',
        name: 'Titanium Ti-6Al-4V Grade 5',
        category: 'Metals & Alloys',
        specification: 'AMS 4928 Hot Rolled Billet',
        pricePerUnit: 46.0,
        unit: 'kg',
        stockAvailable: 3000,
        minOrderQty: 250,
        leadTimeDays: 10
      },
      {
        supplierId: createdSuppliers['Nordic Alloy Works AB']._id,
        supplierName: 'Nordic Alloy Works AB',
        name: 'Aerospace Aluminium 7075-T651 Plate',
        category: 'Metals & Alloys',
        specification: 'AMS 4045 / ASTM B209',
        pricePerUnit: 18.0,
        unit: 'kg',
        stockAvailable: 12000,
        minOrderQty: 100,
        leadTimeDays: 4
      }
    ]

    for (const mat of materialsData) {
      let existing = await Material.findOne({ name: mat.name, supplierId: mat.supplierId })
      if (!existing) {
        existing = await Material.create(mat)
        console.log('Created Material in Atlas:', existing.name, '(', mat.supplierName, ')')
      }
    }

    // Seed Certificates
    const certsData = [
      {
        supplierId: createdSuppliers['Titan Works GmbH']._id,
        supplierName: 'Titan Works GmbH',
        name: 'AS9100D Aerospace Quality Management',
        certNumber: 'AS-9100-DE-8821',
        issuingBody: 'TUV Rheinland',
        issueDate: '2024-01-15',
        expiryDate: '2027-01-14',
        verified: true
      },
      {
        supplierId: createdSuppliers['Titan Works GmbH']._id,
        supplierName: 'Titan Works GmbH',
        name: 'ISO 9001:2015 Quality Systems',
        certNumber: 'ISO-9001-88419',
        issuingBody: 'DEKRA Certification',
        issueDate: '2023-06-10',
        expiryDate: '2026-06-09',
        verified: true
      },
      {
        supplierId: createdSuppliers['Vanguard Metals International']._id,
        supplierName: 'Vanguard Metals International',
        name: 'AS9100D / Nadcap Heat Treating',
        certNumber: 'AS-US-99214',
        issuingBody: 'PRI Nadcap',
        issueDate: '2024-03-20',
        expiryDate: '2027-03-19',
        verified: true
      },
      {
        supplierId: createdSuppliers['Apex Forge & Precision Alloys']._id,
        supplierName: 'Apex Forge & Precision Alloys',
        name: 'JIS Q 9100 Aerospace Standard',
        certNumber: 'JIS-JP-55102',
        issuingBody: 'JQA Japan',
        issueDate: '2023-11-01',
        expiryDate: '2026-10-31',
        verified: true
      }
    ]

    for (const cert of certsData) {
      let existing = await Certificate.findOne({ certNumber: cert.certNumber })
      if (!existing) {
        await Certificate.create(cert)
        console.log('Created Certificate in Atlas:', cert.name)
      }
    }

    // Seed Active Orders
    const existingOrder = await Order.findOne({ orderNumber: 'PO-2026-0100' })
    if (!existingOrder) {
      await Order.create({
        orderNumber: 'PO-2026-0100',
        companyId: companyRecord._id,
        companyName: 'AeroDynamics Global Inc.',
        supplierId: createdSuppliers['Titan Works GmbH']._id,
        supplierName: 'Titan Works GmbH',
        materialName: 'Titanium Ti-6Al-4V Grade 5',
        quantity: 10000,
        unit: 'kg',
        unitPrice: 42.0,
        totalPrice: 420000,
        status: 'Disrupted',
        disruptionReason: 'Capacity bottleneck & port delay: Primary supplier can only provide 2,000 kg of 10,000 kg required.',
        deliveryDeadline: '14 days'
      })
      console.log('Created Disrupted Target Order PO-2026-0100 in Atlas.')
    }

    // Seed Disruption Record
    const existingDisruption = await Disruption.findOne({ materialName: 'Titanium Ti-6Al-4V Grade 5' })
    if (!existingDisruption) {
      await Disruption.create({
        companyId: companyRecord._id,
        orderNumber: 'PO-2026-0100',
        materialName: 'Titanium Ti-6Al-4V Grade 5',
        supplierName: 'Titan Works GmbH',
        affectedQuantity: 8000,
        unit: 'kg',
        severity: 'critical',
        issueDescription: 'Smelting line bottleneck at Hamburg facility: Titan Works unable to supply remaining 8,000 kg on schedule. Urgent multi-supplier reallocation required.',
        status: 'active'
      })
      console.log('Created Active Disruption record in Atlas.')
    }

    console.log('\n======================================================')
    console.log(' ✅ SEED COMPLETE: MongoDB Atlas fully populated!')
    console.log(' DEMO CREDENTIALS:')
    console.log(' 🏢 Company Demo:  company.demo@5directions.demo  /  Demo@12345')
    console.log(' 🏭 Supplier Demo: supplier.demo@5directions.demo /  Demo@12345')
    console.log('======================================================\n')
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ MongoDB Atlas seed failed:', err.message)
    process.exit(0)
  }
}

seed()
