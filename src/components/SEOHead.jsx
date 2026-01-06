import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * SEO最適化用のヘルパーコンポーネント
 * 各ページで使用する共通のSEOメタタグを生成
 */
const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  canonical,
  noindex = false,
  structuredData
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com';
  const defaultKeywords = '距離感診断,ペア診断,仲良さ診断,相性診断,関係性診断,カップル診断,友達診断,距離感,心の距離,相性,ペア,診断,無料,仲良し度';
  const defaultOgImage = `${siteUrl}/og-image.jpg`;
  
  const finalKeywords = keywords ? `${defaultKeywords},${keywords}` : defaultKeywords;
  const finalOgImage = ogImage || defaultOgImage;
  const finalCanonical = canonical || `${siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={finalKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content="距離感診断" />
      <meta property="og:locale" content="ja_JP" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;

