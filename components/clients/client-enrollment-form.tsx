"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import type { Client } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface ClientEnrollmentFormProps {
  isOpen: boolean
  onClose: () => void
  client: Client
}

export function ClientEnrollmentForm({ isOpen, onClose, client }: ClientEnrollmentFormProps) {
  const { programs, updateClient } = useStore()
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(client.enrolledPrograms)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms((prev) => {
      if (prev.includes(programId)) {
        return prev.filter((id) => id !== programId)
      } else {
        return [...prev, programId]
      }
    })
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      updateClient({
        ...client,
        enrolledPrograms: selectedPrograms,
      })

      toast({
        title: "Enrollments updated",
        description: `${client.fullName}'s program enrollments have been updated.`,
      })

      setIsSubmitting(false)
      onClose()
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Program Enrollments</DialogTitle>
          <DialogDescription>Select the health programs for {client.fullName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {programs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">No health programs available. Create programs first.</p>
            </div>
          ) : (
            programs.map((program) => (
              <div key={program.id} className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id={program.id}
                    checked={selectedPrograms.includes(program.id)}
                    onCheckedChange={() => handleProgramToggle(program.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={program.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {program.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </div>
                </div>
                <Separator />
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSubmitting ? "submitting" : "idle"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Button onClick={handleSubmit} disabled={isSubmitting || programs.length === 0}>
                {isSubmitting ? "Saving..." : "Save Enrollments"}
              </Button>
            </motion.div>
          </AnimatePresence>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
