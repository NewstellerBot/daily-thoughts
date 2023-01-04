import React, { MouseEvent, useEffect, useRef } from 'react'
import * as DOMPurify from 'dompurify'
import { useSpring, animated } from 'react-spring'
import { DraggableCore, DraggableEvent } from 'react-draggable'
import { faGrip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type BlockType = 'p' | 'h1' | 'h2' | 'h3'

export type Block = {
  id: string
  type: BlockType
  html: string
  parent?: string
  index?: number
}

const setCursor = (el: HTMLElement) => {
  // Place the caret at the end of the element
  const target = document.createTextNode('')
  el?.appendChild(target)
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const sel = window.getSelection()
    if (sel !== null) {
      const range = document.createRange()
      range.setStart(target, target.nodeValue.length)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    el?.focus()
  }
}

export const editableBlockStyles = {
  p: 'relative',
  h1: 'text-4xl font-bold relative',
  h2: 'text-2xl font-bold relative',
  h3: 'text-lg font-bold relative',
}

export type EditableBlockProps = {
  id: string
  editable?: boolean
  html?: string
  type?: BlockType
  position: number
  onKeyDown?: (e: React.KeyboardEvent) => void
  onFocus?: (e: Event) => void
  onBlur?: (e: React.FocusEvent) => void
  onChange?: (e: React.ChangeEvent) => void
  onKeyUp?: (e: React.KeyboardEvent) => void
  onClick?: (e: React.MouseEvent) => void
  onFileDrop?: (acceptedFile: File[]) => void
  handleStopDrag?: (e: DraggableEvent) => void
  handleStartDrag?: (e: DraggableEvent) => void
  menu?: boolean
}

// eslint-disable-next-line react/display-name
const EditableBlock = ({
  id,
  editable = true,
  html,
  type = 'p',
  onKeyDown,
  onFocus,
  onBlur,
  onChange,
  onKeyUp,
  onClick,
  position,
  handleStopDrag,
  handleStartDrag,
}: EditableBlockProps) => {
  const ref = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && editable) {
      setCursor(ref.current)
    }
  })

  const [styles, api] = useSpring(() => {
    return { y: 0, scale: 1, zIndex: 1 }
  })

  const wrapperRef = useRef<null | HTMLDivElement>(null)

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <DraggableCore
          nodeRef={ref}
          onDrag={(e, data) => {
            api.start({
              y: ref.current
                ? data.y - (ref.current.getBoundingClientRect().height / 2 || 0)
                : data.y,
              scale: 1.02,
            })
            api.set({ zIndex: 5 })
          }}
          handle={'.handle'}
          offsetParent={wrapperRef.current || undefined}
          onStop={(e) => {
            console.log(e.type)
            api.set({ y: 0 })
            api.start({ scale: 1 })
            if (handleStopDrag) handleStopDrag(e)
          }}
          onStart={(e) => {
            if (handleStartDrag !== undefined) handleStartDrag(e)
          }}
        >
          <animated.div
            className="flex items-center"
            ref={ref}
            style={{ ...styles }}
          >
            {editable ? (
              <span className="text-xl h-6 md:h-3 w-6 md:w-3 mr-2 handle cursor-grab rotate-90 opacity-60 hover:opacity-100 transition-opacity">
                <FontAwesomeIcon icon={faGrip} />
              </span>
            ) : null}
            {React.createElement(type, {
              contentEditable: editable,
              id,
              dangerouslySetInnerHTML: {
                __html: DOMPurify.sanitize(html || ''),
              },
              className: `${
                editableBlockStyles[type]
              } px-2 py-1 rounded py-1 my-2 leading-relaxed ${
                editable
                  ? 'focus:ring-blue-500 focus:bg-blue-50 hover:bg-slate-50 transition flex-1'
                  : ''
              } z-10`,
              placeholder: editable ? 'Press "/" to add different block' : '',
              tabIndex: 0,
              onKeyDown,
              onFocus,
              onBlur,
              onInput: onChange,
              onClick,
              onKeyUp,
              position,
              // If we don't modify the onCopy event, user will copy the whole HTML node
              onCopy: (e: Event) => {
                e.preventDefault()
                const copyText = (e.target as Element).innerHTML
                navigator.clipboard.writeText(copyText)
              },
            })}
          </animated.div>
        </DraggableCore>
      </div>
    </>
  )
}

const areEqual = (
  prevProps: EditableBlockProps,
  nextProps: EditableBlockProps
) => {
  const el = document.querySelector(`#${prevProps.id}`) as HTMLElement | null
  if (!el) {
    return false
  }
  if (el.innerHTML !== nextProps.html) {
    return false
  }
  return (
    prevProps.position === nextProps.position &&
    prevProps.menu === nextProps.menu
  )
}

export default React.memo(EditableBlock, areEqual)
