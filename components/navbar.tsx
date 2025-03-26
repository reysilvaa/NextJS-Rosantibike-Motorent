"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, User, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "./theme-toggle"
import LanguageSwitcher from "./language-switcher"
import { useTranslation } from "@/i18n/hooks"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/motorcycles", label: t("motorcycles") },
    { href: "/availability", label: t("availability") },
    { href: "/booking-history", label: t("booking_history") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-black/80 backdrop-blur-md py-2 border-b border-gray-800/50" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
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
                "text-sm font-medium transition-colors hover:text-primary relative group",
                pathname === link.href 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {link.label}
              <span className={cn(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                pathname === link.href ? "w-full" : ""
              )}></span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <User className="h-4 w-4 mr-1" />
                  {t("account")}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    {t("dashboard")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    {t("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t("login")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t("mobileMenuTitle")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-l border-gray-800 bg-background/95 backdrop-blur-md">
            <div className="flex flex-col h-full">
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
              </nav>
              
              <div className="mt-auto space-y-6 py-6 border-t border-gray-800 mt-8">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{t("theme")}:</span>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{t("language")}:</span>
                  <LanguageSwitcher />
                </div>

                {isAuthenticated ? (
                  <div className="space-y-4">
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        {t("dashboard")}
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full justify-start">
                        {t("profile")}
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={logout} className="w-full">
                      {t("logout")}
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      {t("login")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
