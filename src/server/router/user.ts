import { createRouter } from './context'
import { z } from 'zod'

export const userRouter = createRouter().query('getByEmail', {
  input: z.object({
    email: z.string(),
  }),
  resolve: async ({ input, ctx }) => {
    return await ctx.prisma.user.findUnique({ where: { email: input.email } })
  },
})
