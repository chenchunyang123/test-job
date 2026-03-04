export const COMPONENT_SPEC = `
组件类型和props：
container: {} (可含children)
text: {content}
heading: {content, level:1-6}
button: {text, variant:"primary"|"default"|"outline"|"danger"}
input: {placeholder, label?}
textarea: {placeholder, label?}
image: {src, alt} (用 https://placehold.co/宽x高 占位)
icon: {name}
card: {title?} (可含children)
list: {} (children为list-item)
list-item: {title, subtitle?, extra?}
navbar: {title, showBack?}
tab-bar: {items:[{label,icon?,active?}]}
form: {} (children为表单元素)
select: {placeholder, label?, options:[]}
checkbox: {label, checked?}
radio: {label, options:[]}
switch: {label, checked?}
badge: {text, color?}
divider: {text?}
avatar: {src?, name?}
tag: {text, color?}
`.trim()

export const SCHEMA_FORMAT = `
输出JSON格式：
{"id":"root","name":"名称","width":375,"height":812,"backgroundColor":"#fff","children":[{"id":"唯一ID","type":"组件类型","props":{...},"style":{驼峰CSS},"children":[...]}]}

style用React CSSProperties驼峰格式。尽量精简style，只写必要的样式属性。
`.trim()

export function getModifySystemPrompt(): string {
  return `你是UI原型图设计助手。根据用户指令修改JSON Schema并返回完整Schema。

${COMPONENT_SPEC}

${SCHEMA_FORMAT}

规则：只输出纯JSON，无其他文字。保持未改部分不变。每个节点要有唯一id。用flexbox布局。style只写必要属性，保持输出紧凑。`
}

export function getScreenshotSystemPrompt(): string {
  return `你是UI分析师。分析截图中的UI元素，生成原型图JSON Schema。

${COMPONENT_SPEC}

${SCHEMA_FORMAT}

规则：只输出纯JSON，无其他文字。还原截图的布局和颜色。用flexbox布局。每个节点有唯一id。图片用placehold.co占位。默认宽度375。style只写必要属性，保持输出紧凑，减少嵌套层级。`
}

export function buildModifyUserMessage(
  currentSchema: string,
  instruction: string,
): string {
  return `当前原型图的 Schema 是：
\`\`\`json
${currentSchema}
\`\`\`

请帮我：${instruction}`
}
