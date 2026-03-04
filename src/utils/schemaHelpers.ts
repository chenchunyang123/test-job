import { v4 as uuidv4 } from 'uuid'
import type { ComponentNode, PrototypeSchema } from '../types/schema'

export function generateId(): string {
  return uuidv4().slice(0, 8)
}

export function findNodeById(
  nodes: ComponentNode[],
  id: string,
): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNodeById(node.children, id)
      if (found) return found
    }
  }
  return null
}

function tryRepairAndParseJSON(jsonStr: string): unknown | null {
  try {
    return JSON.parse(jsonStr)
  } catch {
    // JSON 被截断时尝试修复：补全缺失的括号
  }

  let repaired = jsonStr
    .replace(/,\s*$/, '')       // 去掉末尾多余逗号
    .replace(/,\s*([}\]])/g, '$1') // 去掉 } 或 ] 前的逗号

  // 统计未闭合的括号并补全
  const stack: string[] = []
  let inString = false
  let escape = false

  for (const ch of repaired) {
    if (escape) { escape = false; continue }
    if (ch === '\\') { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === '{' || ch === '[') stack.push(ch)
    if (ch === '}') { if (stack.length && stack[stack.length - 1] === '{') stack.pop() }
    if (ch === ']') { if (stack.length && stack[stack.length - 1] === '[') stack.pop() }
  }

  // 反向补全
  while (stack.length) {
    const open = stack.pop()
    repaired += open === '{' ? '}' : ']'
  }

  try {
    return JSON.parse(repaired)
  } catch {
    return null
  }
}

export function parseSchemaFromAIResponse(text: string): PrototypeSchema | null {
  try {
    // 尝试匹配 ```json ... ``` 代码块（可能不完整）
    const jsonMatch = text.match(/```json\s*([\s\S]*?)(?:```|$)/)
    const raw = jsonMatch ? jsonMatch[1].trim() : text.trim()

    const startIdx = raw.indexOf('{')
    if (startIdx === -1) return null

    const jsonStr = raw.slice(startIdx)
    const parsed = tryRepairAndParseJSON(jsonStr) as Record<string, unknown> | null

    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.children) parsed.children = []
    if (!Array.isArray(parsed.children)) return null
    if (!parsed.id) parsed.id = 'root'
    if (!parsed.name) parsed.name = '未命名原型'
    if (!parsed.width) parsed.width = 375
    if (!parsed.height) parsed.height = 812
    if (!parsed.backgroundColor) parsed.backgroundColor = '#ffffff'

    return parsed as unknown as PrototypeSchema
  } catch {
    return null
  }
}

export function ensureNodeIds(node: ComponentNode): ComponentNode {
  return {
    ...node,
    id: node.id || generateId(),
    children: node.children?.map(ensureNodeIds),
  }
}

export function validateSchema(schema: unknown): schema is PrototypeSchema {
  if (!schema || typeof schema !== 'object') return false
  const s = schema as Record<string, unknown>
  return (
    typeof s.width === 'number' &&
    typeof s.height === 'number' &&
    Array.isArray(s.children)
  )
}
