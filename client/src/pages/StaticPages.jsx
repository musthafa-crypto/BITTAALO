import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Are all products available for Cash on Delivery (COD) in India?',
      a: 'Yes! We support Cash on Delivery (COD) across 26,000+ pin codes in India. You can pay cash or scan the courier agent’s UPI QR code at delivery.',
    },
    {
      q: 'How long does shipping take?',
      a: 'Orders are dispatched within 24 hours from our Bengaluru / Mumbai fulfillment hubs. Delivery to metro cities takes 2-3 business days, and 4-6 days for other regions.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer a 7-day hassle-free return and exchange guarantee. If an item does not fit or you wish to exchange variants, message us on WhatsApp (+91 9037489104) and we will arrange a reverse pickup.',
    },
    {
      q: 'Are BITTAALO sunglasses UV400 polarized?',
      a: 'Yes. All BITTAALO sunglasses feature certified UV400 anti-reflective polarized lenses that eliminate 100% of UVA and UVB radiation.',
    },
    {
      q: 'Will the stainless steel jewellery tarnish or turn skin green?',
      a: 'Never. Our jewellery is manufactured using solid 316L hypoallergenic surgical stainless steel, finished with high-vacuum PVD 18K gold or gunmetal plating that is completely sweat and waterproof.',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-12">
      <SEO title="Frequently Asked Questions" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center">
          <span className="text-brand-600 font-extrabold text-xs uppercase tracking-widest">Help Center</span>
          <h1 className="font-display font-black text-3xl text-zinc-950 uppercase tracking-tight mt-1">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 text-xs sm:text-sm font-bold text-zinc-900"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-zinc-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 text-white text-center">
          <p className="text-xs mb-3 text-zinc-300">Still have questions? Our WhatsApp concierge is ready to help.</p>
          <a
            href="https://wa.me/919037489104"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 bg-brand-400 text-black text-xs font-bold uppercase rounded-lg"
          >
            Chat on WhatsApp (+91 9037489104)
          </a>
        </div>
      </div>
    </div>
  );
};

export const ShippingReturnsPage = () => (
  <div className="w-full bg-[#FAFAFA] min-h-screen py-12">
    <SEO title="Shipping & Returns" />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm text-xs leading-relaxed text-zinc-700">
      <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight mb-4">
        Shipping & Returns Policy
      </h1>

      <div className="space-y-4">
        <h3 className="font-bold text-sm text-zinc-900 uppercase">1. Domestic Delivery</h3>
        <p>BITTAALO provides door-to-door express delivery across India. Free shipping applies automatically to all orders with cart subtotal of ₹999 or more. For orders below ₹999, a flat shipping fee of ₹99 is applied.</p>

        <h3 className="font-bold text-sm text-zinc-900 uppercase pt-2">2. Order Tracking</h3>
        <p>Once your order is handed over to our logistics partner (Bluedart, Delhivery, or DTDC), tracking numbers are dispatched via SMS, email, and WhatsApp.</p>

        <h3 className="font-bold text-sm text-zinc-900 uppercase pt-2">3. 7-Day Returns & Exchanges</h3>
        <p>We want you to be 100% satisfied with your gear. We accept unworn returns in original packaging with tags intact within 7 calendar days of delivery. Reverse pickup is arranged from your doorstep.</p>

        <h3 className="font-bold text-sm text-zinc-900 uppercase pt-2">4. Damaged or Incorrect Shipments</h3>
        <p>If you receive a damaged package, reach out to us within 48 hours at <strong>bittaalo@gmail.com</strong> or WhatsApp <strong>+91 9037489104</strong> with a picture, and we will send an immediate priority replacement.</p>
      </div>
    </div>
  </div>
);

export const PrivacyPolicyPage = () => (
  <div className="w-full bg-[#FAFAFA] min-h-screen py-12">
    <SEO title="Privacy Policy" />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm text-xs leading-relaxed text-zinc-700">
      <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight mb-4">
        Privacy Policy
      </h1>
      <p>At BITTAALO (accessible at bittaalo.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by BITTAALO and how we use it.</p>
      <h3 className="font-bold text-sm text-zinc-900 uppercase">Information We Collect</h3>
      <p>We collect information you provide directly to us when placing orders, creating accounts, or submitting customer inquiries (such as name, email, phone number, and delivery address).</p>
      <h3 className="font-bold text-sm text-zinc-900 uppercase">Payment Security</h3>
      <p>We do not store your credit card or debit card numbers on our servers. All online transactions are tokenized and processed via certified PCI-DSS compliant Razorpay payment gateways.</p>
    </div>
  </div>
);

export const TermsPage = () => (
  <div className="w-full bg-[#FAFAFA] min-h-screen py-12">
    <SEO title="Terms of Service" />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm text-xs leading-relaxed text-zinc-700">
      <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-950 uppercase tracking-tight mb-4">
        Terms of Service
      </h1>
      <p>By accessing and placing an order with BITTAALO, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below.</p>
      <h3 className="font-bold text-sm text-zinc-900 uppercase">Pricing & Currency</h3>
      <p>All prices listed on the BITTAALO storefront are in Indian Rupees (INR ₹) and are inclusive of Goods and Services Tax (GST).</p>
      <h3 className="font-bold text-sm text-zinc-900 uppercase">Intellectual Property</h3>
      <p>BITTAALO brand marks, logos, photography, typography, and designs are the exclusive property of BITTAALO Lifestyle Accessories.</p>
    </div>
  </div>
);

export const NotFoundPage = () => (
  <div className="w-full bg-[#FAFAFA] min-h-[70vh] flex items-center justify-center py-16 px-4 text-center">
    <SEO title="Page Not Found (404)" />
    <div className="max-w-md space-y-4">
      <span className="text-6xl font-black font-display text-zinc-300">404</span>
      <h1 className="font-display font-black text-2xl text-zinc-950 uppercase tracking-tight">
        Lost In The Streets?
      </h1>
      <p className="text-xs text-zinc-500">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
      >
        <span>Return to Homepage</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  </div>
);
