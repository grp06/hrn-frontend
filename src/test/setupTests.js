import '@testing-library/react/cleanup-after-each'
// this adds jest-doms custom assertions
import '@testing-library/jest-dom/extend-expect'

// import { server } from '../mocks/server'

// beforeAll(() => {
//   // Establish requests interception layer before all tests.
//   server.listen({
//     onUnhandledRequest: 'warn',
//   })
// })

// afterAll(() => {
//   // Clean up after all tests are done. preventing this
//   // interception layer from affecting irrelevant tests.
//   server.close()
// })

// afterEach(() => server.resetHandlers())
