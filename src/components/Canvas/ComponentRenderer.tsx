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

export function ComponentRenderer({ node, onSelect, selectedId }: Props) {
  const Component = componentMap[node.type]
  const isSelected = selectedId === node.id

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(node.id)
  }

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
      onClick={handleClick}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #1677ff' : undefined,
        outlineOffset: '1px',
        borderRadius: isSelected ? '2px' : undefined,
        cursor: 'pointer',
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
