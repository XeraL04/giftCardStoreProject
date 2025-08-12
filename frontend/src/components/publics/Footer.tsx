import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-t border-blue-100 backdrop-blur-md mt-20">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Logo / Brand */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-fuchsia-500 to-purple-600"
            >
              GiftShop
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Your trusted gift card marketplace
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link
              to="/contact"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow transition-all"
            >
              <FaFacebookF size={14} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow transition-all"
            >
              <FaTwitter size={14} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow transition-all"
            >
              <FaInstagram size={14} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-blue-100 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} GiftShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
