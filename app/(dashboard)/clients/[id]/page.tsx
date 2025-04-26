"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Edit, Trash2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { ClientEnrollmentForm } from "@/components/clients/client-enrollment-form"
import { ClientForm } from "@/components/clients/client-form"
import { ApiModal } from "@/components/api-modal"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

export default function ClientProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { clients, programs, removeClient, initializeStore } = useStore()
  const [isEnrollmentFormOpen, setIsEnrollmentFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isApiModalOpen, setIsApiModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  const clientId = params.id as string
  const client = clients.find((c) => c.id === clientId)

  if (!client) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Client Not Found</CardTitle>
            <CardDescription>The client you are looking for does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/clients")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const clientPrograms = programs.filter((program) => client.enrolledPrograms.includes(program.id))

  const handleDeleteClient = () => {
    removeClient(client.id)
    toast({
      title: "Client deleted",
      description: `${client.fullName} has been removed from the system.`,
    })
    router.push("/clients")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/clients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight line-clamp-1">{client.fullName}</h1>
            <p className="text-muted-foreground">Client Profile</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsApiModalOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditFormOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="break-words">{client.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="capitalize">{client.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Age</p>
                  <p>{client.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact</p>
                  <p className="break-words">{client.contactInfo}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered On</p>
                <p>{formatDate(client.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Health Programs</CardTitle>
                <CardDescription>Programs this client is enrolled in</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsEnrollmentFormOpen(true)}>
                Manage
              </Button>
            </CardHeader>
            <CardContent>
              {clientPrograms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-sm text-muted-foreground">Not enrolled in any programs</p>
                  <Button variant="link" onClick={() => setIsEnrollmentFormOpen(true)}>
                    Enroll in a program
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientPrograms.map((program) => (
                    <div key={program.id} className="flex items-start justify-between">
                      <div className="max-w-[70%]">
                        <h4 className="font-medium line-clamp-1">{program.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{program.description}</p>
                      </div>
                      <Badge className="shrink-0">{formatDate(program.createdAt)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ClientEnrollmentForm
        isOpen={isEnrollmentFormOpen}
        onClose={() => setIsEnrollmentFormOpen(false)}
        client={client}
      />

      <ClientForm isOpen={isEditFormOpen} onClose={() => setIsEditFormOpen(false)} client={client} />

      <ApiModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} client={client} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {client.fullName}'s record and remove them from all health programs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
