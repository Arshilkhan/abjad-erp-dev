import assert from 'node:assert/strict'

const requiredEnv = [
  'ERP_ADMIN_API_BASE_URL',
  'ADMIN_TEST_SUPER_ADMIN_TOKEN',
  'ADMIN_TEST_ORG_ADMIN_TOKEN',
  'ADMIN_TEST_VIEWER_TOKEN',
  'ADMIN_TEST_ORGANIZATION_ID',
  'ADMIN_TEST_OTHER_ORGANIZATION_ID',
  'ADMIN_TEST_ALLOWED_ORIGIN',
]

const missing = requiredEnv.filter((name) => !process.env[name])
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`)
  process.exit(2)
}

const baseUrl = process.env.ERP_ADMIN_API_BASE_URL.replace(/\/+$/, '')
const superAdminToken = process.env.ADMIN_TEST_SUPER_ADMIN_TOKEN
const orgAdminToken = process.env.ADMIN_TEST_ORG_ADMIN_TOKEN
const viewerToken = process.env.ADMIN_TEST_VIEWER_TOKEN
const organizationId = process.env.ADMIN_TEST_ORGANIZATION_ID
const otherOrganizationId = process.env.ADMIN_TEST_OTHER_ORGANIZATION_ID
const allowedOrigin = new URL(process.env.ADMIN_TEST_ALLOWED_ORIGIN).origin
const organizationPath = '/api/admin/organizations'
let assertions = 0

async function request(path, { token, origin = allowedOrigin, ...init } = {}) {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (origin) headers.set('Origin', origin)

  return fetch(`${baseUrl}${path}`, { ...init, headers })
}

async function expectStatus(name, response, status) {
  assert.equal(response.status, status, `${name}: expected HTTP ${status}, got ${response.status}`)
  assertions += 1
}

async function main() {
  await expectStatus('missing token', await request(organizationPath, { token: undefined }), 401)
  await expectStatus('malformed token', await request(organizationPath, { token: 'not-a-jwt' }), 401)

  await expectStatus('organization admin cannot list platform organizations',
    await request(organizationPath, { token: orgAdminToken }), 403)
  await expectStatus('organization admin cannot read platform organization detail',
    await request(`${organizationPath}/${organizationId}`, { token: orgAdminToken }), 403)
  await expectStatus('viewer cannot list platform organizations',
    await request(organizationPath, { token: viewerToken }), 403)

  const listResponse = await request(organizationPath, { token: superAdminToken })
  await expectStatus('platform super admin can list organizations', listResponse, 200)
  assert.equal(listResponse.headers.get('access-control-allow-origin'), allowedOrigin,
    'bearer-token list response must allow the configured Admin origin')
  assertions += 1
  const listBody = await listResponse.json()
  assert.ok(Array.isArray(listBody.organizations), 'list response must contain organizations[]')
  assertions += 1

  const detailResponse = await request(`${organizationPath}/${organizationId}`, { token: superAdminToken })
  await expectStatus('platform super admin can read organization detail', detailResponse, 200)
  const detailBody = await detailResponse.json()
  assert.equal(detailBody.organization?.id, organizationId, 'detail response must return the requested organization')
  assertions += 1

  assert.notEqual(otherOrganizationId, organizationId,
    'cross-organization test must use two different organization IDs')
  assertions += 1

  await expectStatus('organization admin cannot read a second organization through the platform API',
    await request(`${organizationPath}/${otherOrganizationId}`, { token: orgAdminToken }), 403)
  await expectStatus('organization admin cannot change a second organization status through the platform API',
    await request(`${organizationPath}/${otherOrganizationId}`, {
      token: orgAdminToken,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'suspended' }),
    }), 403)
  await expectStatus('organization admin cannot change organization status through the platform API',
    await request(`${organizationPath}/${organizationId}`, {
      token: orgAdminToken,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'suspended' }),
    }), 403)
  await expectStatus('viewer cannot change organization status through the platform API',
    await request(`${organizationPath}/${organizationId}`, {
      token: viewerToken,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'suspended' }),
    }), 403)

  const otherDetailResponse = await request(`${organizationPath}/${otherOrganizationId}`, { token: superAdminToken })
  await expectStatus('platform super admin can read a second organization', otherDetailResponse, 200)
  const otherDetailBody = await otherDetailResponse.json()
  assert.equal(otherDetailBody.organization?.id, otherOrganizationId,
    'cross-organization detail must return only the requested organization')
  assertions += 1

  const originalOtherOrganizationStatus = otherDetailBody.organization?.status
  assert.ok(['active', 'suspended'].includes(originalOtherOrganizationStatus),
    'second organization must have a supported status')
  assertions += 1

  await expectStatus('platform super admin status change rejects unsupported values',
    await request(`${organizationPath}/${otherOrganizationId}`, {
      token: superAdminToken,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'deleted' }),
    }), 400)

  let statusChangeAttempted = false
  try {
    statusChangeAttempted = true
    const suspendResponse = await request(`${organizationPath}/${otherOrganizationId}`, {
      token: superAdminToken,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'suspended' }),
    })
    await expectStatus('platform super admin can suspend a second organization', suspendResponse, 200)
    const suspendBody = await suspendResponse.json()
    assert.equal(suspendBody.organization?.status, 'suspended', 'suspend operation must set suspended status')
    assertions += 1
    assert.equal(suspendResponse.headers.get('access-control-allow-origin'), allowedOrigin,
      'bearer-token status response must allow the configured Admin origin')
    assertions += 1
  } finally {
    if (statusChangeAttempted) {
      await expectStatus('platform super admin can restore the second organization status',
        await request(`${organizationPath}/${otherOrganizationId}`, {
          token: superAdminToken,
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: originalOtherOrganizationStatus }),
        }), 200)
      const restoredResponse = await request(`${organizationPath}/${otherOrganizationId}`, { token: superAdminToken })
      await expectStatus('platform super admin can verify the restored organization status', restoredResponse, 200)
      const restoredBody = await restoredResponse.json()
      assert.equal(restoredBody.organization?.status, originalOtherOrganizationStatus,
        'cross-organization test must restore the second organization to its original status')
      assertions += 1
    }
  }

  await expectStatus('invalid organization ID is rejected',
    await request(`${organizationPath}/not-a-uuid`, { token: superAdminToken }), 400)
  await expectStatus('unknown organization ID returns not found',
    await request(`${organizationPath}/00000000-0000-4000-8000-000000000000`, { token: superAdminToken }), 404)

  const preflight = await request(`${organizationPath}/${organizationId}`, {
    method: 'OPTIONS',
    token: undefined,
    headers: {
      'Access-Control-Request-Method': 'PATCH',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  })
  await expectStatus('configured Admin origin PATCH preflight succeeds', preflight, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), allowedOrigin)
  assertions += 1
  assert.match(preflight.headers.get('access-control-allow-methods') ?? '', /PATCH/)
  assertions += 1

  await expectStatus('unconfigured origin preflight is rejected',
    await request(organizationPath, { method: 'OPTIONS', token: undefined, origin: 'https://disallowed.invalid' }), 403)

  console.log(`Platform Admin API authorization checks passed (${assertions} assertions).`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Platform Admin API checks failed')
  process.exitCode = 1
})
