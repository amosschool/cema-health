"use client"

import type { Client } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ApiModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client
}

export function ApiModal({ isOpen, onClose, client }: ApiModalProps) {
  // Create a mock API response
  const apiResponse = {
    id: client.id,
    fullName: client.fullName,
    gender: client.gender,
    age: client.age,
    contactInfo: client.contactInfo,
    enrolledPrograms: client.enrolledPrograms,
    createdAt: client.createdAt,
    updatedAt: new Date().toISOString(),
    _links: {
      self: `/api/clients/${client.id}`,
      programs: `/api/clients/${client.id}/programs`,
      update: `/api/clients/${client.id}`,
      delete: `/api/clients/${client.id}`,
    },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Response</DialogTitle>
          <DialogDescription>This is a simulated API response for client ID: {client.id}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-muted p-4">
          <pre className="text-sm overflow-auto max-h-[400px]">{JSON.stringify(apiResponse, null, 2)}</pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}
