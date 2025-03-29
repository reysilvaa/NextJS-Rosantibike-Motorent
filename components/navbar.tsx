"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, User, ChevronDown, Bike } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { ThemeToggle } from "./theme-toggle"
import LanguageSwitcher from "./language-switcher"
import { useTranslation } from "@/i18n/hooks"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLightTheme = theme === "light"
  const isHomePage = pathname === "/"

  // Kondisi untuk mengubah style navbar sesuai home page
  const shouldUseWhiteStyle = isLightTheme && !isScrolled && isHomePage

  useEffect(() => {
    // Using requestAnimationFrame for smoother performance
    let lastScrollY = window.scrollY
    let animationFrameId = 0;
    let scrollTimeout = setTimeout(() => {});
    
    // Clear initial timeout
    clearTimeout(scrollTimeout);
    animationFrameId = 0;

    const handleScroll = () => {
      if (animationFrameId) return

      animationFrameId = window.requestAnimationFrame(() => {
        // Only update if scroll position changed by more than 2px
        if (Math.abs(window.scrollY - lastScrollY) > 2) {
          setIsScrolled(window.scrollY > 10)
          lastScrollY = window.scrollY
        }

        animationFrameId = 0

        // Clear previous timeout
        if (scrollTimeout) clearTimeout(scrollTimeout)

        // Set a timeout to ensure state is updated when scrolling stops
        scrollTimeout = setTimeout(() => {
          setIsScrolled(window.scrollY > 10)
        }, 100)
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/motorcycles", label: t("motorcycles") },
    { href: "/availability", label: t("availability") },
    { href: "/booking-history", label: t("bookingHistory") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 will-change-transform",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/20 shadow-sm" : "bg-transparent",
        // Using transform-gpu for better performance
        "transform-gpu transition-all duration-300 ease-out",
      )}
      style={{
        paddingTop: isScrolled ? "0.5rem" : "1rem",
        paddingBottom: isScrolled ? "0.5rem" : "1rem",
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center group">
          {/* <div className="mr-2 flex items-center justify-center rounded-full bg-primary/10 p-1.5 group-hover:bg-primary/20 transition-colors duration-300 animate-pulse-soft">
            <Bike className={cn("h-5 w-5", shouldUseWhiteStyle ? "text-white" : "text-primary")} />
          </div> */}
          <span
            className={cn(
              "text-2xl font-bold relative",
              shouldUseWhiteStyle
                ? "text-white"
                : "bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70",
            )}
          >
            <Image 
              src={isHomePage ? isLightTheme ? (isScrolled ? "/logo/logo2.png" : "/logo/logo1.png") : "/logo/logo1.png" : "/logo/logo2.png"} 
              alt="RosantiBike" 
              width={120}
              height={40}
              className="h-10 w-auto" 
            />
            <span className={cn(
              "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full",
              shouldUseWhiteStyle ? "bg-white/70" : "bg-primary/50"
            )}></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-all duration-300 relative group py-1.5",
                pathname === link.href
                  ? shouldUseWhiteStyle
                    ? "text-white"
                    : "text-primary"
                  : shouldUseWhiteStyle
                    ? "text-white/80 hover:text-white"
                    : "text-muted-foreground hover:text-primary",
              )}
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full",
                  shouldUseWhiteStyle ? "bg-white/70" : "bg-primary/70",
                  pathname === link.href ? "w-full" : "",
                )}
              ></span>
              <span
                className={cn(
                  "absolute inset-0 rounded-md scale-0 transition-transform duration-300 group-hover:scale-100 origin-bottom",
                  shouldUseWhiteStyle ? "bg-white/10" : "bg-primary/5",
                  pathname === link.href ? "scale-100" : "",
                )}
              ></span>
            </Link>
          ))}
        </nav>

        {/* Actions - Fixed width container to prevent shifting */}
        <div className="hidden md:flex items-center gap-3 min-w-[190px] justify-end">
          <div className="relative">
            <LanguageSwitcher useWhiteStyle={shouldUseWhiteStyle} />
          </div>
          <div className="relative">
            <ThemeToggle useWhiteStyle={shouldUseWhiteStyle} />
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex items-center gap-1.5 px-3 h-9 transition-all duration-300",
                      shouldUseWhiteStyle
                        ? "border-white text-white hover:bg-white/10"
                        : "border-primary/20 hover:border-primary/40 hover:bg-primary/5",
                    )}
                  >
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center",
                        shouldUseWhiteStyle ? "bg-white/20" : "bg-primary/10",
                      )}
                    >
                      <User className={cn("h-3.5 w-3.5", shouldUseWhiteStyle ? "text-white" : "text-primary")} />
                    </div>
                    <span className="font-medium">{t("account")}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 glass dark:glass-dark border-border/30 shadow-lg rounded-xl p-1 animate-in fade-in-0 zoom-in-95 duration-200"
                  forceMount
                >
                  <div className="px-2 py-1.5 mb-1">
                    <p className="text-sm font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="hover:bg-primary/5 focus:bg-primary/5 rounded-lg cursor-pointer">
                    <Link href="/admin" className="flex items-center">
                      <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {t("dashboard")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-primary/5 focus:bg-primary/5 rounded-lg cursor-pointer">
                    <Link href="/profile">
                      <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10 rounded-lg cursor-pointer"
                  >
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className={cn(
                  "px-4 h-9 rounded-lg shadow-sm hover:shadow transition-all duration-300",
                  shouldUseWhiteStyle
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground",
                )}
              >
                {t("login")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden h-9 w-9 rounded-full",
                shouldUseWhiteStyle ? "hover:bg-white/10 text-white" : "hover:bg-primary/10 text-foreground",
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{t("mobileMenuTitle")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="border-l border-border/20 bg-background/90 backdrop-blur-xl w-[280px] p-0 animate-in slide-in-from-right duration-300"
          >
            <SheetTitle className="sr-only">{t("mobileMenuTitle")}</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border/30">
                <Link href="/" className="flex items-center group">
                  <div className="mr-2 flex items-center justify-center rounded-full bg-primary/10 p-1.5">
                    <Bike className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    <Image 
                      src={isHomePage ? (isScrolled ? "/logo/logo2.png" : "/logo/logo1.png") : "/logo/logo2.png"} 
                      alt="RosantiBike Motorent" 
                      width={96}
                      height={32}
                      className="h-8 w-auto" 
                    />
                  </span>
                </Link>
              </div>

              <nav className="flex flex-col p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center py-3 px-2 text-base font-medium transition-all duration-300 hover:text-primary relative group rounded-lg",
                      pathname === link.href ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-primary/5",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute bottom-2 left-2 h-0.5 bg-primary/50 transition-all duration-300 rounded-full",
                        pathname === link.href ? "w-12" : "w-0 group-hover:w-12",
                      )}
                    ></span>
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-4 space-y-6 border-t border-border/30">
                <div className="flex items-center justify-between py-2 px-2 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium">{t("theme")}</span>
                  <ThemeToggle useWhiteStyle={false} />
                </div>

                <div className="flex items-center justify-between py-2 px-2 rounded-lg bg-primary/5">
                  <span className="text-sm font-medium">{t("language")}</span>
                  <LanguageSwitcher useWhiteStyle={false} />
                </div>

                {isAuthenticated ? (
                  <div className="space-y-3 pt-2">
                    <Link href="/admin">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      >
                        <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {t("dashboard")}
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                      >
                        <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                          <User className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {t("profile")}
                      </Button>
                    </Link>
                    <Button variant="destructive" onClick={logout} className="w-full mt-2">
                      {t("logout")}
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" className="block pt-2">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all duration-300">
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

