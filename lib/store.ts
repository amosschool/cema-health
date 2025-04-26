"use client"

import { create } from "zustand"
import type { Client, Program } from "./types"

// Sample data for initial state
const samplePrograms: Program[] = [
  {
    id: "p1",
    name: "TB Prevention",
    description: "Tuberculosis prevention and treatment program",
    createdAt: "2023-01-15T08:00:00.000Z",
  },
  {
    id: "p2",
    name: "Malaria Control",
    description: "Malaria prevention and control initiatives",
    createdAt: "2023-02-20T10:30:00.000Z",
  },
  {
    id: "p3",
    name: "HIV/AIDS Support",
    description: "Comprehensive HIV/AIDS support and treatment",
    createdAt: "2023-03-10T14:15:00.000Z",
  },
]

const sampleClients: Client[] = [
  {
    id: "c1",
    fullName: "John Smith",
    gender: "male",
    age: 45,
    contactInfo: "+1 (555) 123-4567",
    enrolledPrograms: ["p1", "p3"],
    createdAt: "2023-04-05T09:20:00.000Z",
  },
  {
    id: "c2",
    fullName: "Maria Garcia",
    gender: "female",
    age: 32,
    contactInfo: "maria.g@example.com",
    enrolledPrograms: ["p2"],
    createdAt: "2023-04-10T11:45:00.000Z",
  },
  {
    id: "c3",
    fullName: "David Johnson",
    gender: "male",
    age: 58,
    contactInfo: "+1 (555) 987-6543",
    enrolledPrograms: ["p1"],
    createdAt: "2023-04-15T14:30:00.000Z",
  },
  {
    id: "c4",
    fullName: "Sarah Williams",
    gender: "female",
    age: 27,
    contactInfo: "sarah.w@example.com",
    enrolledPrograms: [],
    createdAt: "2023-04-20T16:15:00.000Z",
  },
]

interface StoreState {
  clients: Client[]
  programs: Program[]
  addClient: (client: Client) => void
  updateClient: (client: Client) => void
  removeClient: (id: string) => void
  addProgram: (program: Program) => void
  updateProgram: (program: Program) => void
  removeProgram: (id: string) => void
  resetStore: () => void
  initializeStore: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  clients: [],
  programs: [],

  addClient: (client: Client) => {
    set((state) => ({
      clients: [...state.clients, client],
    }))
    localStorage.setItem("cema-clients", JSON.stringify(get().clients))
  },

  updateClient: (client: Client) => {
    set((state) => ({
      clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    }))
    localStorage.setItem("cema-clients", JSON.stringify(get().clients))
  },

  removeClient: (id: string) => {
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }))
    localStorage.setItem("cema-clients", JSON.stringify(get().clients))
  },

  addProgram: (program: Program) => {
    set((state) => ({
      programs: [...state.programs, program],
    }))
    localStorage.setItem("cema-programs", JSON.stringify(get().programs))
  },

  updateProgram: (program: Program) => {
    set((state) => ({
      programs: state.programs.map((p) => (p.id === program.id ? program : p)),
    }))
    localStorage.setItem("cema-programs", JSON.stringify(get().programs))
  },

  removeProgram: (id: string) => {
    set((state) => ({
      programs: state.programs.filter((p) => p.id !== id),
      clients: state.clients.map((client) => ({
        ...client,
        enrolledPrograms: client.enrolledPrograms.filter((programId) => programId !== id),
      })),
    }))
    localStorage.setItem("cema-programs", JSON.stringify(get().programs))
    localStorage.setItem("cema-clients", JSON.stringify(get().clients))
  },

  resetStore: () => {
    set({
      clients: [],
      programs: [],
    })
    localStorage.removeItem("cema-clients")
    localStorage.removeItem("cema-programs")
  },

  initializeStore: () => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      const storedClients = localStorage.getItem("cema-clients")
      const storedPrograms = localStorage.getItem("cema-programs")

      // If no data in localStorage, use sample data
      const clients = storedClients ? JSON.parse(storedClients) : sampleClients
      const programs = storedPrograms ? JSON.parse(storedPrograms) : samplePrograms

      set({ clients, programs })
    } catch (error) {
      console.error("Error initializing store:", error)
      set({ clients: sampleClients, programs: samplePrograms })
    }
  },
}))
