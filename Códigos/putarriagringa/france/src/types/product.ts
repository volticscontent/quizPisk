export interface ProductImage {
  url: string;
  alt_text: string;
  type: string;
  width?: number;
  height?: number;
}

export interface ShopifyVariant {
  size: string;
  variantId: string;
  shopifyUrl: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  color: string;
  description: string;
  image: string;
  shopifyVariants: ShopifyVariant[];
}

export interface ProductInfo {
  title: string;
  product_id: string;
  description: string;
  pricing: {
    regular_price: string;
    discount_price: string;
    discount_code: string;
  };
  availability: string;
  brand: string;
  category: string;
  sizes: string[];
  country_origin: string;
  images: ProductImage[];
  originalUrl?: string;
  variants?: ProductVariant[];
}

export interface Size {
  size: string;
  available: boolean;
  selected?: boolean;
} 