import { z } from 'zod'
import { createRouter } from './context'

export const testRouter = createRouter()
  .mutation('test', {
    input: z.object({
      date: z
        .date()
        .optional()
        .default(() => new Date()),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.dates.create({
        data: {
          date: input.date,
        },
      })
    },
  })
  .query('getTest', {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.dates.findMany()
    },
  })
