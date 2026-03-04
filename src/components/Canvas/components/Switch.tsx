import type { ComponentNode } from '../../../types/schema'

interface Props {
  node: ComponentNode
}

export function Switch({ node }: Props) {
  const label = (node.props.label as string) || ''
  const checked = node.props.checked as boolean | undefined

  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        ...node.style,
      }}
    >
      <span>{label}</span>
      <div
        style={{
          width: '44px',
          height: '22px',
          borderRadius: '11px',
          backgroundColor: checked ? '#1677ff' : '#ccc',
          position: 'relative',
          transition: 'background-color 0.2s',
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            position: 'absolute',
            top: '2px',
            left: checked ? '24px' : '2px',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
    </label>
  )
}
