import assert from 'node:assert/strict'

const requiredEnv = [
  'ERP_ADMIN_API_BASE_URL',
  'ADMIN_TEST_SUPER_ADMIN_TOKEN',
  'ADMIN_TEST_ORG_ADMIN_TOKEN',
  'ADMIN_TEST_VIEWER_TOKEN',
  'ADMIN_TEST_ORGANIZATION_ID',
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
  const listBody = await listResponse.json()
  assert.ok(Array.isArray(listBody.organizations), 'list response must contain organizations[]')
  assertions += 1

  const detailResponse = await request(`${organizationPath}/${organizationId}`, { token: superAdminToken })
  await expectStatus('platform super admin can read organization detail', detailResponse, 200)
  const detailBody = await detailResponse.json()
  assert.equal(detailBody.organization?.id, organizationId, 'detail response must return the requested organization')
  assertions += 1

  await expectStatus('invalid organization ID is rejected',
    await request(`${organizationPath}/not-a-uuid`, { token: superAdminToken }), 400)
  await expectStatus('unknown organization ID returns not found',
    await request(`${organizationPath}/00000000-0000-4000-8000-000000000000`, { token: superAdminToken }), 404)

  const preflight = await request(organizationPath, {
    method: 'OPTIONS',
    token: undefined,
    headers: {
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'authorization',
    },
  })
  await expectStatus('configured Admin origin preflight succeeds', preflight, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), allowedOrigin)
  assertions += 1

  await expectStatus('unconfigured origin preflight is rejected',
    await request(organizationPath, { method: 'OPTIONS', token: undefined, origin: 'https://disallowed.invalid' }), 403)

  console.log(`Platform Admin API authorization checks passed (${assertions} assertions).`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Platform Admin API checks failed')
  process.exitCode = 1
})
