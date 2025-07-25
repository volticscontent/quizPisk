 'use client'

import React, { useState } from 'react'
import Image from 'next/image'

// Declare fbq type for Meta Pixel
declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: {
      content_name?: string;
      content_ids?: string[];
      content_type?: string;
      value?: number;
      currency?: string;
      num_items?: number;
    }) => void;
  }
}

interface JerseyVariant {
  size: string;
  shopifyUrl: string;
  variantId: string;
}

interface Jersey {
  id: string;
  name: string;
  color: string;
  image: string;
  originalUrl: string;
  variants: JerseyVariant[];
}

const MultiProductPage = () => {
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({})

  const jerseys: Jersey[] = [
    {
      id: 'jersey-01',
      name: 'Maillot Jaune Authentique 2025',
      color: 'Jaune',
      image: '/product_images/jersey_yellow.jpg',
      originalUrl: 'https://store2.letour.com/fr/tour-de-france/tour-de-france-2025-authentic-jersey-by-santini-yellow/t-21155588+p-913314123688324+z-9-4203877325?_ref=p-DLP:m-GRID:i-r0c2:po-2',
      variants: [
        { size: 'XS', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212744504:1?channel=buy_button', variantId: '50836212744504' },
        { size: 'S', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232077624:1?channel=buy_button', variantId: '50836232077624' },
        { size: 'M', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232110392:1?channel=buy_button', variantId: '50836232110392' },
        { size: 'L', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232143160:1?channel=buy_button', variantId: '50836232143160' },
        { size: 'XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232175928:1?channel=buy_button', variantId: '50836232175928' },
        { size: '2XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232208696:1?channel=buy_button', variantId: '50836232208696' },
        { size: '3XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232241464:1?channel=buy_button', variantId: '50836232241464' },
        { size: '4XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232274232:1?channel=buy_button', variantId: '50836232274232' },
      ]
    },
    {
      id: 'jersey-02',
      name: 'Maillot Polka Authentique 2025',
      color: 'Polka',
      image: '/product_images/jersey_polka.jpg',
      originalUrl: 'https://store2.letour.com/fr/tour-de-france/tour-de-france-2025-authentic-team-jersey-by-santini-polka/t-21606677+p-575547906922373+z-9-3985908558?_ref=p-DLP:m-GRID:i-r1c0:po-3',
      variants: [
        { size: 'XS', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212777272:1?channel=buy_button', variantId: '50836212777272' },
        { size: 'S', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232307000:1?channel=buy_button', variantId: '50836232307000' },
        { size: 'M', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232339768:1?channel=buy_button', variantId: '50836232339768' },
        { size: 'L', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232372536:1?channel=buy_button', variantId: '50836232372536' },
        { size: 'XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232405304:1?channel=buy_button', variantId: '50836232405304' },
        { size: '2XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232438072:1?channel=buy_button', variantId: '50836232438072' },
        { size: '3XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232470840:1?channel=buy_button', variantId: '50836232470840' },
        { size: '4XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232503608:1?channel=buy_button', variantId: '50836232503608' },
      ]
    },
    {
      id: 'jersey-03',
      name: 'Maillot Vert Authentique 2025',
      color: 'Vert',
      image: '/product_images/jersey_green.jpg',
      originalUrl: 'https://store2.letour.com/fr/tour-de-france/tour-de-france-2025-authentic-jersey-by-santini-green/t-32268811+p-578825898199434+z-9-1010585192?_ref=p-DLP:m-GRID:i-r5c2:po-17',
      variants: [
        { size: 'XS', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212810040:1?channel=buy_button', variantId: '50836212810040' },
        { size: 'S', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232536376:1?channel=buy_button', variantId: '50836232536376' },
        { size: 'M', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232569144:1?channel=buy_button', variantId: '50836232569144' },
        { size: 'L', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232601912:1?channel=buy_button', variantId: '50836232601912' },
        { size: 'XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232634680:1?channel=buy_button', variantId: '50836232634680' },
        { size: '2XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232667448:1?channel=buy_button', variantId: '50836232667448' },
        { size: '3XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232700216:1?channel=buy_button', variantId: '50836232700216' },
        { size: '4XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232732984:1?channel=buy_button', variantId: '50836232732984' },
      ]
    },
    {
      id: 'jersey-04',
      name: 'Maillot Blanc Authentique 2025',
      color: 'Blanc',
      image: '/product_images/jersey_white.jpg',
      originalUrl: 'https://store2.letour.com/fr/tour-de-france/tour-de-france-2025-authentic-jersey-by-santini-white/t-21158822+p-466658012533326+z-9-583685103?_ref=p-DLP:m-GRID:i-r7c1:po-22',
      variants: [
        { size: 'XS', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212842808:1?channel=buy_button', variantId: '50836212842808' },
        { size: 'S', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232765752:1?channel=buy_button', variantId: '50836232765752' },
        { size: 'M', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232798520:1?channel=buy_button', variantId: '50836232798520' },
        { size: 'L', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232831288:1?channel=buy_button', variantId: '50836232831288' },
        { size: 'XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232864056:1?channel=buy_button', variantId: '50836232864056' },
        { size: '2XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232896824:1?channel=buy_button', variantId: '50836232896824' },
        { size: '3XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232929592:1?channel=buy_button', variantId: '50836232929592' },
        { size: '4XL', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232962360:1?channel=buy_button', variantId: '50836232962360' },
      ]
    }
  ]

  const handleSizeSelect = (jerseyId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [jerseyId]: size
    }))
  }

  const handleAddToCart = (jersey: Jersey) => {
    const selectedSize = selectedSizes[jersey.id]
    if (!selectedSize) return

    const variant = jersey.variants.find(v => v.size === selectedSize)
    if (!variant) return

    // Trigger Meta Pixel InitiateCheckout event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: jersey.name,
        content_ids: [variant.variantId],
        content_type: 'product',
        value: 47,
        currency: 'EUR',
        num_items: 1
      })
    }

    // Redirect to Shopify cart
    window.open(variant.shopifyUrl, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Main Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          Maillot Légendaire du Tour de France 2025 – Édition Authentique à Prix Exclusif
        </h1>
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-red-100 px-6 py-3 rounded-lg">
            <span className="text-lg text-gray-600 line-through">147€</span>
            <span className="text-3xl font-bold text-red-600">47€</span>
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">-68%</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {jerseys.map((jersey) => (
          <div key={jersey.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 relative">
              <Image
                src={jersey.image}
                alt={jersey.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                -68%
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-black mb-2">{jersey.name}</h3>
              <p className="text-gray-600 mb-4">par Santini - {jersey.color}</p>

              {/* Pricing */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold text-red-600">47€</span>
                <span className="text-sm text-gray-500 line-through">147€</span>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Taille</label>
                <div className="grid grid-cols-4 gap-1">
                  {jersey.variants.map((variant) => (
                    <button
                      key={variant.size}
                      onClick={() => handleSizeSelect(jersey.id, variant.size)}
                      className={`py-2 px-1 text-xs font-medium rounded border transition-all ${
                        selectedSizes[jersey.id] === variant.size
                          ? 'bg-yellow-400 border-yellow-400 text-black'
                          : 'border-gray-300 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(jersey)}
                disabled={!selectedSizes[jersey.id]}
                className={`w-full py-3 rounded-full font-semibold text-lg transition-all ${
                  selectedSizes[jersey.id]
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ajouter au panier
              </button>

              {!selectedSizes[jersey.id] && (
                <p className="text-xs text-red-600 text-center mt-2">
                  Veuillez sélectionner une taille
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <h4 className="font-semibold mb-2">Édition Authentique</h4>
            <p className="text-gray-600 text-sm">Maillots officiels portés par les coureurs du Tour de France 2025</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
            <h4 className="font-semibold mb-2">Livraison Rapide</h4>
            <p className="text-gray-600 text-sm">Expédition dans les 24h ouvrées partout en Europe</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">💯</span>
            </div>
            <h4 className="font-semibold mb-2">Garantie Qualité</h4>
            <p className="text-gray-600 text-sm">Fabriqué par Santini, partenaire officiel du Tour de France</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MultiProductPage