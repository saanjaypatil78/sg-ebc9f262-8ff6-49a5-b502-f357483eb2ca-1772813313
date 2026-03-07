import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/sunray-logo.png"
                  alt="Brave Ecom Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Brave Ecom
              </span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Building financial futures through transparent investment solutions and innovative e-commerce platforms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/invest" className="text-slate-400 hover:text-white transition">
                  Invest
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-slate-400 hover:text-white transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@bravecom.info" className="hover:text-white transition">
                  support@bravecom.info
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+918433783789" className="hover:text-white transition">
                  +91 8433783789
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>201, Neel Solitaire, OLD PANVEL</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="https://www.bravecom.info" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  www.bravecom.info
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Brave Ecom. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-500 hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-white transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}