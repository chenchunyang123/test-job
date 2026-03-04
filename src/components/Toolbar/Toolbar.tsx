import { Button, Tooltip, Select, InputNumber, Space, Divider } from 'antd'
import {
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from '@ant-design/icons'
import { useSchemaStore } from '../../store/useSchemaStore'

const presets = [
  { label: 'iPhone', icon: <MobileOutlined />, width: 375, height: 812 },
  { label: 'Android', icon: <MobileOutlined />, width: 360, height: 800 },
  { label: 'iPad', icon: <TabletOutlined />, width: 768, height: 1024 },
  { label: 'Desktop', icon: <DesktopOutlined />, width: 1440, height: 900 },
]

export function Toolbar() {
  const { schema, updateSchema, undo, redo, canUndo, canRedo, resetSchema } =
    useSchemaStore()

  const handlePresetChange = (value: string) => {
    const preset = presets.find((p) => p.label === value)
    if (preset) {
      updateSchema({
        ...schema,
        width: preset.width,
        height: preset.height,
      })
    }
  }

  const handleWidthChange = (value: number | null) => {
    if (value && value > 0) {
      updateSchema({ ...schema, width: value })
    }
  }

  const handleHeightChange = (value: number | null) => {
    if (value && value > 0) {
      updateSchema({ ...schema, height: value })
    }
  }

  return (
    <div
      style={{
        height: '48px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1677ff, #722ed1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ProtoAI
        </span>
        <span style={{ color: '#bbb', fontSize: '12px' }}>原型图设计工具</span>
      </div>

      <Space split={<Divider type="vertical" />}>
        <Space size={4}>
          <Tooltip title="撤销">
            <Button
              size="small"
              type="text"
              icon={<UndoOutlined />}
              disabled={!canUndo()}
              onClick={undo}
            />
          </Tooltip>
          <Tooltip title="重做">
            <Button
              size="small"
              type="text"
              icon={<RedoOutlined />}
              disabled={!canRedo()}
              onClick={redo}
            />
          </Tooltip>
        </Space>

        <Space size={4}>
          <Select
            size="small"
            placeholder="预设尺寸"
            style={{ width: 120 }}
            options={presets.map((p) => ({
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {p.icon} {p.label} ({p.width}x{p.height})
                </span>
              ),
              value: p.label,
            }))}
            onChange={handlePresetChange}
          />
          <InputNumber
            size="small"
            style={{ width: 70 }}
            value={schema.width}
            onChange={handleWidthChange}
            min={200}
            max={2560}
          />
          <span style={{ color: '#999', fontSize: '12px' }}>×</span>
          <InputNumber
            size="small"
            style={{ width: 70 }}
            value={schema.height}
            onChange={handleHeightChange}
            min={200}
            max={4000}
          />
        </Space>

        <Tooltip title="清空画布">
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={resetSchema}
          />
        </Tooltip>
      </Space>
    </div>
  )
}
