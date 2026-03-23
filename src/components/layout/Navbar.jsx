import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Organizing links into an array makes the code much cleaner
  const navLinks = [
    { name: "Merge", path: "/merge" },
    { name: "Split", path: "/split" },
    { name: "Watermark", path: "/watermark" },
    { name: "Image To PDF", path: "/image-to-pdf" },
    { name: "Compress", path: "/compress" },
    { name: "Rotate", path: "/rotate" },
    { name: "Organize", path: "/organize" },
    { name: "PDF To Image", path: "/pdf-to-image" },
    { name: "Grayscale", path: "/grayscale" },
  ];

  // Close the mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group z-50">
            <div className="bg-white text-black p-1.5 rounded-md group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              QuickPDF
            </span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden lg:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle Button (Hidden on Desktop) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors z-50"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-b border-white/10 bg-[#0a0a0a] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={handleLinkClick}
                  className="block px-3 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}