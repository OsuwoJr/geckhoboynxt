'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import Image from 'next/image';
import '../styles/cart.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  stage: string;
  notes: string;
  transactionId: string;
}

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    stage: '',
    notes: '',
    transactionId: ''
  });

  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const total = getTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsCheckingOut(false);
      setShowSuccess(false);
      setErrorMessage('');
    }
  };

  const proceedToCheckout = () => {
    console.log('Proceeding to checkout...');
    setIsCheckingOut(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showSuccess) {
      setErrorMessage('Please complete the payment first');
      return;
    }

    try {
      const orderDetails = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      const response = await fetch('https://formspree.io/f/xbloyloq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          orderDetails,
          totalAmount: total,
          paymentStatus: 'Completed',
          paymentMethod: 'Swypt'
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        clearCart();
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          stage: '',
          notes: '',
          transactionId: ''
        });
      } else {
        setErrorMessage('Failed to submit order. Please try again.');
      }
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.cart-container') && !target.closest('.cart-toggle')) {
        setIsOpen(false);
        setIsCheckingOut(false);
        setShowSuccess(false);
        setErrorMessage('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Add debug logging
  useEffect(() => {
    console.log('Cart state:', {
      isOpen,
      isCheckingOut,
      showSuccess,
      items: items.length,
      total
    });
  }, [isOpen, isCheckingOut, showSuccess, items, total]);

  return (
    <div className="cart-wrapper">
      <button className="cart-toggle" onClick={toggleCart}>
        <i className="fas fa-shopping-cart"></i>
        {items.length > 0 && (
          <span className="cart-count">{items.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="cart-container">
          <div className="cart-header">
            <h3>Shopping Cart</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : showSuccess ? (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <h4>Order Placed Successfully!</h4>
              <p>Thank you for your order. We&apos;ll contact you shortly with the next steps.</p>
              <button className="continue-shopping" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </button>
            </div>
          ) : isCheckingOut ? (
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required 
                  rows={2}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stage">Closest Stage/Stop *</label>
                  <input 
                    type="text" 
                    id="stage" 
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    required 
                    placeholder="e.g., Muthurwa Stage"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Order Notes</label>
                <textarea 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="transactionId">Transaction ID *</label>
                <input 
                  type="text" 
                  id="transactionId" 
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  required 
                  placeholder="Enter your Swypt transaction ID"
                />
              </div>

              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}

              <div className="order-summary">
                <h4>Order Summary</h4>
                <div className="summary-items">
                  {items.map(item => (
                    <div key={item.id} className="summary-item">
                      <span>{item.name} x {item.quantity}</span>
                      <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="back-btn" 
                  onClick={() => setIsCheckingOut(false)}
                >
                  Back to Cart
                </button>
                <button 
                  type="button" 
                  className="payment-btn"
                  onClick={() => {
                    // Open Swypt payment in a new window
                    window.open('https://swypt.io/pay', '_blank');
                  }}
                >
                  Pay Now
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                >
                  Place Order
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="cart-items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      width={60}
                      height={60}
                      className="cart-item-image"
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="price">KES {item.price.toLocaleString()}</p>
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>×</button>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="total">
                  <span>Total:</span>
                  <span className="total-amount">KES {total.toLocaleString()}</span>
                </div>
                <button 
                  className="checkout-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Checkout button clicked');
                    console.log('Current cart state:', {
                      isOpen,
                      isCheckingOut,
                      items: items.length,
                      total
                    });
                    proceedToCheckout();
                  }}
                >
                  Proceed to Checkout ({items.length} items)
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 