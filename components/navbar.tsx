"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/motorcycles", label: "Motorcycles" },
    { href: "/availability", label: "Check Availability" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            MotoCruise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-gray-800">
            <nav className="flex flex-col space-y-6 mt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === link.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center py-4">
                <span className="text-sm font-medium mr-2">Tema:</span>
                <ThemeToggle />
              </div>

              {isAuthenticated ? (
                <>
                  <Link href="/admin" className="text-lg font-medium text-primary">
                    Dashboard
                  </Link>
                  <Button variant="destructive" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button className="w-full" variant="default">
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

