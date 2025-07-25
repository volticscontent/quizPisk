'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import SizeSelector from './SizeSelector'
import { ProductInfo as ProductInfoType } from '@/types/product'
import Image from 'next/image'

interface ProductInfoProps {
  product: ProductInfoType
  onVariantChange?: (variantId: string) => void
  selectedVariant?: string
}

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
    ttq?: {
      track: (event: string, params?: {
        content_name?: string;
        content_id?: string;
        content_type?: string;
        value?: number;
        currency?: string;
        quantity?: number;
      }) => void;
    };
  }
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onVariantChange, selectedVariant: externalSelectedVariant }) => {
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [internalSelectedVariant, setInternalSelectedVariant] = useState<string>('jersey-01') // Default to yellow jersey
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState<string[]>(['shipping'])

  // Use external selectedVariant if provided, otherwise use internal state
  const selectedVariant = externalSelectedVariant !== undefined ? externalSelectedVariant : internalSelectedVariant

  useEffect(() => {
    if (externalSelectedVariant && externalSelectedVariant !== internalSelectedVariant) {
      setInternalSelectedVariant(externalSelectedVariant)
    }
  }, [externalSelectedVariant, internalSelectedVariant])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const isExpanded = (section: string) => expandedSections.includes(section)

  // Handle variant selection and notify parent
  const handleVariantChange = (variantId: string) => {
    setInternalSelectedVariant(variantId)
    if (onVariantChange) {
      onVariantChange(variantId)
    }
  }

  // Function to handle add to cart and trigger Meta Pixel event
  const handleAddToCart = () => {
    if (!selectedSize || !selectedVariant) return

    const variant = product.variants?.find(v => v.id === selectedVariant)
    if (!variant) return

    const shopifyVariant = variant.shopifyVariants.find(sv => sv.size === selectedSize)
    if (!shopifyVariant) return

    // Trigger Meta Pixel InitiateCheckout event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: `${product.title} - ${variant.name}`,
        content_ids: [shopifyVariant.variantId],
        content_type: 'product',
        value: parseFloat(product.pricing.discount_price.replace(/[^0-9.,]/g, '').replace(',', '.')),
        currency: 'EUR',
        num_items: quantity
      })
    }

    // Trigger TikTok Pixel AddToCart event
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('AddToCart', {
        content_name: `${product.title} - ${variant.name}`,
        content_id: shopifyVariant.variantId,
        content_type: 'product',
        value: parseFloat(product.pricing.discount_price.replace(/[^0-9.,]/g, '').replace(',', '.')),
        currency: 'EUR',
        quantity: quantity
      })
    }

    // Redirect to Shopify cart
    window.open(shopifyVariant.shopifyUrl, '_blank')

    // Add your cart logic here
    console.log('Added to cart:', {
      product: product.title,
      variant: variant.name,
      size: selectedSize,
      quantity: quantity,
      shopifyUrl: shopifyVariant.shopifyUrl
    })
  }

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-[18px] font-semibold text-black mb-2 mx-3">
          {product.title}
        </h1>
        <div className="flex items-center space-x-2 mx-3">
          <span className="text-green-600 text-sm font-medium">
            {product.availability}
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2 mx-3">
        <div className="flex items-center space-x-3">
          <span className="text-[19px] font-bold text-red-600">
            {product.pricing.discount_price}
          </span>
          <span className="text-sm text-gray-600">
            avec promotion: <span className="font-bold text-red-600">{product.pricing.discount_code}</span>
          </span>
          <span className="text-lg text-gray-500 line-through">
            {product.pricing.regular_price}
          </span>
        </div>
      </div>

      {/* Bundle Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-gray-100 p-4 my-0">
          <h3 className="font-semibold font-sans text-black mb-3">Choisissez votre variante</h3>
          <div className="flex gap-3 overflow-x-auto">
            {product.variants.map(variant => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all min-w-[70px] ${
                  selectedVariant === variant.id
                    ? 'border-[#ff0] shadow-md bg-white'
                    : 'border-gray-200 bg-white hover:border-[#ff0]'
                }`}
              >
                <div className="w-12 h-12 mb-1 overflow-hidden rounded">
                  <Image
                    src={variant.image}
                    alt={variant.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${
                  selectedVariant === variant.id ? 'text-[#beb30f]' : 'text-gray-700'
                }`}>
                  {variant.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      <SizeSelector
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
      />

      {/* Quantity and Add to Cart */}
      <div className="space-y-4 bg-gray-100 p-4 my-0">
        {/* Quantity Label */}
        <div className="mx-3">
          <span className="font-medium font-sans text-black">Quantité</span>
        </div>
        
        {/* Quantity Selector and Add to Cart Button - Side by side */}
        <div className="flex items-center space-x-4 mx-3">
          {/* Quantity Dropdown */}
          <div className="relative">
            <select 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="appearance-none bg-white text-black border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent min-w-[80px]"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
              <option value={11}>10+</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Add to Cart Button */}
          <button 
            disabled={!selectedSize || !selectedVariant}
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded font-semibold text-lg transition-all ${
              selectedSize && selectedVariant
                ? 'bg-[#ff0] hover:bg-[#ff0] text-gray-800 text-[18px] font-sans shadow-md rounded-full' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-lg border-b-2 border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Ajouter au panier</span>
            </div>
          </button>
        </div>

        {(!selectedSize || !selectedVariant) && (
          <p className="text-sm text-red-600 text-center mx-3">
            {!selectedVariant ? 'Veuillez sélectionner une variante' : 'Veuillez sélectionner une taille'}
          </p>
        )}
      </div>
      
      {/* Product Details Sections */}
      <div className="">
        {/* Shipping */}
        <div className="border border-gray-200 rounded">
          <button
            onClick={() => toggleSection('shipping')}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-semibold font-sans text-black">Livraison</span>
            <ChevronDown 
              className={`text-black w-5 h-5 transition-transform ${
                isExpanded('shipping') ? 'rotate-180' : ''
              }`} 
            />
          </button>
          {isExpanded('shipping') && (
            <div className="px-4 pb-4">
              <ul className="text-gray-600 space-y-2">
                <li>Cet article sera expédié dans les 24h ouvrées. Veuillez passer à la commande pour connaître les options de livraison et les délais de transit supplémentaires.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="border border-gray-200 rounded font-sans text-black">
          <button
            onClick={() => toggleSection('details')}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-semibold">Details</span>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                isExpanded('details') ? 'rotate-180' : ''
              }`} 
            />
          </button>
          {isExpanded('details') && (
            <div className="px-4 pb-4">
              <ul className="space-y-2 text-gray-600">
                <li>Product ID: {product.product_id}</li>
                <li>Pays d&apos;origine: {product.country_origin || 'Italie'}</li>
                <li>Agréé officiellement</li>
              </ul>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="border border-gray-200 rounded font-sans text-black">
          <button
            onClick={() => toggleSection('description')}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-semibold">Description</span>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                isExpanded('description') ? 'rotate-180' : ''
              }`} 
            />
          </button>
          {isExpanded('description') && (
            <div className="px-4 pb-4">
              <p className="text-gray-600">
                {product.description || 'Zeige stolz die Liebe für dein Lieblingsteam. Getragen von den Team-Fahrern, ist dieses Trikot ein essentieller Artikel für Fans.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductInfo 