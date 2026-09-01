import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Button,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  invoiceNumber?: string
  invoiceDate?: string
  companyName?: string
  senderName?: string
}

const Email = ({
  invoiceNumber = '',
  invoiceDate = '',
  companyName = '',
  senderName = 'ABJAD Engineering Works',
}: Props) => (

  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`Invoice ${invoiceNumber} from ${senderName}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>{senderName}</Text>
        <Heading style={h1}>Invoice {invoiceNumber}</Heading>
        <Section style={card}>
          <Text style={row}>
            <span style={label}>Invoice No.</span> {invoiceNumber}
          </Text>
          {invoiceDate ? (
            <Text style={row}>
              <span style={label}>Date</span> {invoiceDate}
            </Text>
          ) : null}
          {companyName ? (
            <Text style={row}>
              <span style={label}>Billed to</span> {companyName}
            </Text>
          ) : null}
        </Section>
        <Text style={text}>The invoice PDF is attached to this email.</Text>
        <Hr style={hr} />

        <Text style={muted}>Thank you for your business.</Text>
        <Text style={muted}>{senderName}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Invoice ${data['invoiceNumber'] ?? ''} from ${data['senderName'] ?? 'ABJAD Engineering Works'}`.trim(),
  displayName: 'Invoice sent to customer',
  previewData: {
    invoiceNumber: '12-fluid-tech',
    invoiceDate: '2026-08-29',
    companyName: 'Fluid Tech Systems',
    senderName: 'ABJAD Engineering Works',

  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const brand = { fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' as const, color: '#6b7280', margin: '0 0 8px' }
const h1 = { fontSize: '22px', color: '#111827', margin: '0 0 16px' }
const text = { fontSize: '14px', lineHeight: '22px', color: '#374151', margin: '0 0 12px' }
const card = { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px', margin: '16px 0' }
const row = { fontSize: '14px', color: '#111827', margin: '0 0 6px' }
const label = { display: 'inline-block', width: '110px', color: '#6b7280' }
const button = { backgroundColor: '#111827', color: '#ffffff', borderRadius: '6px', padding: '12px 20px', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
const muted = { fontSize: '12px', color: '#6b7280', margin: '0 0 4px' }
