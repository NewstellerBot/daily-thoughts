import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuid4 } from 'uuid'
import { useSession } from 'next-auth/react'

import { trpc } from '../../utils/trpc'

import usePrevious from '../../hooks/usePrevious'
import Menu from './Menu'

import EditableBlock, { Block, BlockType } from './EditableBlock'
import debounce from '../../utils/debounce'

const uuid = () => `b-${uuid4()}`

const defaultBlock: { type: BlockType; html: string } = {
  type: 'p',
  html: '',
}

const EditablePage = () => {
  // Get session
  const { data: session } = useSession()

  const draggableWrapperRef = useRef<HTMLDivElement | null>(null)

  // Create trpc queries and mutations
  const createBlock = trpc.useMutation(['block.create'])
  const updateBlock = trpc.useMutation(['block.update'])
  const destroyBlock = trpc.useMutation(['block.delete'])
  const getDay = trpc.useQuery(['day.get', { userId: session?.user.id || '' }])
  const replaceBlocksDay = trpc.useMutation(['day.replaceBlocks'])

  // Initiate states
  // Stores all blocks that are on the page
  const [blocks, setBlocks] = useState<Block[]>([])
  // If menu is open, it has its x, y cordinates, otherwise null
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const prevBlocks = usePrevious(blocks)
  // Keeps the last focused element
  const [currentBlock, setCurrentBlock] = useState<string | null>(null)
  // If user opens the menu, this stores backup of html before the menu opened
  const backupHtml = useRef<null | { blockId: string; html: string }>(null)

  const blocksBounds = useRef<({ top: number; bot: number } | null)[]>()

  useEffect(() => {
    console.log('blocks updated')
    blocksBounds.current = blocks.map((b) => getElementBounds(b.id))
  }, [blocks])

  const openMenu = (x: number, y: number) => setMenu({ x, y })
  const closeMenu = () => setMenu(null)

  const getElementBounds = (
    id: string | undefined
  ): { top: number; bot: number } | null => {
    if (id === undefined) {
      return null
    }
    const el = document.querySelector(`#${id}`)
    if (!el) throw Error(`block with this id does not exist, id: ${id}`)
    const { top, bottom } = el.getBoundingClientRect()
    return { top, bot: bottom }
  }

  const addBlock = async (block: Block) => {
    const index = blocks.findIndex((b: Block) => b.id === currentBlock)
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, block)
    setBlocks(newBlocks)

    if (session?.user.id && getDay.data) {
      await createBlock.mutateAsync({
        id: block.id,
        html: block.html,
        type: block.type,
        userId: session.user.id,
      })
      await replaceBlocksDay.mutateAsync({
        id: getDay.data?.id,
        blockIds: newBlocks.map((b) => b.id),
      })
    }
  }

  const deleteBlock = async (id: string) => {
    await destroyBlock.mutateAsync({ id })

    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((block: Block) => block.id === id) - 1
      const newBlocks = prevBlocks.filter((block: Block) => block.id !== id)
      const newId = newBlocks[index]?.id || ''
      setCurrentBlock(newId)
      if (getDay.data)
        replaceBlocksDay.mutate({
          id: getDay.data.id,
          blockIds: newBlocks.map((b) => b.id),
        })
      return newBlocks
    })
  }

  const recoverHtml = () => {
    setBlocks((prevBlocks) => {
      const newBlocks = prevBlocks.map((block: Block) => {
        if (block.id === backupHtml.current?.blockId) {
          return { ...block, html: backupHtml.current?.html }
        }
        return block
      })
      return newBlocks
    })
  }

  const handleFocus = (e: Event) => {
    setCurrentBlock((e.target as HTMLElement).id)

    const el = e.target as HTMLElement | null
    if (el?.innerHTML !== '' && el?.innerHTML !== '<br>') {
      const range = document.createRange()
      const sel = window.getSelection()
      if (el) range.setStart(el, el.childNodes.length)
      range.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') {
      e.stopPropagation()
      backupHtml.current = {
        html: (e.target as HTMLDivElement).innerHTML,
        blockId: (e.target as HTMLDivElement).id,
      }
      const { bottom: y, left: x } = (
        e.target as HTMLElement
      ).getBoundingClientRect()
      openMenu(x, y)
    }
    if (
      e.key === 'Backspace' &&
      ((e.target as HTMLDivElement).innerHTML === '' ||
        (e.target as HTMLDivElement).innerHTML === '<br>')
    ) {
      e.preventDefault()
      deleteBlock((e.target as HTMLDivElement).id)
    }
    if (e.key === 'ArrowDown' && !menu) {
      const index = blocks.findIndex(
        (b) => b.id === (e.target as HTMLElement).id
      )
      const el = document.querySelector(
        `[position="${index + 1}"]`
      ) as HTMLElement | null
      el?.focus()
    }
    if (e.key === 'ArrowUp' && !menu) {
      const index = blocks.findIndex(
        (b) => b.id === (e.target as HTMLElement).id
      )
      if (index > 0) {
        const el = document.querySelector(
          `[position="${index - 1}"]`
        ) as HTMLElement | null
        el?.focus()
      }
    }
    if (e.key === 'Escape' && !menu) (e.target as HTMLElement).blur()
  }

  const handleChange = (e: React.ChangeEvent) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block: Block) => {
        if (block.id === e.target.id) {
          return { ...block, html: (e.target as HTMLDivElement).innerHTML }
        }
        return block
      })
    )
    debounce(
      () => {
        updateBlock.mutate({
          id: e.target.id,
          html: (e.target as HTMLDivElement).innerHTML,
        })
      },
      250,
      e.target.id
    )
  }

  const handleStopDrag = (e: React.MouseEvent, draggedBlock: Block) => {
    // We only wanna handle the drag if there are at least two blocks

    setBlocks((_blocks) => {
      const newBlocks = [..._blocks]

      if (blocksBounds.current) {
        const index = blocks.findIndex((b) => {
          return b === draggedBlock
        })
        const { clientY: y } = e

        for (let i = 0; i < blocksBounds.current.length; i++) {
          const El = blocksBounds.current[i]
          const nextEl = blocksBounds.current[i + 1] || null

          if (El && nextEl != null) {
            const top = El.top
            const bot = nextEl.bot
            if (i == 0) {
              if (y < top && i !== index) {
                newBlocks.splice(0, 0, draggedBlock)
                newBlocks.splice(index + 1, 1)
                break
              }
            }
            if (y > top && y < bot && i !== index) {
              newBlocks.splice(i + 1, 0, draggedBlock)
              if (i < index) {
                newBlocks.splice(index + 1, 1)
              } else {
                newBlocks.splice(index, 1)
              }
              break
            }
          } else if (El) {
            const bot = El.bot
            if (y > bot && i !== index) {
              newBlocks.push(draggedBlock)
              newBlocks.splice(index, 1)
              break
            }
          }
        }
      }
      if (getDay?.data?.id)
        replaceBlocksDay.mutate({
          id: getDay.data.id,
          blockIds: newBlocks.map((b) => b.id),
        })
      return newBlocks
    })
  }

  useEffect(() => {
    if (prevBlocks && (prevBlocks as Block[]).length + 1 === blocks.length) {
      // New block was added
      const index = blocks.findIndex((b) => b.id === currentBlock)
      const newBlock = document.querySelector(
        `#${blocks[index + 1]?.id}`
      ) as HTMLElement | null
      newBlock?.focus()
    }
    if (prevBlocks && (prevBlocks as Block[]).length - 1 === blocks.length) {
      // A block was deleted
      const index = blocks.findIndex((b) => b.id === currentBlock)
      const block = document.querySelector(
        `#${blocks[index]?.id}`
      ) as HTMLElement | null
      block?.focus()
    }
  }, [blocks, currentBlock, prevBlocks])

  useEffect(() => {
    // Load blocks in the initial loading
    const { data } = getDay
    if (data) {
      const initBlocks = data?.blocks
      if (initBlocks.length > 0) setBlocks(initBlocks as Block[])
      else addBlock({ ...defaultBlock, id: uuid() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDay.data])

  if (getDay.isSuccess)
    return (
      <>
        <Menu
          menu={menu}
          addBlock={(type?: BlockType) => {
            const newBlock = {
              ...defaultBlock,
              id: uuid(),
              type: type || 'p',
            }
            addBlock(newBlock)
          }}
          close={closeMenu}
          recoverHtml={recoverHtml}
        />

        <div className="relative" ref={draggableWrapperRef}>
          {/* <div className="p-20 bg-cyan-400 rounded text-white grid place-items-center">
            T
          </div>
          {springs.map(({ y, scale, zIndex }, i) => {
            return (
              <animated.div
                style={{
                  scale,
                  zIndex,
                  y,
                }}
                key={draggables[i]?.text || `spring${i}`}
              >
                <DraggableCore
                  nodeRef={draggableElRef}
                  onDrag={(_, data) => {
                    if (
                      draggableWrapperRef.current &&
                      draggableElRef?.current
                    ) {
                      api.start(
                        (index) =>
                          index === i && {
                            y: -(top - data.y),
                            scale: 1.1,
                          }
                      )
                    }
                  }}
                  onStop={() => {
                    api.start({ scale: 1, zIndex: 0 })
                  }}
                >
                  <div
                    className="bg-pink-100 border-pink-300 border rounded-lg font-bold px-4 py-2 text-pink-900 cursor-grab"
                    // @ts-expect-error rect-spring might not be fully compatible with react-draggable when passing ref
                    ref={draggableElRef}
                  >
                    {draggables[i]?.text}
                  </div>
                </DraggableCore>
              </animated.div>
            )
          })} */}

          {blocks.map((block, i) => {
            return (
              <EditableBlock
                {...block}
                position={i}
                key={block.id}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onChange={handleChange}
                menu={menu !== null}
                handleStopDrag={(e: React.MouseEvent) =>
                  handleStopDrag(e, block)
                }
              />
            )
          })}
          {/* <DraggableBlock /> */}
        </div>
      </>
    )
  return <div />
}

export default EditablePage

// const DBlock = () => {
//   const [yOffset, setYOffset] = useState(0)
//   const [y, setY] = useState<null | number>(null)
//   const ref = useRef<null | HTMLDivElement>(null)
//   useEffect(() => {
//     if (ref.current) {
//       const top = ref.current.offsetTop
//       setYOffset(-top)
//     }
//   }, [ref])

//   useEffect(() => {
//     console.log(yOffset)
//   }, [yOffset])

//   return (
//     <DraggableCore
//       onDrag={(_, data) =>
//         setY((prev) => (prev ? data.deltaY + prev : data.deltaY))
//       }
//       nodeRef={ref}
//     >
//       <div
//         ref={ref}
//         className="bg-blue-500 rounded-lg py-2 px-2 text-white realtive"
//         style={{
//           transform: `translate3d(0px, ${y ?? '0'}px, 0px)`,
//         }}
//       >
//         Test draggable
//       </div>
//     </DraggableCore>
//   )
// }

// const DraggableBlock = React.memo(DBlock)
