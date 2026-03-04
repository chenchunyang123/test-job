import { create } from 'zustand'
import { produce } from 'immer'
import type { ComponentNode, PrototypeSchema } from '../types/schema'
import { DEFAULT_SCHEMA } from '../types/schema'

function findAndUpdateNode(
  nodes: ComponentNode[],
  id: string,
  updater: (node: ComponentNode) => void,
): boolean {
  for (const node of nodes) {
    if (node.id === id) {
      updater(node)
      return true
    }
    if (node.children && findAndUpdateNode(node.children, id, updater)) {
      return true
    }
  }
  return false
}

interface SchemaState {
  schema: PrototypeSchema
  history: PrototypeSchema[]
  historyIndex: number
  selectedNodeId: string | null

  setSchema: (schema: PrototypeSchema) => void
  updateSchema: (schema: PrototypeSchema) => void
  moveNode: (id: string, left: number, top: number) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  selectNode: (id: string | null) => void
  resetSchema: () => void
}

const MAX_HISTORY = 50

export const useSchemaStore = create<SchemaState>((set, get) => ({
  schema: DEFAULT_SCHEMA,
  history: [DEFAULT_SCHEMA],
  historyIndex: 0,
  selectedNodeId: null,

  setSchema: (schema) => {
    set({ schema, history: [schema], historyIndex: 0 })
  },

  updateSchema: (schema) => {
    set(
      produce((state: SchemaState) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push(schema)
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift()
        }
        state.schema = schema
        state.history = newHistory
        state.historyIndex = newHistory.length - 1
      }),
    )
  },

  moveNode: (id, left, top) => {
    set(
      produce((state: SchemaState) => {
        findAndUpdateNode(state.schema.children, id, (node) => {
          node.style = { ...node.style, left, top }
        })
        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push(JSON.parse(JSON.stringify(state.schema)))
        if (newHistory.length > MAX_HISTORY) {
          newHistory.shift()
        }
        state.history = newHistory
        state.historyIndex = newHistory.length - 1
      }),
    )
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      set({ schema: history[newIndex], historyIndex: newIndex })
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      set({ schema: history[newIndex], historyIndex: newIndex })
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  selectNode: (id) => set({ selectedNodeId: id }),

  resetSchema: () => {
    set({ schema: DEFAULT_SCHEMA, history: [DEFAULT_SCHEMA], historyIndex: 0, selectedNodeId: null })
  },
}))
