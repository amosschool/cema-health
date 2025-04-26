"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Program } from "@/lib/types"
import { useStore } from "@/lib/store"
import { Activity } from "lucide-react"

interface ProgramCardProps {
  program: Program
}

export function ProgramCard({ program }: ProgramCardProps) {
  const { clients } = useStore()

  const enrolledClients = clients.filter((client) => client.enrolledPrograms.includes(program.id))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{program.name}</h3>
              <p className="text-sm text-muted-foreground">Created on {formatDate(program.createdAt)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">{program.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Badge variant="outline">
            {enrolledClients.length} {enrolledClients.length === 1 ? "client" : "clients"}
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
