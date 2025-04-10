"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ModeToggle } from "../components/ui/mode-toggle"
import { LogOut, Menu, MessageSquare, User, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../hooks/use-auth"
import { Badge } from "../components/ui/badge"
import { NotificationList } from "./notifications/Notifications-list"

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
    <div className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-heading font-bold text-xl">
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">SkillSwap</span>
        </Link>
        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
          Premium Coming Soon
        </Badge>
        <nav className="hidden md:flex gap-8 ml-10">
          <Link
            href="/skills"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/skills" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Browse Skills
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/matches"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/matches" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Matches
              </Link>
              <Link
                href="/messages"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname.startsWith("/messages") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Messages
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />

        {user && <NotificationList />}

        {loading ? (
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden">
                <Avatar className="h-9 w-9 ring-2 ring-background">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
              <div className="flex flex-col space-y-1 leading-none p-2">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/edit" className="w-full cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/messages" className="w-full cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild className="rounded-full" size="sm">
            <Link href="/signin">Sign In</Link>
          </Button>
        )}

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </div>

    {/* Mobile menu */}
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden border-t"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-4 flex flex-col space-y-3">
            <Link
              href="/skills"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/skills" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Skills
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/dashboard" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/matches"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/matches" ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Matches
                </Link>
                <Link
                  href="/messages"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith("/messages") ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </header>
)
}
