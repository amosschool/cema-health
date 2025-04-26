"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Client } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender.",
  }),
  age: z
    .string()
    .min(1, { message: "Age is required" })
    .pipe(
      z.coerce
        .number()
        .int()
        .min(1, { message: "Age must be at least 1 year." })
        .max(120, { message: "Age must be less than 120 years." }),
    ),
  contactInfo: z.string().min(5, {
    message: "Contact information must be at least 5 characters.",
  }),
})

interface ClientFormProps {
  isOpen: boolean
  onClose: () => void
  client?: Client
}

export function ClientForm({ isOpen, onClose, client }: ClientFormProps) {
  const { addClient, updateClient } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: client?.fullName || "",
      gender: client?.gender || "male",
      age: client?.age?.toString() || "",
      contactInfo: client?.contactInfo || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    setTimeout(() => {
      const processedValues = {
        ...values,
        age: Number(values.age), // Ensure age is a number
      }

      if (client) {
        updateClient({
          ...client,
          ...processedValues,
        })
        toast({
          title: "Client updated",
          description: `${values.fullName}'s information has been updated.`,
        })
      } else {
        addClient({
          id: crypto.randomUUID(),
          ...processedValues,
          enrolledPrograms: [],
          createdAt: new Date().toISOString(),
        })
        toast({
          title: "Client registered",
          description: `${values.fullName} has been added to the system.`,
        })
      }

      setIsSubmitting(false)
      form.reset()
      onClose()
    }, 500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Register New Client"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Update the client's information in the system."
              : "Add a new client to the health management system."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number or email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : client ? "Update Client" : "Register Client"}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
