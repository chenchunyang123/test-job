import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Heading({ node }: Props) {
  const content = (node.props.content as string) || ''
  const level = (node.props.level as number) || 2
  const Tag = `h${Math.min(Math.max(level, 1), 6)}` as keyof JSX.IntrinsicElements
  return <Tag style={{ margin: 0, ...node.style }}>{content}</Tag>
}
