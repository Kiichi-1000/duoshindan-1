import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import QuestionBlock from '@/components/QuestionBlock';
import { allQuestions } from '@/data/questions';
import { encodeAnswers } from '@/utils/scoreCalculator';
import { useToast } from '@/components/ui/use-toast';

const QUESTIONS_PER_PAGE = 5;
const TOTAL_PAGES = Math.ceil(allQuestions.length / QUESTIONS_PER_PAGE);

const DiagnosisPage = () => {
  const { role } = useParams(); // 'a' or 'b'
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const containerRef = useRef(null);
  const previousPageRef = useRef(currentPage);

  // Load initial state - roleが変わるたびに状態をリセットしてから読み込む
  useEffect(() => {
    // roleが変わる際に、まず状態をリセット
    setAnswers({});
    setCurrentPage(0);
    setIsCompleted(false);
    previousPageRef.current = 0;
    
    // 正しいroleのlocalStorageからデータを読み込む
    const saved = localStorage.getItem(`diagnosis_answers_${role}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        
        if (role === 'a') {
          // Aさんの場合: Q1-5が回答済みなら、Q6から開始
          if (Object.keys(parsed).length >= 5) {
            const answeredIds = Object.keys(parsed).map(Number);
            const maxAnsweredId = Math.max(...answeredIds);
            const maxAnsweredIndex = allQuestions.findIndex(q => q.id === maxAnsweredId);
            if (maxAnsweredIndex >= 0 && maxAnsweredIndex < 5) {
              // All preview questions (Q1-5) answered, start from page 1
              setCurrentPage(1);
              previousPageRef.current = 1;
            } else if (maxAnsweredIndex >= 5) {
              // Continue from the page containing the next unanswered question
              const nextPage = Math.floor(maxAnsweredIndex / QUESTIONS_PER_PAGE);
              setCurrentPage(nextPage);
              previousPageRef.current = nextPage;
            }
          }
        } else if (role === 'b') {
          // Bさんの場合: 必ずQ1から開始（Q1-5の最初のページ）
          // 既に回答がある場合は、その続きから開始
          if (Object.keys(parsed).length > 0) {
            const answeredIds = Object.keys(parsed).map(Number);
            const maxAnsweredId = Math.max(...answeredIds);
            const maxAnsweredIndex = allQuestions.findIndex(q => q.id === maxAnsweredId);
            if (maxAnsweredIndex >= 0) {
              // 次の未回答の質問があるページから開始
              const nextUnansweredIndex = maxAnsweredIndex + 1;
              if (nextUnansweredIndex < allQuestions.length) {
                const nextPage = Math.floor(nextUnansweredIndex / QUESTIONS_PER_PAGE);
                setCurrentPage(nextPage);
                previousPageRef.current = nextPage;
              } else {
                // すべて回答済みの場合は最後のページから開始
                setCurrentPage(TOTAL_PAGES - 1);
                previousPageRef.current = TOTAL_PAGES - 1;
              }
            }
          } else {
            // 回答がない場合はQ1から開始（currentPage=0）
            setCurrentPage(0);
            previousPageRef.current = 0;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved answers:', e);
      }
    } else {
      // 保存データがない場合: Bさんの場合はQ1から開始
      if (role === 'b') {
        setCurrentPage(0);
        previousPageRef.current = 0;
      }
    }
  }, [role]);

  // Auto-save
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`diagnosis_answers_${role}`, JSON.stringify(answers));
    }
  }, [answers, role]);

  // ページが変わったときに自動スクロール
  useEffect(() => {
    if (previousPageRef.current !== currentPage) {
      // ページが変わったとき、ページの一番上へスクロール
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      previousPageRef.current = currentPage;
    }
  }, [currentPage]);

  const handleAnswer = (questionId, val) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  // 質問に回答したときの次の質問への自動スクロール
  const handleAnswerChange = (questionId, questionIndexInPage) => {
    const pageQuestions = getCurrentPageQuestions();
    const currentQuestionIndex = pageQuestions.findIndex(q => q.id === questionId);
    
    // 同じページ内に次の質問がある場合
    if (currentQuestionIndex >= 0 && currentQuestionIndex < pageQuestions.length - 1) {
      const nextQuestion = pageQuestions[currentQuestionIndex + 1];
      setTimeout(() => {
        const nextElement = document.getElementById(`question-${nextQuestion.id}`);
        if (nextElement) {
          nextElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const getCurrentPageQuestions = () => {
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    return allQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
  };

  const getAllQuestionsOnCurrentPageAnswered = () => {
    const pageQuestions = getCurrentPageQuestions();
    return pageQuestions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  };

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(prev => prev + 1);
      // 自動スクロールはuseEffectで処理される
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      // 自動スクロールはuseEffectで処理される
    }
  };

  const handleFinish = () => {
    setIsCompleted(true);
    if (role === 'a') {
      const encoded = encodeAnswers(answers);
      const url = `${window.location.origin}/?p=${encoded}`;
      setShareUrl(url);
    } else {
      // Role B finished -> Go to results
      navigate('/result');
    }
  };

  const handlePassDevice = () => {
    // Bさんに端末を渡す場合、Bさんの回答データをクリアしてから遷移
    // ただし、既にBさんの回答データがある場合は保持
    navigate('/diagnosis/b');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "コピーしました！" });
    } catch (e) {
      toast({ title: "コピーに失敗しました", variant: "destructive" });
    }
  };

  if (isCompleted && role === 'a') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center bg-white border-2 border-purple-200 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Aさんの回答が完了しました！</h2>
            <p className="text-gray-600 mb-8">
              次はBさんの番です。<br/>
              以下のいずれかの方法で診断を続けてください。
            </p>

            <div className="space-y-4">
              <Button onClick={handlePassDevice} className="w-full h-12 text-lg bg-pink-500 hover:bg-pink-600">
                この端末をBさんに渡す
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">または</span>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg break-all text-xs text-gray-500 mb-2 font-mono">
                {shareUrl}
              </div>
              <Button onClick={copyLink} variant="outline" className="w-full">
                <Copy className="w-4 h-4 mr-2" />
                Bさんに送るリンクをコピー
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const pageQuestions = getCurrentPageQuestions();
  const progress = ((currentPage + 1) / TOTAL_PAGES) * 100;
  const allAnswered = getAllQuestionsOnCurrentPageAnswered();
  const startQuestionNum = currentPage * QUESTIONS_PER_PAGE + 1;
  const endQuestionNum = Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, allQuestions.length);

  return (
    <>
      <Helmet>
        <title>{role === 'a' ? 'Aさん' : 'Bさん'}回答中 | 距離感診断 - ペア診断</title>
        <meta name="description" content={`${role === 'a' ? 'Aさん' : 'Bさん'}の診断回答ページ。30問の質問に答えて、二人の距離感と相性を診断します。`} />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Canonical */}
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/diagnosis/${role}`} />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        
        <main ref={containerRef} className="pt-20 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* 進捗表示 */}
            <div className="mb-8 text-center">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span>{role === 'a' ? 'Aさん' : 'Bさん'}</span>
                <span>質問 {startQuestionNum}-{endQuestionNum} / 全{allQuestions.length}問（ページ {currentPage + 1}/{TOTAL_PAGES}）</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 説明文 */}
            <p className="text-center text-gray-600 mb-8 text-lg">
              「二人の関係」をイメージして回答してください
            </p>

            {/* 質問ブロック */}
            <div className="space-y-8 mb-12">
              {pageQuestions.map((question, index) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  index={startQuestionNum - 1 + index}
                  answer={answers[question.id]}
                  onAnswer={handleAnswer}
                  onAnswerChange={handleAnswerChange}
                />
              ))}
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                前へ
              </Button>

              <Button
                onClick={handleNext}
                disabled={!allAnswered}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-full shadow-lg flex items-center"
              >
                {currentPage === TOTAL_PAGES - 1 ? '完了' : '次へ'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-center mt-6 text-sm text-gray-500">
              全30問の診断を完了すると、あなたの距離感スコアが分かります
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default DiagnosisPage;
