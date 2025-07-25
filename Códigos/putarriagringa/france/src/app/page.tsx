'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'

import Breadcrumb from '@/components/Breadcrumb'
import ProductImageGallery from '@/components/ProductImageGallery'
import ProductInfo from '@/components/ProductInfo'
import { ProductInfo as ProductInfoType, ProductImage } from '@/types/product'

// Product data with bundle variants and Shopify integration
const mockProduct: ProductInfoType = {
  title: "Maillot Légendaire du Tour de France 2025 – Édition Authentique à Prix Exclusif",
  product_id: "203130119",
  description: "Découvrez l'édition authentique 2025 du maillot légendaire du Tour de France par Santini. Fabriqué avec les mêmes matériaux et technologies que portent les champions du Tour de France. Cette collection exclusive comprend les quatre maillots iconiques : Jaune (Leader), Polka (Meilleur Grimpeur), Vert (Sprinter) et Blanc (Jeune Coureur). Prix exceptionnel de lancement à 47€ au lieu de 147€ - Offre limitée !",
  pricing: {
    regular_price: "147,00 €",
    discount_price: "47,00 €",
    discount_code: "TOUR2025"
  },
  availability: "En Stock - Édition Limitée",
  brand: "Santini",
  category: "Maillots Authentiques",
  sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  country_origin: "Italie",
  originalUrl: "https://store2.letour.com/fr/tour-de-france/tour-de-france-2025-authentic-jersey-by-santini-yellow/t-21155588+p-913314123688324+z-9-4203877325?_ref=p-DLP:m-GRID:i-r0c2:po-2",
  variants: [
    {
      id: "jersey-01",
      name: "Maillot Jaune",
      color: "Jaune",
      description: "Maillot du Leader - Porté par le coureur en tête du classement général",
      image: "/product_images/main_product.jpg",
      shopifyVariants: [
        { size: 'XS', variantId: '50836212744504', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212744504:1?channel=buy_button' },
        { size: 'S', variantId: '50836232077624', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232077624:1?channel=buy_button' },
        { size: 'M', variantId: '50836232110392', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232110392:1?channel=buy_button' },
        { size: 'L', variantId: '50836232143160', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232143160:1?channel=buy_button' },
        { size: 'XL', variantId: '50836232175928', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232175928:1?channel=buy_button' },
        { size: '2XL', variantId: '50836232208696', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232208696:1?channel=buy_button' },
        { size: '3XL', variantId: '50836232241464', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232241464:1?channel=buy_button' },
        { size: '4XL', variantId: '50836232274232', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232274232:1?channel=buy_button' }
      ]
    },
    {
      id: "jersey-02", 
      name: "Maillot Polka",
      color: "Blanc à Pois Rouges",
      description: "Maillot du Meilleur Grimpeur - Récompense l'excellence en montagne",
      image: "/product_images_2/main_product.jpg",
      shopifyVariants: [
        { size: 'XS', variantId: '50836212777272', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212777272:1?channel=buy_button' },
        { size: 'S', variantId: '50836232307000', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232307000:1?channel=buy_button' },
        { size: 'M', variantId: '50836232339768', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232339768:1?channel=buy_button' },
        { size: 'L', variantId: '50836232372536', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232372536:1?channel=buy_button' },
        { size: 'XL', variantId: '50836232405304', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232405304:1?channel=buy_button' },
        { size: '2XL', variantId: '50836232438072', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232438072:1?channel=buy_button' },
        { size: '3XL', variantId: '50836232470840', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232470840:1?channel=buy_button' },
        { size: '4XL', variantId: '50836232503608', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232503608:1?channel=buy_button' }
      ]
    },
    {
      id: "jersey-03",
      name: "Maillot Vert", 
      color: "Vert",
      description: "Maillot du Sprinter - Récompense les points au sprint",
      image: "/product_images_3/main_product.jpg",
      shopifyVariants: [
        { size: 'XS', variantId: '50836212810040', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212810040:1?channel=buy_button' },
        { size: 'S', variantId: '50836232536376', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232536376:1?channel=buy_button' },
        { size: 'M', variantId: '50836232569144', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232569144:1?channel=buy_button' },
        { size: 'L', variantId: '50836232601912', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232601912:1?channel=buy_button' },
        { size: 'XL', variantId: '50836232634680', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232634680:1?channel=buy_button' },
        { size: '2XL', variantId: '50836232667448', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232667448:1?channel=buy_button' },
        { size: '3XL', variantId: '50836232700216', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232700216:1?channel=buy_button' },
        { size: '4XL', variantId: '50836232732984', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232732984:1?channel=buy_button' }
      ]
    },
    {
      id: "jersey-04",
      name: "Maillot Blanc",
      color: "Blanc", 
      description: "Maillot du Jeune Coureur - Récompense le meilleur coureur de moins de 25 ans",
      image: "/product_images_4/main_product.jpg",
      shopifyVariants: [
        { size: 'XS', variantId: '50836212842808', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836212842808:1?channel=buy_button' },
        { size: 'S', variantId: '50836232765752', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232765752:1?channel=buy_button' },
        { size: 'M', variantId: '50836232798520', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232798520:1?channel=buy_button' },
        { size: 'L', variantId: '50836232831288', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232831288:1?channel=buy_button' },
        { size: 'XL', variantId: '50836232864056', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232864056:1?channel=buy_button' },
        { size: '2XL', variantId: '50836232896824', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232896824:1?channel=buy_button' },
        { size: '3XL', variantId: '50836232929592', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232929592:1?channel=buy_button' },
        { size: '4XL', variantId: '50836232962360', shopifyUrl: 'https://nkgzhm-1d.myshopify.com/cart/50836232962360:1?channel=buy_button' }
      ]
    }
  ],
  images: [
    {
      url: "/product_images/main_product.jpg",
      alt_text: "Maillot Légendaire du Tour de France 2025 - Vue principale",
      type: "main"
    },
    {
      url: "/product_images_2/main_product.jpg", 
      alt_text: "Maillot Polka - Meilleur Grimpeur du Tour de France 2025",
      type: "thumbnail_2"
    },
    {
      url: "/product_images_3/main_product.jpg",
      alt_text: "Maillot Vert - Sprinter du Tour de France 2025", 
      type: "thumbnail_3"
    },
    {
      url: "/product_images_4/main_product.jpg",
      alt_text: "Maillot Blanc - Jeune Coureur du Tour de France 2025",
      type: "thumbnail_4"
    }
  ]
}

const ProductPage = () => {
  // State for selected variant to control the main image display
  const [selectedVariant, setSelectedVariant] = useState<string>('jersey-01')
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  // Handle variant change from ProductInfo
  const handleVariantChange = (variantId: string) => {
    setSelectedVariant(variantId)
    
    // Map variant to corresponding image index in the carousel
    const variantToImageMap: { [key: string]: number } = {
      'jersey-01': 0, // main_product.jpg from product_images (yellow)
      'jersey-02': 1, // main_product.jpg from product_images_2 (polka)
      'jersey-03': 2, // main_product.jpg from product_images_3 (green)
      'jersey-04': 3  // main_product.jpg from product_images_4 (white)
    }
    
    const imageIndex = variantToImageMap[variantId]
    if (imageIndex !== undefined) {
      setSelectedImageIndex(imageIndex)
    }
  }

  // Handle direct image selection from carousel
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
    
    // Optionally, update variant if user clicks on variant images directly
    const imageToVariantMap: { [key: number]: string } = {
      0: 'jersey-01', // main image (yellow)
      1: 'jersey-02', // thumbnail_2 (polka)
      2: 'jersey-03', // thumbnail_3 (green)
      3: 'jersey-04'  // thumbnail_4 (white)
    }
    
    const variantId = imageToVariantMap[index]
    if (variantId && variantId !== selectedVariant) {
      setSelectedVariant(variantId)
    }
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tour de France', href: '/tour-de-france' },
    { label: 'Maillot Légendaire du Tour de France 2025', href: '#', current: true }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
           
      {/* Main Content */}
      <main className="container mx-auto px-4 pb-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images - Left Column */}
          <div className="lg:col-span-8">
            <ProductImageGallery 
              images={mockProduct.images} 
              productTitle={mockProduct.title}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={handleImageSelect}
            />
          </div>
          
          {/* Product Info - Right Column */}
          <div className="lg:col-span-4">
            <ProductInfo 
              product={mockProduct} 
              onVariantChange={handleVariantChange}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>
      </main>

      {/* Global Footer Main Section */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-6">
            {/* Essential Links */}
            <div className="flex flex-wrap justify-center space-x-8 text-sm">
              <a href="/customer-help-desk/hd-1" className="text-black hover:text-blue-800 transition-colors" title="Aidez moi">
                Aidez moi
              </a>
              <a href="/returns-policy" className="text-black hover:text-blue-800 transition-colors" title="Retours sous 90 jours">
                Retours sous 90 jours
              </a>
              <a href="/track-orders/ch-1368" className="text-black hover:text-blue-800 transition-colors" title="Suivre ma commande">
                Suivre ma commande
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="//www.facebook.com/letour" data-trk-id="facebook" aria-label="Facebook" target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors icon-fa-facebook" title="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="//twitter.com/letour" data-trk-id="x" aria-label="X" target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors icon-fa-x-twitter" title="X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="//www.instagram.com/letourdefrance/" data-trk-id="instagram" aria-label="Instagram" target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors icon-fa-instagram" title="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297C4.198 14.894 3.708 13.743 3.708 12.446s.49-2.448 1.415-3.326c.878-.807 2.029-1.297 3.326-1.297s2.448.49 3.326 1.297c.925.878 1.415 2.029 1.415 3.326s-.49 2.448-1.415 3.245c-.878.807-2.029 1.297-3.326 1.297zm7.598 0c-1.297 0-2.448-.49-3.326-1.297-.925-.797-1.415-1.948-1.415-3.245s.49-2.448 1.415-3.326c.878-.807 2.029-1.297 3.326-1.297s2.448.49 3.326 1.297c.925.878 1.415 2.029 1.415 3.326s-.49 2.448-1.415 3.245c-.878.807-2.029 1.297-3.326 1.297z"/>
                </svg>
              </a>
              <a href="//www.youtube.com/user/letourdefrance" data-trk-id="you-tube" aria-label="YouTube" target="_blank" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors icon-fa-youtube-play" title="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          {/* Footer Links */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
              <a href="/privacy-policy" data-trk-id="politique-de-confidentialite" aria-label="Politique de confidentialité" className="text-gray-300 hover:text-white transition-colors" title="Politique de confidentialité">
                Politique de confidentialité
              </a>
              <a href="/accessibility/ch-7657" data-trk-id="accessibilite" aria-label="Accessibilité" className="text-gray-300 hover:text-white transition-colors" title="Accessibilité">
                Accessibilité
              </a>
              <a href="/terms-of-use" data-trk-id="termes-et-conditions" aria-label="Termes et Conditions" className="text-gray-300 hover:text-white transition-colors" title="Termes et Conditions">
                Termes et Conditions
              </a>
              <a href="/sitemap" data-trk-id="plan-du-site" aria-label="Plan du Site" className="text-gray-300 hover:text-white transition-colors" title="Plan du Site">
                Plan du Site
              </a>
              <a href="/cookie-policy/ch-3868" data-trk-id="politique-et-gestion-des-cookies" aria-label="Politique et gestion des cookies" className="text-gray-300 hover:text-white transition-colors" title="Politique et gestion des cookies">
                Politique et gestion des cookies
              </a>
              <a href="/product-concerns/ch-7032" data-trk-id="problemes-lies-aux-produits" aria-label="Problèmes liés aux produits" className="text-gray-300 hover:text-white transition-colors" title="Problèmes liés aux produits">
                Problèmes liés aux produits
              </a>
            </div>
          </div>

          {/* Copyright Message */}
          <div className="text-center text-gray-400 text-sm leading-relaxed">
            © 2025, Fanatics, LLC. et / ou ses entités affiliées. Tous les droits sont réservés. Aucune partie de ce site ne peut être reproduite ou dupliquée sans l&apos;autorisation expresse de Fanatics.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductPage
