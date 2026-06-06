'use client';

import { useState } from 'react';

interface Product {
  id: string;
  emoji: string;
  badge?: string;
  name: string;
  farmer: string;
  price: string;
  unit: string;
  category: 'vegetables' | 'fruits' | 'dairy';
}

export default function Products() {
  const [activeTab, setActiveTab] = useState<'all' | 'vegetables' | 'fruits' | 'dairy'>('all');

  const products: Product[] = [
    {
      id: 'p1',
      emoji: '🍅',
      badge: 'Organic',
      name: 'Country Tomatoes',
      farmer: 'by Ravi Kumar, Punjab',
      price: '₹40',
      unit: '/ kg',
      category: 'vegetables',
    },
    {
      id: 'p2',
      emoji: '🥛',
      badge: 'Raw',
      name: 'Fresh Buffalo Milk',
      farmer: 'by Meena Devi, Haryana',
      price: '₹65',
      unit: '/ litre',
      category: 'dairy',
    },
    {
      id: 'p3',
      emoji: '🥭',
      badge: 'Seasonal',
      name: 'Alphonso Mangoes',
      farmer: 'by Suresh Patil, Maharashtra',
      price: '₹180',
      unit: '/ dozen',
      category: 'fruits',
    },
    {
      id: 'p4',
      emoji: '🧅',
      name: 'Red Onions',
      farmer: 'by Lakshmi Reddy, Karnataka',
      price: '₹28',
      unit: '/ kg',
      category: 'vegetables',
    },
    {
      id: 'p5',
      emoji: '🧀',
      badge: 'Handmade',
      name: 'Farm Paneer',
      farmer: 'by Gurpreet Singh, Amritsar',
      price: '₹220',
      unit: '/ kg',
      category: 'dairy',
    },
    {
      id: 'p6',
      emoji: '🍌',
      name: 'Nendran Bananas',
      farmer: 'by Thomas, Kerala',
      price: '₹55',
      unit: '/ dozen',
      category: 'fruits',
    },
    {
      id: 'p7',
      emoji: '🥬',
      badge: 'Organic',
      name: 'Palak Bunches',
      farmer: 'by Anita Sharma, Rajasthan',
      price: '₹15',
      unit: '/ bunch',
      category: 'vegetables',
    },
    {
      id: 'p8',
      emoji: '🍶',
      name: 'Pure Ghee',
      farmer: 'by Vijay Rao, Uttar Pradesh',
      price: '₹580',
      unit: '/ kg',
      category: 'dairy',
    },
  ];

  const tabs: { label: string; id: 'all' | 'vegetables' | 'fruits' | 'dairy' }[] = [
    { label: 'All', id: 'all' },
    { label: 'Vegetables', id: 'vegetables' },
    { label: 'Fruits', id: 'fruits' },
    { label: 'Dairy', id: 'dairy' },
  ];

  return (
    <section id="products" className="products-section">
      <div className="products-header reveal">
        <div>
          <div className="section-eyebrow">What&apos;s Available</div>
          <h2 className="section-title">
            Fresh from <em>today&apos;s</em> harvest.
          </h2>
        </div>
        <a href="#">View all listings →</a>
      </div>

      <div className="product-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const isShown = activeTab === 'all' || product.category === activeTab;
          return (
            <div
              key={product.id}
              className={`product-card ${isShown ? 'shown' : ''}`}
            >
              <span className="product-emoji">{product.emoji}</span>
              {product.badge && <div className="product-badge">{product.badge}</div>}
              <div className="product-name">{product.name}</div>
              <div className="product-farmer">{product.farmer}</div>
              <div className="product-price">
                {product.price} <span>{product.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
