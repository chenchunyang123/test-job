import type { CSSProperties } from 'react'
import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

const variantStyles: Record<string, CSSProperties> = {
  primary: {
    backgroundColor: '#1677ff',
    color: '#fff',
    border: 'none',
  },
  default: {
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #d9d9d9',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#1677ff',
    border: '1px solid #1677ff',
  },
  text: {
    backgroundColor: 'transparent',
    color: '#1677ff',
    border: 'none',
  },
  danger: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
  },
}

export function Button({ node }: Props) {
  const text = (node.props.text as string) || 'Button'
  const variant = (node.props.variant as string) || 'primary'

  return (
    <button
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        ...variantStyles[variant],
        ...node.style,
      }}
    >
      {text}
    </button>
  )
}
