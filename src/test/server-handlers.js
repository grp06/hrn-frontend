import { rest } from 'msw'

export const handlers = [
  rest.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, async (req, res, ctx) => {
    if (!req.body.password) {
      return res(ctx.status(400), ctx.json({ error: 'Missing password in request body' }))
    }
    if (!req.body.email) {
      return res(ctx.status(400), ctx.json({ error: 'Missing email in request body' }))
    }
    return res(
      // respond with a 200 status code
      ctx.status(200),
      ctx.json({
        id: 74,
        token: 'eyJhbGci',
      })
    )
  }),
]
