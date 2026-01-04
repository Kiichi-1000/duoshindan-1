
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Share2, Copy, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pairTypes } from '@/data/pairTypes';
import { calculateResults } from '@/utils/scoreCalculator';
import { useToast } from '@/components/ui/use-toast';

const ResultPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const answersA = JSON.parse(localStorage.getItem('diagnosis_answers_a') || '{}');
    const answersB = JSON.parse(localStorage.getItem('diagnosis_answers_b') || '{}');

    if (Object.keys(answersA).length === 0 || Object.keys(answersB).length === 0) {
      toast({
        title: "データ不足",
        description: "診断データが見つかりません。トップページに戻ります。",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    const res = calculateResults(answersA, answersB);
    setResult(res);
  }, [navigate, toast]);

  if (!result) return <div className="min-h-screen bg-pink-50 flex items-center justify-center">Loading...</div>;

  const { scoreA, scoreB, distanceScorePercent, compatibilityScorePercent } = result;
  
  // 距離感スコアの%に基づいてペアタイプを決定（10段階分類）
  const pairType = pairTypes.find(t => 
    distanceScorePercent >= t.scoreRange[0] && 
    distanceScorePercent <= t.scoreRange[1]
  ) || pairTypes[0];

  // %表示用のフォーマット（繰り上げの2桁表示）
  const formatPercent = (value) => {
    return Math.ceil(value).toString().padStart(2, '0');
  };

  const handleShare = async () => {
    const shareText = `私たちの距離感は「${pairType.name}」でした！\n距離感スコア: ${formatPercent(distanceScorePercent)}%\n相性スコア: ${formatPercent(compatibilityScorePercent)}%\nAさん: ${scoreA}点 | Bさん: ${scoreB}点\n#距離感診断`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '距離感診断結果',
          text: shareText,
          url: window.location.href
        });
      } catch (e) {}
    } else {
      // フォールバック: クリップボードにコピー
      try {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        toast({ title: "結果をコピーしました！" });
      } catch (e) {
        toast({ title: "シェア機能はモバイル端末でご利用ください" });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>診断結果 | 距離感診断 - {pairType.name} | 距離感{formatPercent(distanceScorePercent)}% 相性{formatPercent(compatibilityScorePercent)}%</title>
        <meta name="description" content={`距離感診断の結果：${pairType.name}。距離感スコア${formatPercent(distanceScorePercent)}%、相性スコア${formatPercent(compatibilityScorePercent)}%。${pairType.description}`} />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={`診断結果 | ${pairType.name} - 距離感診断`} />
        <meta property="og:description" content={`距離感スコア${formatPercent(distanceScorePercent)}%、相性スコア${formatPercent(compatibilityScorePercent)}%。${pairType.description}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Canonical */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Header />
        
        <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-4">
                診断結果
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{pairType.name}</h1>
              <p className="text-lg text-gray-600 mb-2">{pairType.description}</p>
              <div className="mt-4">
                <p className="text-3xl font-bold text-purple-600">距離感スコア: {formatPercent(distanceScorePercent)}%</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6 bg-white/90 backdrop-blur border-2 border-purple-100 shadow-xl overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <HeartIcon className="w-32 h-32" />
                 </div>
                 <div className="relative z-10 text-center">
                   <div className="mb-6">
                     <img alt="Pair type illustration" className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg mb-4" src="https://images.unsplash.com/photo-1484071096222-7936a931e094" />
                   </div>
                   <h2 className="text-2xl font-bold mb-4 text-purple-800">相性スコア: {formatPercent(compatibilityScorePercent)}%</h2>
                   <div className="flex justify-center gap-8 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl">
                      <div>
                        <p className="mb-1 text-pink-500">Aさん</p>
                        <p className="text-2xl font-bold">{scoreA}<span className="text-xs text-gray-400">点</span></p>
                      </div>
                      <div className="w-px bg-gray-300"></div>
                      <div>
                        <p className="mb-1 text-blue-500">Bさん</p>
                        <p className="text-2xl font-bold">{scoreB}<span className="text-xs text-gray-400">点</span></p>
                      </div>
                   </div>
                 </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-6 bg-white/80">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    📝 診断レポート
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm mb-4">
                    {pairType.description}
                  </p>
                  <div className="space-y-2">
                    {pairType.characteristics.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {c}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-purple-200">
                  <h3 className="font-bold text-lg mb-3 text-purple-900">💡 アドバイス</h3>
                  <ul className="space-y-2">
                    {pairType.advice.map((a, i) => (
                       <li key={i} className="text-sm text-purple-800">• {a}</li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
               <div className="flex gap-4 w-full max-w-md">
                 <Button onClick={handleShare} className="flex-1 bg-black text-white hover:bg-gray-800">
                   <Share2 className="w-4 h-4 mr-2" /> 結果を共有
                 </Button>
                 <Link to="/note" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" /> タイプ別解説を見る
                    </Button>
                 </Link>
               </div>
               <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-500">
                 <RefreshCw className="w-4 h-4 mr-2" /> トップに戻る
               </Button>
            </div>

          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

// Simple Icon component for decoration
const HeartIcon = ({className}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default ResultPage;
