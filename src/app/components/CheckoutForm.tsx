import React from 'react';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../store/cartStore';

export interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  stage: string;
  notes: string;
}

export interface CheckoutFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setShowSuccess: (show: boolean) => void;
  setErrorMessage: (msg: string) => void;
  setIsCheckingOut: (checkingOut: boolean) => void;
  errorMessage: string;
  items: CartItem[];
  total: number;
  clearCart: () => void;
  onPlaceOrderClick: () => void; // new prop
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  setFormData,
  setShowSuccess,
  setErrorMessage,
  setIsCheckingOut,
  errorMessage,
  onPlaceOrderClick,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Remove handleSubmit or keep only to prevent form submit on Enter key
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      {/* Your form inputs here */}

      <button
        className="checkout-btn"
        type="button" // IMPORTANT: prevent default form submit
        onClick={onPlaceOrderClick}
      >
        Place Order
      </button>
      <button
        className="checkout-btn"
        type="button"
        onClick={() => setIsCheckingOut(false)}
      >
        Cancel
      </button>
    </form>
  );
};
