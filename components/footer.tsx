import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 mb-4">
              MotoCruise
            </h3>
            <p className="text-gray-400 mb-4">
              Premium motorcycle rental service for your adventures. Experience the thrill of the road with our
              top-quality bikes.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/motorcycles" className="text-gray-400 hover:text-primary">
                  Motorcycles
                </Link>
              </li>
              <li>
                <Link href="/availability" className="text-gray-400 hover:text-primary">
                  Check Availability
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Rental Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Rental Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">123 Ride Street, Bike City, BC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-400">info@motocruise.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} MotoCruise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

