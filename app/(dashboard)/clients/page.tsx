"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { ClientCard } from "@/components/clients/client-card"
import { ClientForm } from "@/components/clients/client-form"
import { EmptyState } from "@/components/empty-state"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ClientsPage() {
  const { clients, programs, initializeStore } = useStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [programFilter, setProgramFilter] = useState("all")

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProgram =
      programFilter === "all" ||
      (programFilter === "none" && client.enrolledPrograms.length === 0) ||
      client.enrolledPrograms.includes(programFilter)

    return matchesSearch && matchesProgram
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client records and enrollments</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Register Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <Select value={programFilter} onValueChange={setProgramFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            <SelectItem value="none">No Programs</SelectItem>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Register your first client to get started"
          action={
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Register Client
            </Button>
          }
        />
      ) : filteredClients.length === 0 ? (
        <EmptyState title="No matching clients" description="Try a different search term or filter" />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ClientCard client={client} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ClientForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}
