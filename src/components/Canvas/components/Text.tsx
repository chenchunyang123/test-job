import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Text({ node }: Props) {
  const content = (node.props.content as string) || ''
  return <span style={node.style}>{content}</span>
}
