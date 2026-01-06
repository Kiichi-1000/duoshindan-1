import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FAQPage = () => {
  const faqs = [
    {
      q: "友だち同士でも使える？",
      a: "はい、友だち同士でも使えます。カップルだけでなく、友達同士で「距離感診断」を楽しんで、関係性を確認するのにも最適です。"
    },
    {
      q: "これって当たる？",
      a: "診断結果は「当たる/当たらない」というものではなく、会話のきっかけとして楽しむことをおすすめします。30の質問に答えることで、二人の関係性を振り返る機会になります。"
    },
    {
      q: "名前は必要？",
      a: "いいえ、名前の入力は不要です。ニックネームも使わず、Aさん・Bさんとして診断を進めることができます。"
    },
    {
      q: "結果は他人にバレる？",
      a: "いいえ、結果は共有しない限り他人には見えません。診断結果はあなたのブラウザに保存されるだけで、サーバーには送信されません。"
    },
    {
      q: "回答データは保存される？",
      a: "回答データはお使いのブラウザ（ローカルストレージ）にのみ一時的に保存されます。サーバーには送信されないため、プライバシーは保護されています。"
    },
    {
      q: "途中でやめたら？",
      a: "途中保存機能があります。診断を中断しても、後で同じブラウザから続きから再開できます。ただし、ブラウザのデータを削除すると回答は消えます。"
    },
    {
      q: "やり直したい",
      a: "トップページから新しく診断を始めることで、以前の回答をリセットしてやり直すことができます。ブラウザのデータを削除してもリセットできます。"
    },
    {
      q: "2人が別々の場所でもできる？",
      a: "はい、可能です。Aさんが診断を完了した後、発行されるリンクをBさんに送ることで、離れた場所にいても診断を完了できます。"
    },
    {
      q: "スコアが低いと相性が悪いの？",
      a: "いいえ、距離感スコアが低いことは「関係が浅い」ことを示しているだけで、相性が悪いわけではありません。これからの伸びしろがあると考えてください。相性スコアは別途表示されます。"
    },
    {
      q: "診断にかかる時間は？",
      a: "30問の質問に答えるため、約5〜10分程度かかります。ゆっくり考えながら答えることもできますし、直感で答えることもできます。"
    }
  ];

  return (
    <>
      <Helmet>
        <title>よくある質問（FAQ） | 距離感診断 - よくある質問と回答</title>
        <meta name="description" content="距離感診断に関するよくある質問と回答。診断の使い方、プライバシー、結果の見方など、よくある質問にお答えします。" />
        <meta name="keywords" content="距離感診断,FAQ,よくある質問,ペア診断,仲良さ診断,使い方" />
        
        {/* Open Graph */}
        <meta property="og:title" content="よくある質問（FAQ） | 距離感診断" />
        <meta property="og:description" content="距離感診断に関するよくある質問と回答。診断の使い方、プライバシー、結果の見方など。" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/faq`} />
        
        {/* Canonical */}
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/faq`} />
        
        {/* Structured Data (FAQPage) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-900">よくある質問（FAQ）</h1>
          <p className="text-center text-gray-600 mb-8">
            距離感診断・ペア診断・仲良さ診断に関するよくある質問と回答をまとめました。
          </p>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white/80 border border-gray-200 rounded-lg mb-2 px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
