import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Checkbox({ node }: Props) {
  const label = (node.props.label as string) || ''
  const checked = node.props.checked as boolean | undefined

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        ...node.style,
      }}
    >
      <input type="checkbox" defaultChecked={checked} readOnly />
      <span>{label}</span>
    </label>
  )
}
