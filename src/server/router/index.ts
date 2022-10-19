// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { blockRouter } from './block'
import { userRouter } from './user'
import { dayRouter } from './day'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('block.', blockRouter)
  .merge('user.', userRouter)
  .merge('day.', dayRouter)

// export type definition of API
export type AppRouter = typeof appRouter
