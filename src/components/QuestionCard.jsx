import React from 'react';
import { Card } from '@/components/ui/card';

/**
 * 6段階（0-5）の丸選択UI
 * 左の主張 ↔ 右の主張の形式
 */
const QuestionCard = ({ question, index, answer, onAnswer }) => {
  // 回答値は0-5（6段階）
  const selectedValue = answer !== undefined && answer !== null ? answer : null;

  const handleSelect = (value) => {
    onAnswer(question.id, value);
  };

  return (
    <Card className="p-6 bg-white shadow-lg border-2 border-purple-50">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-3">
          Q{index + 1}
        </span>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 text-left">
            <p className="text-base font-bold text-gray-900 leading-relaxed">
              {question.leftText}
            </p>
          </div>
          <div className="text-gray-400 text-xl">↔</div>
          <div className="flex-1 text-right">
            <p className="text-base font-bold text-gray-900 leading-relaxed">
              {question.rightText}
            </p>
          </div>
        </div>
      </div>

      {/* 6段階の丸選択 */}
      <div className="py-4">
        <div className="flex items-center justify-between gap-2">
          {/* 左ラベル */}
          <span className="text-xs font-medium text-gray-600 flex-shrink-0 w-20 text-left">
            当てはまる
          </span>
          
          {/* 6個の丸 */}
          <div className="flex-1 flex items-center justify-center gap-3 px-4">
            {[0, 1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                className={`
                  w-10 h-10 rounded-full border-2 transition-all duration-200
                  flex items-center justify-center
                  ${selectedValue === value
                    ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-pink-500 scale-110 shadow-lg'
                    : 'bg-white border-gray-300 hover:border-pink-300 hover:scale-105'
                  }
                `}
                aria-label={`選択 ${value}`}
              >
                {selectedValue === value && (
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* 右ラベル */}
          <span className="text-xs font-medium text-gray-600 flex-shrink-0 w-20 text-right">
            当てはまらない
          </span>
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
