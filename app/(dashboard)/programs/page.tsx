"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { ProgramCard } from "@/components/programs/program-card"
import { ProgramForm } from "@/components/programs/program-form"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/empty-state"

export default function ProgramsPage() {
  const { programs, initializeStore } = useStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Health Programs</h1>
          <p className="text-muted-foreground">Manage your health programs and initiatives</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          placeholder="Search programs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {programs.length === 0 ? (
        <EmptyState
          title="No programs yet"
          description="Create your first health program to get started"
          action={
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          }
        />
      ) : filteredPrograms.length === 0 ? (
        <EmptyState title="No matching programs" description="Try a different search term" />
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ProgramForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}
