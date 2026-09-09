import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/google-drive/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const origin = `${url.protocol}//${url.host}`
        const back = (status: string) =>
          new Response(null, { status: 302, headers: { location: `/backups?drive=${status}` } })

        const error = url.searchParams.get('error')
        if (error) return back(encodeURIComponent(error))

        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')
        if (!code || !state) return back('missing_code')

        const { verifyState, exchangeCodeAndStore } = await import('@/lib/google-drive.server')
        const userId = await verifyState(state)
        if (!userId) return back('invalid_state')

        try {
          await exchangeCodeAndStore(code, origin, userId)
          return back('connected')
        } catch (e) {
          console.error('[google-drive callback]', e)
          return back('failed')
        }
      },
    },
  },
})
