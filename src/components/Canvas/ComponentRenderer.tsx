import { useState, useCallback, useRef, useEffect } from 'react'
import type { ComponentNode } from '../../types/schema'
import { Container } from './components/Container'
import { Text } from './components/Text'
import { Heading } from './components/Heading'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { TextArea } from './components/TextArea'
import { ImageComp } from './components/ImageComp'
import { Icon } from './components/Icon'
import { Card } from './components/Card'
import { ListComp } from './components/ListComp'
import { ListItem } from './components/ListItem'
import { NavBar } from './components/NavBar'
import { TabBar } from './components/TabBar'
import { FormComp } from './components/FormComp'
import { Select } from './components/Select'
import { Checkbox } from './components/Checkbox'
import { Radio } from './components/Radio'
import { Switch } from './components/Switch'
import { Badge } from './components/Badge'
import { Divider } from './components/Divider'
import { Avatar } from './components/Avatar'
import { Tag } from './components/Tag'

interface Props {
  node: ComponentNode
  onSelect?: (id: string) => void
  selectedId?: string | null
  onNodeMove?: (id: string, left: number, top: number) => void
  onDragStateChange?: (dragging: boolean) => void
  getScale?: () => number
}

const componentMap: Record<
  string,
  React.FC<{ node: ComponentNode; onSelect?: (id: string) => void; selectedId?: string | null }>
> = {
  container: Container,
  text: Text,
  heading: Heading,
  button: Button,
  input: Input,
  textarea: TextArea,
  image: ImageComp,
  icon: Icon,
  card: Card,
  list: ListComp,
  'list-item': ListItem,
  navbar: NavBar,
  'tab-bar': TabBar,
  form: FormComp,
  select: Select,
  checkbox: Checkbox,
  radio: Radio,
  switch: Switch,
  badge: Badge,
  divider: Divider,
  avatar: Avatar,
  tag: Tag,
}

export function ComponentRenderer({
  node,
  onSelect,
  selectedId,
  onNodeMove,
  onDragStateChange,
  getScale,
}: Props) {
  const Component = componentMap[node.type]
  const isSelected = selectedId === node.id

  const nodeLeft = typeof node.style.left === 'number' ? node.style.left : parseFloat(String(node.style.left)) || 0
  const nodeTop = typeof node.style.top === 'number' ? node.style.top : parseFloat(String(node.style.top)) || 0

  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const isDragging = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      onSelect?.(node.id)

      isDragging.current = true
      startMouse.current = { x: e.clientX, y: e.clientY }
      startPos.current = { x: nodeLeft, y: nodeTop }
      setDragOffset({ x: 0, y: 0 })
      onDragStateChange?.(true)
    },
    [node.id, nodeLeft, nodeTop, onSelect, onDragStateChange],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const s = getScale?.() ?? 1
      const dx = (e.clientX - startMouse.current.x) / s
      const dy = (e.clientY - startMouse.current.y) / s
      setDragOffset({ x: dx, y: dy })
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return
      isDragging.current = false

      const s = getScale?.() ?? 1
      const dx = (e.clientX - startMouse.current.x) / s
      const dy = (e.clientY - startMouse.current.y) / s
      const finalLeft = Math.round(startPos.current.x + dx)
      const finalTop = Math.round(startPos.current.y + dy)

      setDragOffset(null)
      onDragStateChange?.(false)

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        onNodeMove?.(node.id, finalLeft, finalTop)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [node.id, getScale, onNodeMove, onDragStateChange])

  const displayLeft = dragOffset ? startPos.current.x + dragOffset.x : nodeLeft
  const displayTop = dragOffset ? startPos.current.y + dragOffset.y : nodeTop

  const content = Component ? (
    <Component node={node} onSelect={onSelect} selectedId={selectedId} />
  ) : (
    <div
      style={{
        padding: '8px',
        border: '1px dashed #ccc',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#999',
        ...node.style,
      }}
    >
      未知组件: {node.type}
    </div>
  )

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: displayLeft,
        top: displayTop,
        cursor: dragOffset ? 'grabbing' : 'grab',
        outline: isSelected ? '2px solid #1677ff' : undefined,
        outlineOffset: '1px',
        borderRadius: isSelected ? '2px' : undefined,
        userSelect: 'none',
        zIndex: isSelected ? 10 : undefined,
      }}
    >
      {content}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '-18px',
            left: '0',
            fontSize: '10px',
            color: '#fff',
            backgroundColor: '#1677ff',
            padding: '1px 6px',
            borderRadius: '2px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {node.type} #{node.id}
        </div>
      )}
    </div>
  )
}
