"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Client } from "@/lib/types"
import { useStore } from "@/lib/store"
import { ChevronRight, User2 } from "lucide-react"

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  const { programs } = useStore()

  const clientPrograms = programs.filter((program) => client.enrolledPrograms.includes(program.id))

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold line-clamp-1">{client.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {client.age} years • {client.gender}
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p className="text-sm line-clamp-1">{client.contactInfo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Programs</p>
              <div className="flex flex-wrap gap-1 pt-1 max-h-12 overflow-hidden">
                {clientPrograms.length > 0 ? (
                  clientPrograms.map((program) => (
                    <Badge key={program.id} variant="secondary" className="line-clamp-1">
                      {program.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No programs</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <Link href={`/clients/${client.id}`}>
              View Profile
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
