"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, Activity, Settings, X, HeartPulse } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile, setIsOpen])

  const sidebarVariants = {
    open: {
      x: 0,
      width: "240px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: isMobile ? -240 : 0,
      width: isMobile ? 0 : "64px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const linkVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.2,
      },
    },
    closed: {
      opacity: isMobile ? 0 : 1,
      x: -10,
      transition: {
        duration: 0.1,
      },
    },
  }

  const logoVariants = {
    open: {
      opacity: 1,
      scale: 1,
    },
    closed: {
      opacity: isMobile ? 0 : 1,
      scale: isMobile ? 0.8 : 0.8,
    },
  }

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Programs",
      href: "/programs",
      icon: Activity,
    },
    {
      name: "Clients",
      href: "/clients",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? "closed" : "open"}
            animate={isOpen ? "open" : "closed"}
            exit="closed"
            variants={sidebarVariants}
            className={cn(
              "relative z-20 flex h-full flex-col border-r bg-background",
              isMobile && "fixed left-0 top-0 shadow-xl",
            )}
          >
            {isMobile && (
              <div className="absolute right-2 top-2">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            )}
            <div className="flex h-16 items-center border-b px-4">
              <motion.div variants={logoVariants} className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-primary" />
                <motion.span variants={linkVariants} className="text-lg font-semibold">
                  Cema Health
                </motion.span>
              </motion.div>
            </div>
            <ScrollArea className="flex-1 py-2">
              <nav className="grid gap-1 px-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href && "bg-accent text-accent-foreground",
                      !isOpen && !isMobile && "justify-center py-3",
                    )}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <link.icon className={cn("h-5 w-5", !isOpen && !isMobile && "h-5 w-5")} />
                    <motion.span variants={linkVariants} className={cn(!isOpen && !isMobile && "hidden")}>
                      {link.name}
                    </motion.span>
                  </Link>
                ))}
              </nav>
            </ScrollArea>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
