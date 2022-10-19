import { createRouter } from './context'
import { z } from 'zod'

export const blockRouter = createRouter()
  .query('get', {
    input: z
      .object({
        id: z.array(z.string()).or(z.string()),
      })
      .optional(),
    resolve: async ({ input, ctx }) => {
      if (input) {
        return await ctx.prisma.block.findMany({
          where: { id: { in: input.id } },
        })
      }
      return await ctx.prisma.block.findMany()
    },
  })
  .query('getByUser', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.block.findMany({
        where: {
          userId: input.userId,
        },
      })
    },
  })
  .mutation('create', {
    input: z.object({
      id: z.string(),
      html: z.string().nullish(),
      type: z.string(),
      userId: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const res = await ctx.prisma.block.create({
        data: {
          id: input.id,
          html: input.html || '',
          type: input.type,
          userId: input.userId,
          date: new Date().toDateString(),
        },
      })
      return res
    },
  })
  .mutation('update', {
    input: z.object({
      id: z.string(),
      html: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const res = await ctx.prisma.block.update({
        where: { id: input.id },
        data: {
          html: input.html,
        },
      })
      return res
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.block.delete({ where: { id: input.id } })
    },
  })
