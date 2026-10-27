import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SEO = ({
  title,
  description = 'Shop luxury streetwear & lifestyle accessories in India. Polarized shades, caps, Cuban chains, tactical shorts, RFID wallets, and more at BITTAALO.',
  keywords = 'accessories, streetwear india, sunglasses, caps, jewellery, watches, wallets, shorts, belts, footwear, bittaalo',
  image = '/logo.png',
}) => {
  const siteTitle = title ? `${title} | BITTAALO` : 'BITTAALO | Premium Lifestyle Accessories India';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
