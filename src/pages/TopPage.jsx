import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuestionBlock from '@/components/QuestionBlock';
import { previewQuestions } from '@/data/questions';
import { decodeAnswers } from '@/utils/scoreCalculator';
import { useToast } from '@/components/ui/use-toast';

const TopPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [previewAnswers, setPreviewAnswers] = useState({});
  const { toast } = useToast();
  const partnerData = searchParams.get('p');

  useEffect(() => {
    // Clean up old session if starting fresh
    if (!partnerData) {
      localStorage.removeItem('diagnosis_answers_a');
      localStorage.removeItem('diagnosis_answers_b');
    } else {
      // Decode partner data if present
      const decoded = decodeAnswers(partnerData);
      if (decoded) {
        localStorage.setItem('diagnosis_answers_a', JSON.stringify(decoded));
        toast({
          title: "パートナーのデータを受け取りました",
          description: "あなた（Bさん）の診断を始めましょう！",
        });
      }
    }
  }, [partnerData, toast]);

  const handlePreviewAnswer = (questionId, answer) => {
    setPreviewAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // 質問に回答したときの次の質問への自動スクロール
  const handleAnswerChange = (questionId, questionIndex) => {
    const currentQuestionIndex = previewQuestions.findIndex(q => q.id === questionId);
    
    // 同じページ内に次の質問がある場合
    if (currentQuestionIndex >= 0 && currentQuestionIndex < previewQuestions.length - 1) {
      const nextQuestion = previewQuestions[currentQuestionIndex + 1];
      setTimeout(() => {
        const nextElement = document.getElementById(`question-${nextQuestion.id}`);
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleStartAsA = () => {
    // Save preview answers to localStorage for A
    localStorage.setItem('diagnosis_answers_a', JSON.stringify(previewAnswers));
    navigate('/diagnosis/a');
  };

  const handleStartAsB = () => {
    navigate('/diagnosis/b');
  };

  // 「今すぐ診断を始める」ボタン：トップページ内の質問1へ移動
  const handleJumpToQuestion1 = () => {
    // ヒーロー直下の質問セクションへスムーズスクロール
    const el = document.getElementById('question-1');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // 念のためフォールバック（質問要素が見つからない場合）
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isB = !!partnerData;
  const allPreviewAnswered = previewQuestions.every(q => previewAnswers[q.id] !== undefined && previewAnswers[q.id] !== null);

  return (
    <>
      <Helmet>
        <title>距離感診断 | 二人の心の距離を0〜100で見える化 - 無料ペア診断</title>
        <meta name="description" content="30問の質問で二人の距離感と相性を診断！Z世代向けの無料ペア診断サイト。カップルや友達同士で使える、距離感診断・ペア診断・ペアタイプ診断。診断結果は10段階のペアタイプで表示されます。" />
        <meta name="keywords" content="距離感診断,ペア診断,ペアタイプ,相性診断,関係性診断,カップル診断,友達診断,距離感,心の距離,相性,ペア,診断,無料" />
        
        {/* Open Graph */}
        <meta property="og:title" content="距離感診断 | 二人の心の距離を0〜100で見える化" />
        <meta property="og:description" content="30問の質問で二人の距離感と相性を診断！無料で使えるペア診断サイト。カップルや友達同士で楽しめます。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/`} />
        <meta property="og:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/og-image.jpg`} />
        <meta property="og:site_name" content="距離感診断" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="距離感診断 | 二人の心の距離を0〜100で見える化" />
        <meta name="twitter:description" content="30問の質問で二人の距離感と相性を診断！無料で使えるペア診断サイト。" />
        <meta name="twitter:image" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/og-image.jpg`} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/`} />
        
        {/* Structured Data (JSON-LD) for TopPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "距離感診断",
            "alternateName": ["ペア診断", "ペアタイプ診断"],
            "description": "30問の質問で二人の距離感と相性を診断する無料ペア診断サイト。カップルや友達同士で使える距離感診断・ペア診断・ペアタイプ診断。",
            "url": typeof window !== 'undefined' ? window.location.origin : 'https://yourdomain.com',
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "JPY"
            },
            "keywords": "距離感診断,ペア診断,ペアタイプ,相性診断,関係性診断,カップル診断,友達診断",
            "audience": {
              "@type": "Audience",
              "audienceType": "Gen Z"
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-20">
          {/* ヒーローセクション */}
          <section className="py-12 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  距離感診断
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-4 max-w-2xl mx-auto font-medium">
                  二人の"近さ"を0〜100で見える化
                </p>
                <p className="text-gray-500 text-sm md:text-base mb-8 max-w-2xl mx-auto">
                  無料ペア診断・ペアタイプ診断で、あなたとあの人の関係性をチェック。30問の質問に答えるだけで、距離感スコアと相性スコアが分かります。
                </p>
                {!isB && (
                  <Button 
                    onClick={handleJumpToQuestion1}
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-full shadow-lg"
                  >
                    今すぐ診断を始める
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </motion.div>
            </div>
          </section>

          {isB ? (
            <section className="py-12 px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-2xl border-2 border-purple-200 shadow-xl text-center">
                  <h2 className="text-2xl font-bold mb-4 text-purple-700">パートナーから招待されています</h2>
                  <p className="mb-8 text-gray-600">
                    パートナー（Aさん）は既に回答済みです。<br/>
                    あなた（Bさん）の回答を入力して、<br/>二人の距離感スコアを確認しましょう！
                  </p>
                  <Button 
                    onClick={handleStartAsB}
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-lg h-14 px-8"
                  >
                    Bさんとして診断を開始
                    <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            <>
              {/* 質問セクション */}
              <section className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                  <p className="text-center text-gray-600 mb-8 text-lg">
                    「二人の関係」をイメージして回答してください
                  </p>
                  
                  <div className="space-y-8">
                    {previewQuestions.map((question, index) => (
                      <QuestionBlock
                        key={question.id}
                        question={question}
                        index={index}
                        answer={previewAnswers[question.id]}
                        onAnswer={handlePreviewAnswer}
                        onAnswerChange={handleAnswerChange}
                      />
                    ))}
                  </div>

                  <div className="mt-12 text-center">
                    <Button
                      onClick={handleStartAsA}
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-lg rounded-full shadow-lg"
                      disabled={!allPreviewAnswered}
                    >
                      次へ
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                      全30問の診断を完了すると、あなたの距離感スコアが分かります
                    </p>
                  </div>
                </div>
              </section>

              {/* 診断の流れセクション */}
              <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">距離感診断・ペア診断の流れ</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        1
                      </div>
                      <h3 className="text-xl font-bold mb-2">質問に回答</h3>
                      <p className="text-gray-600">距離感診断・ペア診断の30問の質問に6段階で答えます（5問×6ページ、約5分）</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        2
                      </div>
                      <h3 className="text-xl font-bold mb-2">結果を確認</h3>
                      <p className="text-gray-600">あなたの距離感スコアとペアタイプを表示</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        3
                      </div>
                      <h3 className="text-xl font-bold mb-2">シェア</h3>
                      <p className="text-gray-600">結果をSNSでシェアして友達と比較</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTAセクション */}
              <section className="py-12 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="max-w-2xl mx-auto text-center">
                  <Button
                    onClick={handleStartAsA}
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-6 text-xl rounded-full shadow-lg"
                    disabled={!allPreviewAnswered}
                  >
                    診断を始める
                  </Button>
                  <p className="mt-4 text-gray-600">所要時間: 約5分 | 質問数: 30問</p>
                </div>
              </section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TopPage;
