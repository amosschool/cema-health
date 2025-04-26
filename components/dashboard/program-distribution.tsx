"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface ProgramStat {
  id: string
  name: string
  count: number
  percentage: number
}

export function ProgramDistribution() {
  const { clients, programs } = useStore()
  const [programStats, setProgramStats] = useState<ProgramStat[]>([])

  useEffect(() => {
    if (programs.length === 0 || clients.length === 0) {
      setProgramStats([])
      return
    }

    // Calculate enrollment counts for each program
    const stats = programs.map((program) => {
      const enrolledCount = clients.filter((client) => client.enrolledPrograms.includes(program.id)).length

      return {
        id: program.id,
        name: program.name,
        count: enrolledCount,
        percentage: clients.length > 0 ? (enrolledCount / clients.length) * 100 : 0,
      }
    })

    // Sort by enrollment count (highest first)
    stats.sort((a, b) => b.count - a.count)

    setProgramStats(stats)
  }, [clients, programs])

  if (programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-sm text-muted-foreground">No health programs created yet</p>
        <Button variant="link" asChild>
          <Link href="/programs">Create a program</Link>
        </Button>
      </div>
    )
  }

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

  return (
    <div className="space-y-4">
      {programStats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <p className="font-medium">{stat.name}</p>
            <p className="text-sm text-muted-foreground">
              {stat.count} {stat.count === 1 ? "client" : "clients"} ({Math.round(stat.percentage)}%)
            </p>
          </div>
          <Progress value={stat.percentage} className="h-2" />
        </motion.div>
      ))}
      <Button variant="link" className="w-full" asChild>
        <Link href="/programs">View all programs</Link>
      </Button>
    </div>
  )
}
