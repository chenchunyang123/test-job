import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function ImageComp({ node }: Props) {
  const src = (node.props.src as string) || 'https://placehold.co/200x150/e2e8f0/64748b?text=Image'
  const alt = (node.props.alt as string) || 'image'

  return (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: '100%',
        objectFit: 'cover',
        borderRadius: '4px',
        ...node.style,
      }}
    />
  )
}
