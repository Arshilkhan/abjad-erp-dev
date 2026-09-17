import { buildChallanPdf } from '@/lib/challan-pdf-build.server'
import { writeFileSync } from 'fs'

const inv = {
  invoice_type: 'delivery_challan',
  invoice_number: 'DC/2026/001',
  challan_number: 'DC-001',
  challan_dates: ['2026-09-01', '2026-09-05', '2026-09-11'],
  invoice_date: '2026-09-12',
  movement_reason: 'Job Work',
  customer_name_snapshot: 'DIVYA ENTERPRISES PVT LTD',
  customer_gst_snapshot: '27AAACD1234F1Z5',
  customer_address_snapshot: 'Plot 22, MIDC Industrial Area, Ambernath East, Thane, Maharashtra 421506',
  transporter_name: 'Shree Transport',
  place_of_dispatch: 'Ambernath (E)',
  place_of_delivery: 'Bhiwandi',
  notes: 'Goods sent for machining, to be returned after job work.',
}
const items = [
  { sr_no: 1, item_name: 'MS Flange', hsn_code: '73072100', description: 'MS Flange 150mm raw casting for machining', quantity: 25, uom: 'NOS', serial_batch_number: 'B-2291' },
  { sr_no: 2, item_name: 'Shaft Assembly', hsn_code: '84833000', description: 'Shaft assembly with bearing housing, heat treated', quantity: 8, uom: 'NOS', serial_batch_number: 'SN-0012/0019' },
]
const company = {
  name: 'ABJAD ENGINEERING WORKS',
  address: 'UNIT NO. 008, G-WING, UDYOG BHAVAN-2, PLOT NO. K-3, MIDC ANAND NAGER',
  city: 'AMBERNATH (E)',
  state: 'MAHARASHTRA',
  pincode: '421506',
  mobile: '9876543210',
  alt_mobile: '9123456780',
  email: 'info@abjadengineeringworks.in',
  gst_number: '27AAAAA0000A1Z5',
}

const bytes = await buildChallanPdf(inv, items, company)
writeFileSync('/tmp/challan.pdf', bytes)
console.log('ok')
