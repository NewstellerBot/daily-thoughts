import React, { useRef, useEffect } from 'react'
import { BlockType, editableBlockStyles } from './EditableBlock'

export type MenuProps = {
  menu: { x: number; y: number } | null
  close: () => void
  addBlock: (type?: BlockType) => void
  recoverHtml: () => void
}

const Menu = ({ menu, close: closeMenu, addBlock, recoverHtml }: MenuProps) => {
  const [active, setActive] = React.useState(0)
  const [shift, setShift] = React.useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = () => {
    setActive(0)
    closeMenu()
  }

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((prev) => (prev > 0 ? prev - 1 : prev))
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((prev) =>
          prev < Object.keys(options).length - 1 ? prev + 1 : prev
        )
      }
      if (e.key === 'Escape' && menu) {
        close()
      }

      if (e.key === ' ' || e.key === 'Backspace') {
        close()
      }

      if (e.key === 'Shift') {
        setShift(true)
      }
      if (e.key === 'Enter') {
        if (!shift) {
          e.preventDefault()
          if (menu) {
            addBlock(Object.keys(editableBlockStyles)[active] as BlockType)
            ;(e.target as HTMLElement).innerHTML = (
              e.target as HTMLElement
            ).innerHTML.slice(0, (e.target as HTMLElement).innerHTML.length - 1)
          } else {
            addBlock()
          }
          recoverHtml()
          close()
        }
      }
      if (!'ArrowDownArrowUp'.includes(e.key)) {
        close()
      }
    }

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShift(false)
      }
    }

    const clickHandler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close()
      }
    }

    window.addEventListener('keydown', keyDownHandler)
    window.addEventListener('keyup', keyUpHandler)
    window.addEventListener('click', clickHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
      window.removeEventListener('keyup', keyUpHandler)
      window.removeEventListener('click', clickHandler)
    }
  })

  const options = {
    p: 'Paragraph',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
  }

  return (
    menu && (
      <div
        className="rounded-xl border absolute transition bg-white z-50"
        style={menu ? { top: menu?.y + 20, left: menu?.x } : undefined}
        ref={ref}
      >
        <ul>
          {Object.values(options).map((option: string, i) => (
            <li
              key={option}
              onMouseEnter={() => setActive(i)}
              className={`px-2 py-0.5 rounded-lg cursor-pointer ${
                active === i ? 'bg-blue-500 text-white' : ''
              } ${editableBlockStyles[Object.keys(options)[i] as BlockType]}`}
              onClick={() => {
                addBlock(Object.keys(options)[i] as BlockType)
                recoverHtml()
                close()
              }}
            >
              {Object.values(options)[i]}
            </li>
          ))}
        </ul>
      </div>
    )
  )
}

export default Menu
