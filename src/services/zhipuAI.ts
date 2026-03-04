import type { PrototypeSchema } from '../types/schema'
import {
  getModifySystemPrompt,
  getScreenshotSystemPrompt,
  buildModifyUserMessage,
} from './prompts'
import { parseSchemaFromAIResponse } from '../utils/schemaHelpers'

const API_BASE = '/api/zhipu/api/paas/v4/chat/completions'

function getApiKey(): string {
  return import.meta.env.VITE_ZHIPU_API_KEY || ''
}

interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | ZhipuContentPart[]
}

type ZhipuContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

function parseSSELines(chunk: string): string[] {
  const contents: string[] = []
  const lines = chunk.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.startsWith('data:')) continue

    const data = trimmed.slice(5).trim()
    if (data === '[DONE]') continue

    try {
      const parsed = JSON.parse(data)
      const delta = parsed.choices?.[0]?.delta?.content
      if (delta) contents.push(delta)
    } catch {
      // incomplete JSON chunk, skip
    }
  }

  return contents
}

export type OnProgressCallback = (receivedChars: number) => void

async function callZhipuAPI(
  messages: ZhipuMessage[],
  model = 'glm-4-flash',
  onProgress?: OnProgressCallback,
): Promise<string> {
  const isVisionModel = model.includes('4v')

  const requestBody: Record<string, unknown> = {
    model,
    messages,
    stream: true,
  }

  if (isVisionModel) {
    requestBody.max_tokens = 1024
  } else {
    requestBody.temperature = 0.1
    requestBody.max_tokens = 4095
  }

  console.log('[ZhipuAI] 请求模型:', model, '(流式)')

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    let errorMsg = `API 调用失败 (${response.status})`
    try {
      const errorData = JSON.parse(errorText)
      if (errorData.error) {
        errorMsg = `API 错误 (${errorData.error.code}): ${errorData.error.message}`
      }
    } catch {
      errorMsg += `: ${errorText.slice(0, 200)}`
    }
    throw new Error(errorMsg)
  }

  if (!response.body) {
    throw new Error('浏览器不支持流式响应')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullContent = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const parts = buffer.split('\n\n')
    buffer = parts.pop() || ''

    for (const part of parts) {
      const contents = parseSSELines(part)
      for (const c of contents) {
        fullContent += c
        onProgress?.(fullContent.length)
      }
    }
  }

  // Process remaining buffer
  if (buffer.trim()) {
    const contents = parseSSELines(buffer)
    for (const c of contents) {
      fullContent += c
      onProgress?.(fullContent.length)
    }
  }

  console.log('[ZhipuAI] 流式接收完成，总长度:', fullContent.length, '字符')

  return fullContent
}

export async function modifySchema(
  currentSchema: PrototypeSchema,
  instruction: string,
  onProgress?: OnProgressCallback,
): Promise<PrototypeSchema> {
  const messages: ZhipuMessage[] = [
    { role: 'system', content: getModifySystemPrompt() },
    {
      role: 'user',
      content: buildModifyUserMessage(
        JSON.stringify(currentSchema),
        instruction,
      ),
    },
  ]

  const responseText = await callZhipuAPI(messages, 'glm-4-flash', onProgress)
  const parsed = parseSchemaFromAIResponse(responseText)

  if (!parsed) {
    throw new Error('AI 返回的内容无法解析为有效的 Schema。AI 原始回复：' + responseText.slice(0, 200))
  }

  return parsed
}

export async function screenshotToSchema(
  imageBase64: string,
  onProgress?: OnProgressCallback,
): Promise<PrototypeSchema> {
  const systemPrompt = getScreenshotSystemPrompt()

  const messages: ZhipuMessage[] = [
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: { url: imageBase64 },
        },
        {
          type: 'text',
          text: `${systemPrompt}\n\n请分析这张 UI 截图，生成对应的原型图 Schema。`,
        },
      ],
    },
  ]

  const responseText = await callZhipuAPI(messages, 'glm-4v-flash', onProgress)
  const parsed = parseSchemaFromAIResponse(responseText)

  if (!parsed) {
    throw new Error('AI 无法从截图中生成有效的 Schema。AI 原始回复：' + responseText.slice(0, 200))
  }

  return parsed
}
