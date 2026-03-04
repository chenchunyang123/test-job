import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Icon({ node }: Props) {
  const name = (node.props.name as string) || '★'
  const size = (node.props.size as number) || 24

  return (
    <span
      style={{
        fontSize: size,
        lineHeight: 1,
        ...node.style,
      }}
    >
      {name}
    </span>
  )
}
