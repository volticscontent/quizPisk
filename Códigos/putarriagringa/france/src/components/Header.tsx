'use client'

import React from 'react'
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const topBarLinks = [
    { label: 'LeTour.com', href: '#', external: true },
    { label: 'Suivre ma commande', href: '#' },
    { label: 'Aide', href: '#' },
    { label: 'Mon Compte', href: '#' },
  ]

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Sign up button */}
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded text-sm font-medium">
              SIGN UP & SAVE 10%
            </button>
            
            {/* Top bar links */}
            <div className="flex items-center space-x-6">
              {topBarLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="text-sm text-gray-700 hover:text-black"
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Language selector */}
              <div className="relative">
                <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-black">
                  <span>Language</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              
              {/* Currency selector */}
              <div className="relative">
                <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-black">
                  <span>EUR €</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              
              {/* Cart */}
              <a href="#" className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded">
                <ShoppingCart className="w-4 h-4 text-black" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-white">
                <div className="w-48 h-12 flex items-center justify-center">
                  <Image 
                    src="/product_images/logo.svg" 
                    alt="Tour de France" 
                    width={192} 
                    height={48}
                    className="max-w-full max-h-full object-contain"
                    priority
                    onError={(e) => {
                      console.log('Logo failed to load:', e);
                      // Hide the image and show text fallback
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.logo-fallback')) {
                        const fallback = document.createElement('span');
                        fallback.className = 'logo-fallback text-xl font-bold text-yellow-400';
                        fallback.textContent = 'TOUR DE FRANCE';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="What can we help you find?"
                  className="w-full px-4 py-2 rounded-l-lg text-black border-none outline-none"
                />
                <button className="bg-white text-black px-4 py-2 rounded-r-lg hover:bg-gray-100">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button & Icons */}
            <div className="flex items-center space-x-4 lg:hidden">
              <button>
                <User className="w-6 h-6" />
              </button>
              <button>
                <ShoppingCart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#FFFF00]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left side navigation items */}
            <div className="flex items-center space-x-2">
              {/* Équipes */}
              <a href="#" className="text-black hover:bg-yellow-500 pr-3 py-2 rounded transition-colors font-bold">
                Équipes
              </a>
              
              {/* Maillot Jaune */}
              <a href="#" className="text-black hover:bg-yellow-500 py-2 rounded transition-colors font-bold">
                Maillot Jaune
              </a>
              
              {/* Homme */}
              <a href="#" className="text-black hover:bg-yellow-500 px-3 py-2 rounded transition-colors font-bold">
                Homme
              </a>
              
              {/* Plus */}
              <a href="#" className="text-black hover:bg-yellow-500 px-3 py-2 rounded transition-colors font-bold">
                Plus
              </a>
            </div>

            {/* Right side search icon */}
            <div className="flex items-center">
              <button className="text-black hover:bg-yellow-500 p-2 rounded transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header 