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

async function callZhipuAPI(
  messages: ZhipuMessage[],
  model = 'glm-4-flash',
): Promise<string> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.1,
      top_p: 0.7,
      max_tokens: 4095,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 调用失败 (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(`API 错误: ${data.error.message || JSON.stringify(data.error)}`)
  }

  return data.choices?.[0]?.message?.content || ''
}

export async function modifySchema(
  currentSchema: PrototypeSchema,
  instruction: string,
): Promise<PrototypeSchema> {
  const messages: ZhipuMessage[] = [
    { role: 'system', content: getModifySystemPrompt() },
    {
      role: 'user',
      content: buildModifyUserMessage(
        JSON.stringify(currentSchema, null, 2),
        instruction,
      ),
    },
  ]

  const responseText = await callZhipuAPI(messages, 'glm-4-flash')
  const parsed = parseSchemaFromAIResponse(responseText)

  if (!parsed) {
    throw new Error('AI 返回的内容无法解析为有效的 Schema。AI 原始回复：' + responseText.slice(0, 200))
  }

  return parsed
}

export async function screenshotToSchema(
  imageBase64: string,
): Promise<PrototypeSchema> {
  // glm-4v-flash 不支持 system 角色，将 system prompt 合并到 user 消息中
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

  const responseText = await callZhipuAPI(messages, 'glm-4v-flash')
  const parsed = parseSchemaFromAIResponse(responseText)

  if (!parsed) {
    throw new Error('AI 无法从截图中生成有效的 Schema。AI 原始回复：' + responseText.slice(0, 200))
  }

  return parsed
}
