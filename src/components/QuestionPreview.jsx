import React from 'react';

/**
 * トップページ用の質問プレビュー（6段階の丸選択）
 */
const QuestionPreview = ({ question, index, answer, onAnswer }) => {
  const selectedValue = answer !== undefined && answer !== null ? answer : null;

  const handleSelect = (value) => {
    onAnswer(question.id, value);
  };

  return (
    <div className="border-b border-gray-100 pb-6 last:border-0">
      <div className="mb-4">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-gray-800 leading-relaxed">
                {question.leftText}
              </p>
              <span className="text-gray-300 text-lg flex-shrink-0">↔</span>
              <p className="text-sm font-bold text-gray-800 leading-relaxed text-right">
                {question.rightText}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 6段階の丸選択（コンパクト版） */}
      <div className="flex items-center justify-center gap-2 pl-9">
        <span className="text-xs text-gray-500 mr-2">左</span>
        {[0, 1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all duration-200
              flex items-center justify-center
              ${selectedValue === value
                ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-pink-500 scale-110 shadow-md'
                : 'bg-white border-gray-300 hover:border-pink-300 hover:scale-105'
              }
            `}
            aria-label={`選択 ${value}`}
          >
            {selectedValue === value && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-2">右</span>
      </div>
    </div>
  );
};

export default QuestionPreview;
