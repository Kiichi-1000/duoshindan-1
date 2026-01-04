import React, { useRef } from 'react';

/**
 * 質問ブロックコンポーネント
 * 1つの質問に対して、そう思う/そう思わないを6段階で選択
 * 円は端に行くほど大きくなる
 */
const QuestionBlock = ({ question, index, answer, onAnswer, onAnswerChange }) => {
  const selectedValue = answer !== undefined && answer !== null ? answer : null;
  const hasCalledCallbackRef = useRef(false);

  const handleSelect = (value) => {
    const wasUnanswered = selectedValue === null || selectedValue === undefined;
    
    onAnswer(question.id, value);
    
    // 新しく回答された場合（以前が未回答だった場合）のみ、次の質問へスクロール
    if (wasUnanswered && !hasCalledCallbackRef.current && onAnswerChange) {
      hasCalledCallbackRef.current = true;
      setTimeout(() => {
        onAnswerChange(question.id, index);
      }, 300);
    }
  };

  // 円のサイズを計算（端に行くほど大きくなる）
  // 0,5: 最大（w-16 h-16）
  // 1,4: 中（w-14 h-14）
  // 2,3: 最小（w-12 h-12）
  const getCircleSize = (value) => {
    if (value === 0 || value === 5) return 'w-16 h-16';
    if (value === 1 || value === 4) return 'w-14 h-14';
    return 'w-12 h-12'; // 2, 3
  };

  // フォントサイズも調整
  const getFontSize = (value) => {
    if (value === 0 || value === 5) return 'text-lg';
    if (value === 1 || value === 4) return 'text-base';
    return 'text-sm'; // 2, 3
  };

  // ラベルテキスト
  const getLabel = (value) => {
    const labels = ['最もそう思う', 'そう思う', 'ややそう思う', 'ややそう思わない', 'そう思わない', '全くそう思わない'];
    return labels[value];
  };

  return (
    <div className="mb-12 last:mb-0 scroll-mt-24" id={`question-${question.id}`}>
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">質問 {index + 1}</div>
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* 6段階の円形選択ボタン */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
        <p className="text-center text-sm font-medium text-gray-700 mb-6">
          この質問に対して、どの程度そう思いますか？
        </p>
        
        <div className="flex items-center justify-center gap-3 mb-4">
          {[0, 1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`
                ${getCircleSize(value)} rounded-full border-2 transition-all duration-200
                flex items-center justify-center font-bold relative
                ${selectedValue === value
                  ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-pink-600 text-white shadow-lg scale-110 ring-4 ring-pink-200'
                  : value <= 2
                    ? 'bg-white border-pink-300 text-gray-700 hover:border-pink-400 hover:bg-pink-50 hover:scale-105'
                    : 'bg-white border-blue-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:scale-105'
                }
              `}
              aria-label={getLabel(value)}
            >
              <span className={getFontSize(value)}>{value + 1}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-600">
          <span className="text-pink-600 font-medium">そう思う</span>
          <span className="text-blue-600 font-medium">そう思わない</span>
        </div>

        {/* 選択された値のラベル表示 */}
        {selectedValue !== null && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700">
              選択: <span className="text-pink-600">{getLabel(selectedValue)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBlock;
