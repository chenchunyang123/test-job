export const COMPONENT_SPEC = `
type只能是以下值之一：container,text,heading,button,input,textarea,image,icon,card,list,list-item,navbar,tab-bar,form,select,checkbox,radio,switch,badge,divider,avatar,tag

各type的props：
container:{} text:{content} heading:{content,level} button:{text,variant} input:{placeholder,label?} textarea:{placeholder,label?} image:{src,alt} icon:{name} card:{title?} list:{} list-item:{title,subtitle?,extra?} navbar:{title,showBack?} tab-bar:{items:[{label,icon?,active?}]} form:{} select:{placeholder,label?,options:[]} checkbox:{label} radio:{label,options:[]} switch:{label} badge:{text,color?} divider:{text?} avatar:{src?,name?} tag:{text,color?}
`.trim()

export const SCHEMA_FORMAT = `
所有组件使用绝对定位，style中必须包含left和top（数字，表示像素坐标）来指定组件在画布上的位置。

输出格式示例（必须是单行压缩JSON，不要换行不要缩进）：
{"id":"root","name":"页面","width":375,"height":812,"backgroundColor":"#fff","children":[{"id":"n1","type":"navbar","props":{"title":"首页"},"style":{"left":0,"top":0,"width":375}},{"id":"n2","type":"text","props":{"content":"你好"},"style":{"left":16,"top":60,"padding":"8px"}}]}
`.trim()

const COMMON_RULES = `严格规则：
1. 只输出单行压缩JSON，不要\`\`\`json标记，不要换行，不要缩进，不要任何多余文字
2. type只能用上面列出的值，禁止用div/span/section等HTML标签
3. style必须包含left和top数字值指定位置，用驼峰格式
4. id用简短字符如n1,n2,n3
5. 设计保持简洁，总组件数不超过20个
6. 合理排布组件位置，避免重叠`

export function getModifySystemPrompt(): string {
  return `你是UI原型图设计助手。修改JSON Schema并返回完整Schema。

${COMPONENT_SPEC}

${SCHEMA_FORMAT}

${COMMON_RULES}
7. 保持未改部分不变`
}

export function getScreenshotSystemPrompt(): string {
  return `你是UI分析师。分析截图中的UI元素，生成原型图JSON Schema。

${COMPONENT_SPEC}

${SCHEMA_FORMAT}

${COMMON_RULES}
7. 图片src用 https://placehold.co/宽x高 占位
8. 只还原主要UI元素，忽略细节装饰`
}

export function buildModifyUserMessage(
  currentSchema: string,
  instruction: string,
): string {
  return `当前Schema：${currentSchema}
修改要求：${instruction}`
}
