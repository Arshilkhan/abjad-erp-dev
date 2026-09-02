import * as React from 'react'
import { render } from '@react-email/render'
import { TEMPLATES } from './registry'

// Server-only: reads RESEND_API_KEY. Never import from client components.

const SITE_NAME = 'ABJAD Engineering Works'
const FROM_ADDRESS =
  process.env['RESEND_FROM_ADDRESS'] || 'invoices@abjadengineeringworks.in'

export interface ResendAttachment {
  filename: string
  /** base64-encoded file content */
  content: string
  contentType?: string
}

export interface SendResendEmailOptions {
  templateData?: Record<string, any>
  attachments?: ResendAttachment[]
  replyTo?: string
}

export type SendResendEmailResult = { sent: true; id?: string }

/**
 * Renders a registered React Email template and sends it through Resend
 * using the project's own RESEND_API_KEY. Throws on provider failure with
 * the upstream status and body included.
 */
export async function sendResendEmail(
  templateName: string,
  to: string,
  options: SendResendEmailOptions = {}
): Promise<SendResendEmailResult> {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`
    )
  }

  const recipient = template.to || to
  if (!recipient) {
    throw new Error('Recipient is required (the template defines no fixed recipient)')
  }

  const templateData = options.templateData ?? {}
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `${SITE_NAME} <${FROM_ADDRESS}>`,
      to: [recipient],
      subject,
      html,
      text,
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      ...(options.attachments?.length
        ? {
            attachments: options.attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              ...(a.contentType ? { content_type: a.contentType } : {}),
            })),
          }
        : {}),
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`[resend] send failed [${response.status}]: ${errorBody}`)
    throw new Error(`Resend request failed [${response.status}]: ${errorBody}`)
  }

  const result = (await response.json().catch(() => ({}))) as { id?: string }
  return { sent: true, id: result.id }
}

/** Sends a ready-made HTML email through Resend (no template registry lookup). */
export async function sendResendHtmlEmail(opts: {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  attachments?: ResendAttachment[]
}): Promise<SendResendEmailResult> {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `${SITE_NAME} <${FROM_ADDRESS}>`,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      ...(opts.text ? { text: opts.text } : {}),
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      ...(opts.attachments?.length
        ? {
            attachments: opts.attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              ...(a.contentType ? { content_type: a.contentType } : {}),
            })),
          }
        : {}),
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`[resend] send failed [${response.status}]: ${errorBody}`)
    throw new Error(`Resend request failed [${response.status}]: ${errorBody}`)
  }

  const result = (await response.json().catch(() => ({}))) as { id?: string }
  return { sent: true, id: result.id }
}
