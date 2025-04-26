"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"
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

export default function SettingsPage() {
  const { resetStore } = useStore()
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [analytics, setAnalytics] = useState(false)

  const handleResetData = () => {
    resetStore()
    toast({
      title: "Data reset",
      description: "All client and program data has been reset.",
    })
    setIsResetDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Configure your application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications about client updates
                  </span>
                </Label>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="analytics" className="flex flex-col space-y-1">
                  <span>Analytics</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Share anonymous usage data to improve the app
                  </span>
                </Label>
                <Switch id="analytics" checked={analytics} onCheckedChange={setAnalytics} />
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
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Manage your application data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Reset all data to start fresh. This will remove all clients, programs, and enrollments.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => setIsResetDialogOpen(true)}>
                Reset All Data
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all clients, programs, and enrollment data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetData}>Reset Data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
