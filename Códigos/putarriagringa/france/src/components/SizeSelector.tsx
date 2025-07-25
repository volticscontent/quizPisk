'use client'

import React, { useState } from 'react'

interface SizeSelectorProps {
  sizes: string[]
  onSizeSelect: (size: string) => void
  selectedSize?: string
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ 
  sizes, 
  onSizeSelect, 
  selectedSize 
}) => {
  const [showSizeChart, setShowSizeChart] = useState(false)

  // Simulando alguns tamanhos indisponíveis baseado no HTML original
  const unavailableSizes: string[] = []

  return (
    <div className="bg-white p-4 mb-0">
      {/* Header */}
      <div className="flex items-center justify-between mx-3">
        <div className="flex items-center space-x-4">
          <legend className="text-base font-medium text-gray-900">Taille</legend>
          {selectedSize && (
            <span className="text-gray-600 text-sm">{selectedSize}</span>
          )}
        </div>
        <button 
          onClick={() => setShowSizeChart(true)}
          className="text-[#3863a3] hover:text-[#c7fbff] underline text-sm uppercase"
        >
          TABLEAU DES TAILLES
        </button>
      </div>

      {/* Size Options - Grid layout similar to original */}
      <div className="grid grid-cols-4 gap-2 mx-3 text-black" role="radiogroup" aria-label="Size">
        {sizes.map((size) => {
          const isUnavailable = unavailableSizes.includes(size)
          const isSelected = selectedSize === size
          
          return (
            <label 
              key={size}
              className={`
                radio size-selector-button rectangle cursor-pointer
                h-12 border border-gray-300 rounded flex items-center justify-center font-medium transition-all
                ${isSelected 
                  ? 'bg-[#ff0] border-[#ff0] text-black selected' 
                  : isUnavailable 
                    ? 'bg-white border-gray-300 text-gray-400 cursor-not-allowed unavailable' 
                    : 'bg-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 available text-black'
                }
              `}
            >
              <input
                type="radio"
                name="size-selector"
                value={size}
                checked={isSelected}
                onChange={() => !isUnavailable && onSizeSelect(size)}
                disabled={isUnavailable}
                className="sr-only"
                aria-label={`Size ${size} ${isUnavailable ? 'Out of Stock' : ''}`}
              />
              <span className="radio-children">
                <div className="size-text" aria-hidden="true">
                  {size}
                </div>
              </span>
            </label>
          )
        })}
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-[#111111]">Tableau des Tailles</h2>
                <button 
                  onClick={() => setShowSizeChart(false)}
                  className="text-black hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-1 font-sans text-[#252525] text-left">Taille</th>
                      <th className="border border-gray-300 p-1 font-sans text-[#252525] text-left">Poitrine (cm)</th>
                      <th className="border border-gray-300 p-1 font-sans text-[#252525] text-left">Taille (cm)</th>
                      <th className="border border-gray-300 p-1 font-sans text-[#252525] text-left">Longueur (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 p-1 text-black">XS</td><td className="border border-gray-300 p-1 text-black">88-92</td><td className="border border-gray-300 p-1 text-black">76-80</td><td className="border border-gray-300 p-1 text-black">68</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">S</td><td className="border border-gray-300 p-1 text-black">92-96</td><td className="border border-gray-300 p-1 text-black">80-84</td><td className="border border-gray-300 p-1 text-black">70</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">M</td><td className="border border-gray-300 p-1 text-black">96-100</td><td className="border border-gray-300 p-1 text-black">84-88</td><td className="border border-gray-300 p-1 text-black">72</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">L</td><td className="border border-gray-300 p-1 text-black">100-104</td><td className="border border-gray-300 p-1 text-black">88-92</td><td className="border border-gray-300 p-1 text-black">74</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">XL</td><td className="border border-gray-300 p-1 text-black">104-108</td><td className="border border-gray-300 p-1 text-black">92-96</td><td className="border border-gray-300 p-1 text-black">76</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">2XL</td><td className="border border-gray-300 p-1 text-black">108-112</td><td className="border border-gray-300 p-1 text-black">96-100</td><td className="border border-gray-300 p-1 text-black ">78</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">3XL</td><td className="border border-gray-300 p-1 text-black">112-116</td><td className="border border-gray-300 p-1 text-black">100-104</td><td className="border border-gray-300 p-1 text-black">80</td></tr>
                    <tr><td className="border border-gray-300 p-1 text-black">4XL</td><td className="border border-gray-300 p-1 text-black">116-120</td><td className="border border-gray-300 p-1 text-black">104-108</td><td className="border border-gray-300 p-1 text-black">82</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeSelector 