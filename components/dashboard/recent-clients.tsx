"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store"
import type { Client } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function RecentClients() {
  const { clients } = useStore()
  const [recentClients, setRecentClients] = useState<Client[]>([])

  useEffect(() => {
    // Sort clients by creation date (newest first) and take the first 5
    const sorted = [...clients]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)

    setRecentClients(sorted)
  }, [clients])

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-sm text-muted-foreground">No clients registered yet</p>
        <Button variant="link" asChild>
          <Link href="/clients">Register a client</Link>
        </Button>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      {recentClients.map((client, index) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{client.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {client.age} years • {client.gender}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{formatDate(client.createdAt)}</p>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/clients/${client.id}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      ))}
      {clients.length > 5 && (
        <Button variant="link" className="w-full" asChild>
          <Link href="/clients">View all clients</Link>
        </Button>
      )}
    </div>
  )
}
