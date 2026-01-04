
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import TopPage from '@/pages/TopPage';
import DiagnosisPage from '@/pages/DiagnosisPage';
import ResultPage from '@/pages/ResultPage';
import NotePage from '@/pages/NotePage';
import FAQPage from '@/pages/FAQPage';

function App() {
  return (
    <>
      <Helmet>
        {/* デフォルトのメタタグ（個別ページで上書きされる） */}
        <title>距離感診断 | 二人の心の距離を0〜100で見える化 - 無料ペア診断</title>
        <meta name="description" content="30問の質問で二人の距離感と相性を診断！Z世代向けの無料ペア診断サイト。カップルや友達同士で使える、距離感診断・ペア診断・ペアタイプ診断。" />
        <meta name="keywords" content="距離感診断,ペア診断,ペアタイプ,相性診断,関係性診断,カップル診断,友達診断,距離感,心の距離,相性,ペア,診断,無料" />
        
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "距離感診断",
            "description": "30問の質問で二人の距離感と相性を診断する無料ペア診断サイト",
            "url": "https://yourdomain.com/",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "JPY"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "ratingCount": "100"
            },
            "keywords": "距離感診断,ペア診断,ペアタイプ,相性診断,関係性診断"
          })}
        </script>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/diagnosis/:role" element={<DiagnosisPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/note" element={<NotePage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
