import { rest } from 'msw'

export const handlers = [
  rest.post('/api/auth/login', async (req, res, ctx) => {
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
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJetWIiOiIxIiwibmFtZSI6Imhvc3RAaG9zdC5jb20iLCJpYXQiOjE2MDM1ODExMjQuNDI5LCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IlgtSGFzdXJhLUFsbG93ZWQtUm9sZXMiOlsiYW5vbnltb3VzIiwidXNlciIsImhvc3QiXSwiWC1IYXN1cmEtVXNlci1JZCI6IjEiLCJYLUhhc3VyYS1EZWZhdWx0LVJvbGUiOiJob3N0In19.V2IkiuOSO05GzkyKFUafLKbvcvEtmpFXFMbuP0sJh1g',
      })
    )
  }),
]
