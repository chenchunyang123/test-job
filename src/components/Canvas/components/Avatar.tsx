import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Avatar({ node }: Props) {
  const src = node.props.src as string | undefined
  const name = (node.props.name as string) || ''
  const size = (node.props.size as number) || 40

  const initials = name.slice(0, 2).toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          ...node.style,
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#1677ff',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        ...node.style,
      }}
    >
      {initials || '?'}
    </div>
  )
}
