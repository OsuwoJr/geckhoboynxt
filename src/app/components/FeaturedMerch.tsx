'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '../store/cartStore';
import type { CartStore } from '../store/cartStore';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  backImage: string;
}

const products: Product[] = [
  {
    id: 'classic-tee',
    name: 'GECKHOBOY Classic Tee',
    description: 'Premium quality cotton t-shirt with the iconic GECKHOBOY logo.',
    price: 2500,
    image: '/images/classic-tee-front.jpg',
    backImage: '/images/classic-tee-back.jpg'
  },
  {
    id: 'street-hoodie',
    name: 'Street Style Hoodie',
    description: 'Comfortable and stylish hoodie perfect for any occasion.',
    price: 4500,
    image: '/images/hoodie-front.jpg',
    backImage: '/images/hoodie-back.jpg'
  },
  {
    id: 'urban-cap',
    name: 'Urban Cap',
    description: 'Classic cap with embroidered GECKHOBOY branding.',
    price: 1800,
    image: '/images/cap-front.jpg',
    backImage: '/images/cap-back.jpg'
  }
];

const FeaturedMerch: React.FC = () => {
  const [flippedStates, setFlippedStates] = useState<Record<string, boolean>>(
    products.reduce((acc, product) => {
      acc[product.id] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const addItem = useCartStore((state: CartStore) => state.addItem);

  const toggleFlip = (productId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setFlippedStates(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <section className="py-16 px-4 bg-black text-white" id="featured-products">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl mb-12 text-[#a0b921] uppercase tracking-wider font-['Impact']">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {products.map((product) => (
            <div 
              key={product.id}
              className={`product-card bg-[rgba(17,17,17,0.8)] rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 border border-[rgba(160,185,33,0.1)] ${
                flippedStates[product.id] ? 'flipped' : ''
              }`}
            >
              <div className="relative w-full perspective-1000">
                <div 
                  className={`relative w-full h-[300px] transform-style-3d transition-transform duration-800 cursor-pointer bg-[rgba(17,17,17,0.8)] ${
                    flippedStates[product.id] ? 'rotate-y-180' : ''
                  }`}
                  onClick={(e) => toggleFlip(product.id, e)}
                  onTouchEnd={(e) => toggleFlip(product.id, e)}
                >
                  <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-4">
                    <Image
                      src={product.backImage}
                      alt={`${product.name} back`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl mb-2 text-white">{product.name}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                <p className="text-2xl font-bold text-[#a0b921] mb-4">
                  KES {product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3 bg-[#a0b921] text-black rounded-lg font-semibold transition-colors duration-300 hover:bg-[#8aa31d]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedMerch; 