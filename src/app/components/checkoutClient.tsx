import React, { useState } from 'react';
import {CheckoutForm,  FormData } from './CheckoutForm';
import { DepositModal } from 'swypt-checkout';
import { useCartStore } from '../store/cartStore';

const CheckoutClient = () => {
  const { items, clearCart, getTotal } = useCartStore();
  const total = getTotal();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    stage: '',
    notes: '',
    // transactionId removed as you requested
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(true);

  // Swypt modal open state
  const [isSwyptOpen, setIsSwyptOpen] = useState(false);

  // Called when Place Order clicked
  const handlePlaceOrderClick = () => {
    // validate form fields here if needed
    // if valid, open Swypt modal
    setIsSwyptOpen(true);
  };

  // Called when Swypt payment completes successfully
  const handlePaymentSuccess = async (paymentData: any) => {
    // You might want to capture paymentData.transactionId etc here

    setIsSwyptOpen(false);

    try {
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          items,
          total,
          paymentData, // send payment info if needed
        }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      setShowSuccess(true);
      clearCart();
      setErrorMessage('');
      setIsCheckingOut(false);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to place the order. Please try again.');
    }
  };

  return (
    <>
      {isCheckingOut && (
        <CheckoutForm
          formData={formData}
          setFormData={setFormData}
          setShowSuccess={setShowSuccess}
          setErrorMessage={setErrorMessage}
          setIsCheckingOut={setIsCheckingOut}
          errorMessage={errorMessage}
          items={items}
          total={total}
          clearCart={clearCart}
          onPlaceOrderClick={handlePlaceOrderClick} // pass this handler
        />
      )}

      <DepositModal
        isOpen={isSwyptOpen}
        onClose={() => setIsSwyptOpen(false)}
        headerBackgroundColor="linear-gradient(to right, #DD268A, #FF4040)"
        businessName="Your Business"
        merchantName="Your Merchant"
        merchantAddress="0x6d19a24D93379D1bA58d28884fFBBEf1bc145387"
        amount={total}
        // onSuccess={handlePaymentSuccess} // assuming SDK supports this callback
      />
    </>
  );
};

export default CheckoutClient;
