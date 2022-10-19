import { createRouter } from './context'
import { z } from 'zod'
import { Block, Day } from '@prisma/client'

export const dayRouter = createRouter()
  .query('getAll', {
    input: z.object({ userId: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.day.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          timestamp: 'asc',
        },
      })
    },
  })
  .query('get', {
    input: z.object({
      userId: z.string(),
      date: z.string().optional(),
      id: z.string().optional(),
    }),
    resolve: async ({ ctx, input }) => {
      if (input?.id) {
        const d: Day | null = await ctx.prisma.day.findUnique({
          where: { id: input.id },
        })
        if (d) {
          const blocks = await ctx.prisma.block.findMany({
            where: { id: { in: d?.blockIds } },
          })
          const sortedBlocks: Block[] = []
          d.blockIds.forEach((id) => {
            const b = blocks.find((b) => b.id === id)
            if (b !== undefined) sortedBlocks.push(b)
          })
          return { ...d, blocks: sortedBlocks }
        }
      }
      const date = input.date || new Date().toDateString()
      const d: Day | null = await ctx.prisma.day.findFirst({
        where: {
          date,
          userId: input.userId,
        },
      })
      if (d?.blockIds) {
        const blocks: Block[] = await ctx.prisma.block.findMany({
          where: {
            id: {
              in: d.blockIds,
            },
          },
        })
        const sortedBlocks: Block[] = []
        d.blockIds.forEach((id) => {
          const b = blocks.find((b) => b.id === id)
          if (b !== undefined) sortedBlocks.push(b)
        })
        return { ...d, blocks: sortedBlocks }
      }
      const newD: Day = await ctx.prisma.day.create({
        data: { userId: input.userId, date: new Date().toDateString() },
      })
      return { ...newD, blocks: [], blockIds: [] }
    },
  })
  .mutation('addBlock', {
    input: z.object({ blockId: z.string(), dayId: z.string() }),
    async resolve({ input, ctx }) {
      const day = await ctx.prisma.day.findUnique({
        where: { id: input.dayId },
      })
      if (day) {
        day.blockIds.push(input.blockId)
        await ctx.prisma.day.update({
          where: { id: input.dayId },
          data: { blockIds: day.blockIds },
        })
      }
    },
  })
  .mutation('deleteBlock', {
    input: z.object({
      blockId: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const day = await ctx.prisma.day.findUnique({
        where: {
          id: input.id,
        },
      })
      if (day)
        return await ctx.prisma.day.update({
          where: {
            id: day.id,
          },
          data: {
            blockIds: day.blockIds.filter((b: string) => b !== input.blockId),
          },
        })
    },
  })
  .mutation('replaceBlocks', {
    input: z.object({
      id: z.string(),
      blockIds: z.array(z.string()),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.day.update({
        where: { id: input.id },
        data: { blockIds: input.blockIds },
      })
    },
  })
