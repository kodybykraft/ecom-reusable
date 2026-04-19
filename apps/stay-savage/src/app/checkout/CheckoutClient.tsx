'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, useCheckout } from '@ecom/react';
import { toast } from 'sonner';

const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

type Step = 'shipping' | 'review';

export function CheckoutClient() {
  const router = useRouter();
  const { cart } = useCart();
  const { create, updateShipping, complete, loading } = useCheckout();

  const [step, setStep] = useState<Step>('shipping');
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Shipping form state
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-24 md:py-32">
        <h1 className="text-3xl font-bold mb-4">NOTHING TO CHECK OUT</h1>
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <a
          href="/shop"
          className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-bold hover:bg-accent/90 transition-colors"
        >
          Shop Now
        </a>
      </div>
    );
  }

  const validateShipping = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email required';
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.addressLine1.trim()) errs.addressLine1 = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.postcode.trim()) errs.postcode = 'Required';
    else if (!UK_POSTCODE_RE.test(form.postcode))
      errs.postcode = 'Valid UK postcode required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingSubmit = async () => {
    if (!validateShipping()) return;

    setSubmitting(true);
    try {
      const checkout = await create(cart.id, form.email);
      setCheckoutId(checkout.id);

      await updateShipping(checkout.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        address1: form.addressLine1,
        address2: form.addressLine2 || undefined,
        city: form.city,
        province: form.county || undefined,
        zip: form.postcode.toUpperCase(),
        country: 'GB',
      });

      setStep('review');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create checkout');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!checkoutId) return;

    setSubmitting(true);
    try {
      const result = await complete(checkoutId);
      // Redirect to confirmation with order ID
      router.push(`/order-confirmation?order=${result.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`text-sm font-bold uppercase tracking-widest ${
            step === 'shipping' ? 'text-accent' : 'text-muted-foreground'
          }`}
        >
          1. Shipping
        </div>
        <div className="h-px flex-1 bg-border" />
        <div
          className={`text-sm font-bold uppercase tracking-widest ${
            step === 'review' ? 'text-accent' : 'text-muted-foreground'
          }`}
        >
          2. Review & Pay
        </div>
      </div>

      {step === 'shipping' && (
        <div>
          <h1 className="text-3xl font-bold mb-8">SHIPPING DETAILS</h1>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-bold block mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full p-3 glass-subtle  text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full p-3 glass-subtle  text-foreground focus:border-accent focus:outline-none"
                />
                {errors.firstName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full p-3 glass-subtle  text-foreground focus:border-accent focus:outline-none"
                />
                {errors.lastName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-bold block mb-1">
                Phone <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+44 7XXX XXXXXX"
                className="w-full p-3 glass-subtle  text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-bold block mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={form.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                className="w-full p-3 glass-subtle  text-foreground focus:border-accent focus:outline-none"
              />
              {errors.addressLine1 && (
                <p className="text-destructive text-xs mt-1">
                  {errors.addressLine1}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold block mb-1">
                Address Line 2{' '}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={form.addressLine2}
                onChange={(e) => updateField('addressLine2', e.target.value)}
                className="w-full p-3 glass-subtle  text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            {/* City + County */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold block mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full p-3 glass-subtle  text-foreground focus:border-accent focus:outline-none"
                />
                {errors.city && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.city}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">
                  County{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.county}
                  onChange={(e) => updateField('county', e.target.value)}
                  className="w-full p-3 glass-subtle  text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Postcode */}
            <div>
              <label className="text-sm font-bold block mb-1">Postcode</label>
              <input
                type="text"
                value={form.postcode}
                onChange={(e) => updateField('postcode', e.target.value)}
                placeholder="E13 0QS"
                className="w-full p-3 glass-subtle  text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              {errors.postcode && (
                <p className="text-destructive text-xs mt-1">
                  {errors.postcode}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleShippingSubmit}
            disabled={submitting}
            className="w-full mt-8 py-4 bg-accent text-accent-foreground font-bold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Processing...' : 'Continue to Review'}
          </button>
        </div>
      )}

      {step === 'review' && (
        <div>
          <h1 className="text-3xl font-bold mb-8">REVIEW YOUR ORDER</h1>

          {/* Shipping Summary */}
          <div className="glass  p-6 mb-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold uppercase tracking-widest text-sm">
                Shipping To
              </h3>
              <button
                onClick={() => setStep('shipping')}
                className="text-accent text-sm hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="text-muted-foreground text-sm">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-muted-foreground text-sm">
              {form.addressLine1}
              {form.addressLine2 && `, ${form.addressLine2}`}
            </p>
            <p className="text-muted-foreground text-sm">
              {form.city}
              {form.county && `, ${form.county}`}, {form.postcode.toUpperCase()}
            </p>
            <p className="text-muted-foreground text-sm">{form.email}</p>
          </div>

          {/* Order Items */}
          <div className="glass  p-6 mb-6">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-4">
              Order Items
            </h3>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.variant.product?.title || item.variant.title} ×{' '}
                    {item.quantity}
                  </span>
                  <span className="font-bold">
                    £{((item.variant.price * item.quantity) / 100).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>£{(cart.subtotal / 100).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-accent">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span>£{(cart.subtotal / 100).toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Discount Code */}
          <div className="glass p-6 mb-6">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-3">Discount Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                className="flex-1 p-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none text-sm"
              />
              <button
                type="button"
                className="px-6 py-3 border border-border text-sm font-bold hover:border-foreground transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="glass p-3 text-center">
              <p className="text-xs font-bold">SECURE PAYMENT</p>
            </div>
            <div className="glass p-3 text-center">
              <p className="text-xs font-bold">FREE SHIPPING</p>
            </div>
            <div className="glass p-3 text-center">
              <p className="text-xs font-bold">30-DAY RETURNS</p>
            </div>
          </div>

          {/* Place Order */}
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="w-full py-4 bg-foreground text-background font-bold text-sm tracking-[0.15em] uppercase hover:opacity-90 press-active transition-all disabled:opacity-50"
          >
            {submitting ? 'Placing Order...' : `Place Order — £${(cart.subtotal / 100).toFixed(0)}`}
          </button>

          <p className="text-muted-foreground text-xs text-center mt-4">
            By placing this order you agree to our{' '}
            <a href="/terms" className="underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
