import type { CSSProperties } from 'react'

export type ComponentType =
  | 'container'
  | 'text'
  | 'heading'
  | 'button'
  | 'input'
  | 'textarea'
  | 'image'
  | 'icon'
  | 'card'
  | 'list'
  | 'list-item'
  | 'navbar'
  | 'tab-bar'
  | 'form'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'badge'
  | 'divider'
  | 'avatar'
  | 'tag'

export interface ComponentNode {
  id: string
  type: ComponentType
  props: Record<string, unknown>
  style: CSSProperties
  children?: ComponentNode[]
}

export interface PrototypeSchema {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string
  children: ComponentNode[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  image?: string
  timestamp: number
}

export const DEFAULT_SCHEMA: PrototypeSchema = {
  id: 'root',
  name: '未命名原型',
  width: 375,
  height: 812,
  backgroundColor: '#ffffff',
  children: [],
}
