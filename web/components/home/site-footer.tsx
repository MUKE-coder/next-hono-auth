import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Heart,
  Users,
  Database,
  FileText,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import MainLogo from './main-logo';

export default function SiteFooter() {
  return (
    <footer className="w-full bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* UNMU Brand Section */}
          <div className="space-y-4">
            <MainLogo
              src="/images/unmu-logo.png"
              alt="UNMU - Uganda Nurses and Midwives Union"
              width={50}
              height={50}
              showText={true}
              text="UNMU"
              variant="default"
            />
            <p className="text-sm text-white/90 leading-relaxed">
              Empowering Uganda's healthcare heroes through comprehensive member
              management and professional development. Building a stronger
              healthcare workforce together.
            </p>
            <div className="flex items-center space-x-2 text-yellow-300">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium italic">
                "To Love and Serve"
              </span>
            </div>
            <div className="flex space-x-3">
              <Link
                href="https://twitter.com/unmu_uganda"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors duration-200"
              >
                <Twitter className="h-4 w-4 text-white" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/unmu-uganda"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors duration-200"
              >
                <Linkedin className="h-4 w-4 text-white" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://www.instagram.com/unmu_uganda"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors duration-200"
              >
                <Instagram className="h-4 w-4 text-white" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.youtube.com/@unmu-uganda"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors duration-200"
              >
                <Youtube className="h-4 w-4 text-white" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-300">Get In Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                <span>info@unmu.or.ug</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                <span>+256 414 230 300</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-yellow-300 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  UNMU House, Plot 15A,
                  <br />
                  Acacia Avenue, Kololo,
                  <br />
                  Kampala, Uganda
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links - Healthcare Focused */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-yellow-300">Quick Links</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                  href="/"
                >
                  <span>Home</span>
                </Link>
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                  href="/auth/register"
                >
                  <Users className="h-3 w-3" />
                  <span>New Member</span>
                </Link>
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                  href="/auth/admin/register"
                >
                  <Database className="h-3 w-3" />
                  <span>New Admin</span>
                </Link>
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                  href="/reports"
                >
                  <FileText className="h-3 w-3" />
                  <span>Reports</span>
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold invisible">Links</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200"
                  href="/about"
                >
                  About UNMU
                </Link>
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200"
                  href="/careers"
                >
                  Careers
                </Link>
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200"
                  href="/contact"
                >
                  Contact Us
                </Link>
                <Link
                  className="hover:text-yellow-300 transition-colors duration-200 flex items-center space-x-2"
                  href="/privacy"
                >
                  <Shield className="h-3 w-3" />
                  <span>Privacy Policy</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Newsletter/Updates Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-yellow-300">Stay Updated</h3>
            <p className="text-sm text-white/80">
              Get the latest updates on healthcare policies, member benefits,
              and professional development opportunities.
            </p>
            <form className="space-y-3">
              <Input
                className="bg-white/10 border-white/20 placeholder:text-white/50 focus:border-yellow-300 focus:ring-yellow-300"
                placeholder="Enter your email address"
                type="email"
              />
              <Button
                className="w-full bg-yellow-500 text-red-900 hover:bg-yellow-400 font-medium transition-colors duration-200"
                type="submit"
              >
                Subscribe to Updates
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Button>
            </form>
          </div>
        </div>

        {/* Additional UNMU Info Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-yellow-300 mb-2">
                Professional Development
              </h4>
              <p className="text-sm text-white/80">
                Continuing education and certification programs for healthcare
                professionals.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-yellow-300 mb-2">
                Member Support
              </h4>
              <p className="text-sm text-white/80">
                24/7 support for UNMU members with advocacy and professional
                guidance.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-yellow-300 mb-2">
                Healthcare Network
              </h4>
              <p className="text-sm text-white/80">
                Connecting nurses and midwives across Uganda's healthcare
                system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10 bg-red-950/50">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-center text-sm md:h-16 md:flex-row md:py-0">
          <div className="text-white/60">
            Copyright © {new Date().getFullYear()} Uganda Nurses and Midwives
            Union (UNMU). All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4 text-white/60">
            <Link
              href="/terms"
              className="hover:text-yellow-300 transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/privacy"
              className="hover:text-yellow-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/accessibility"
              className="hover:text-yellow-300 transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
