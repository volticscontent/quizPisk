'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ProductImage } from '@/types/product'

interface ProductImageGalleryProps {
  images: ProductImage[]
  productTitle: string
  selectedImageIndex?: number
  onImageSelect?: (index: number) => void
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productTitle,
  selectedImageIndex: externalSelectedIndex,
  onImageSelect
}) => {
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0)
  
  // Use external index if provided, otherwise use internal state
  const selectedImageIndex = externalSelectedIndex !== undefined ? externalSelectedIndex : internalSelectedIndex
  
  const handleImageSelect = (index: number) => {
    if (onImageSelect) {
      onImageSelect(index)
    } else {
      setInternalSelectedIndex(index)
    }
  }

  // Filtrar apenas imagens do produto (main e thumbnails)
  const productImages = images.filter(img => 
    img.type === 'main' || img.type.startsWith('thumbnail_') || img.type.startsWith('angle_')
  )

  const currentImage = productImages[selectedImageIndex] || productImages[0]

  if (!productImages.length) {
    return (
      <div className="w-full aspect-square bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Sem imagem disponível</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full aspect-square mb-4 bg-white rounded-lg overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={currentImage.url}
            alt={currentImage.alt_text || productTitle}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Thumbnails - Original Tour de France Style */}
      {productImages.length > 1 && (
        <div className="flex space-x-2 justify-start overflow-x-auto scrollbar-hide pb-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-md overflow-hidden transition-all hover:border-yellow-400 ${
                selectedImageIndex === index 
                  ? 'border-yellow-400 ring-2 ring-yellow-200' 
                  : 'border-gray-300'
              }`}
            >
              <div className="relative w-full h-full bg-white">
                <Image
                  src={image.url}
                  alt={`Vista ${index + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImageGallery 