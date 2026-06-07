import { create } from 'zustand'
import api from '../lib/api'

const usePlotStore = create((set) => ({
  nodes: [],
  loading: false,

  fetchNodes: async (storyId) => {
    set({ loading: true })
    try {
      const { data } = await api.get(`/stories/${storyId}/plot`)
      set({ nodes: data, loading: false })
    } catch { set({ loading: false }) }
  },

  createNode: async (storyId, payload) => {
    try {
      const { data } = await api.post(`/stories/${storyId}/plot`, payload)
      set((s) => ({ nodes: [...s.nodes, data] }))
      return data
    } catch {}
  },

  updateNode: async (storyId, id, payload) => {
    try {
      const { data } = await api.put(`/stories/${storyId}/plot/${id}`, payload)
      set((s) => ({ nodes: s.nodes.map((n) => (n._id === id ? data : n)) }))
      return data
    } catch {}
  },

  deleteNode: async (storyId, id) => {
    try {
      await api.delete(`/stories/${storyId}/plot/${id}`)
      set((s) => ({ nodes: s.nodes.filter((n) => n._id !== id) }))
    } catch {}
  },

  reorderNodes: async (storyId, orderedIds) => {
    try {
      await api.post(`/stories/${storyId}/plot/reorder`, { orderedIds })
    } catch {}
  },

  setNodesLocal: (nodes) => set({ nodes }),
  clearNodes: () => set({ nodes: [] }),
}))

export default usePlotStore
