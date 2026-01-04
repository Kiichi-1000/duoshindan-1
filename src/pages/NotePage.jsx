
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pairTypes } from '@/data/pairTypes';

const NotePage = () => {
  return (
    <>
      <Helmet>
        <title>ペアタイプ別解説 | 距離感診断 - 10種類の距離感タイプを詳しく解説</title>
        <meta name="description" content="距離感診断の10種類のペアタイプを詳しく解説。他人行儀ペア、敬語ギリ卒ペア、ゆる友だちペアから一心同体ペアまで、それぞれの特徴とアドバイスを紹介します。" />
        <meta name="keywords" content="ペアタイプ,距離感タイプ,他人行儀ペア,敬語ギリ卒ペア,ゆる友だちペア,距離感診断,ペア診断,相性診断" />
        
        {/* Open Graph */}
        <meta property="og:title" content="ペアタイプ別解説 | 距離感診断" />
        <meta property="og:description" content="距離感診断の10種類のペアタイプを詳しく解説。それぞれの特徴とアドバイスを紹介します。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/note`} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/note`} />
        
        {/* Structured Data (JSON-LD) for NotePage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "ペアタイプ別解説 | 距離感診断",
            "description": "距離感診断の10種類のペアタイプを詳しく解説。他人行儀ペア、敬語ギリ卒ペア、ゆる友だちペアから一心同体ペアまで、それぞれの特徴とアドバイスを紹介します。",
            "url": `${typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com'}/note`,
            "keywords": "ペアタイプ,距離感タイプ,他人行儀ペア,敬語ギリ卒ペア,ゆる友だちペア,距離感診断,ペア診断,相性診断",
            "articleSection": "ペアタイプ解説"
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
             <Link to="/result">
               <Button variant="ghost" size="icon"><ArrowLeft className="w-6 h-6" /></Button>
             </Link>
             <h1 className="text-3xl font-bold text-gray-900">距離感ノート</h1>
          </div>
          
          <p className="text-gray-600 mb-12">
            距離感診断・ペア診断の10種類のペアタイプについて、より詳しい心理分析とアドバイスをまとめました。
            今の二人の状態を知り、より良い関係を築くための参考にしてください。各ペアタイプの特徴や相性の見方も解説しています。
          </p>

          <div className="grid gap-8">
            {pairTypes.map((type, index) => (
              <motion.div 
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                   <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-1"></div>
                   <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{type.name}</h2>
                        <span className="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Score: {type.scoreRange[0]}-{type.scoreRange[1]}
                        </span>
                      </div>
                      
                      <div className="prose max-w-none">
                         <h3 className="text-lg font-bold text-purple-700 mb-4">{type.note_title}</h3>
                         <p className="text-gray-600 leading-relaxed mb-6">{type.note_content}</p>
                         
                         <div className="bg-gray-50 p-4 rounded-lg">
                           <h4 className="font-bold text-sm text-gray-700 mb-2">特徴キーワード</h4>
                           <div className="flex flex-wrap gap-2">
                             {type.characteristics.map((c, i) => (
                               <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">
                                 {c}
                               </span>
                             ))}
                           </div>
                         </div>
                      </div>
                   </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default NotePage;
