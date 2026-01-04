import { allQuestions } from '@/data/questions';

/**
 * 距離感診断のスコアを計算
 * 新仕様：
 * - 各質問は0-5の値（0=最もそう思う、5=全くそう思わない）
 * - closer_sideが'left'の場合: point = 3 - answer (0→+3, 5→-3)
 * - closer_sideが'right'の場合: point = answer - 3 (0→-3, 5→+3)
 * - 各人のポイント合計: -90〜+90点（30問×±3点）
 * - 距離感スコア: (scoreA + scoreB + 180) / 360 * 100 (%)
 * - 相性スコア: 100 - (|scoreA - scoreB| / 180) * 100 (%)
 */
export const calculateResults = (answersA, answersB) => {
  /**
   * 各人のポイント合計を計算
   * @param {Object} answers - {questionId: answerValue}
   * @returns {number} ポイント合計（-90〜+90）
   */
  const calculateIndividualScore = (answers) => {
    let totalPoints = 0;
    let answeredCount = 0;
    
    allQuestions.forEach(question => {
      const answerVal = answers[question.id];
      if (answerVal === undefined || answerVal === null) return; // Skip unanswered
      
      answeredCount++;
      
      // 回答値は0-5（6段階）
      let point;
      if (question.closer_side === 'left') {
        // 左が近い場合: 0（最もそう思う）→ +3点、5（全くそう思わない）→ -3点
        point = 3 - answerVal;
      } else {
        // 右が近い場合: 0（最もそう思う）→ -3点、5（全くそう思わない）→ +3点
        point = answerVal - 3;
      }
      
      totalPoints += point;
    });

    // 未回答の質問がある場合はエラーとして扱う（0を返す）
    if (answeredCount === 0) return 0;
    
    // 範囲チェック（-90〜+90）
    return Math.max(-90, Math.min(90, totalPoints));
  };

  const scoreA = calculateIndividualScore(answersA);
  const scoreB = calculateIndividualScore(answersB);
  
  // 距離感スコア: 二人のポイント合計を180満点として%変換
  // totalPoints = scoreA + scoreB (範囲: -180〜+180)
  // distanceScorePercent = ((totalPoints + 180) / 360) * 100 (範囲: 0〜100%)
  // -180点 → 0%、0点 → 50%、+180点 → 100%
  const totalPoints = scoreA + scoreB;
  const distanceScorePercent = Math.max(0, Math.min(100, ((totalPoints + 180) / 360) * 100));
  
  // 相性スコア: 二人のポイント差が小さいほど高い
  // diff = |scoreA - scoreB| (範囲: 0〜180)
  // compatibilityScorePercent = 100 - (diff / 180) * 100 (範囲: 0〜100%)
  const diff = Math.abs(scoreA - scoreB);
  const compatibilityScorePercent = Math.max(0, Math.min(100, 100 - (diff / 180) * 100));

  return {
    scoreA,                                    // -90〜+90点
    scoreB,                                    // -90〜+90点
    distanceScorePercent,                      // 0〜100%
    compatibilityScorePercent                  // 0〜100%
  };
};

/**
 * 回答データをURL用にエンコード（Base64）
 */
export const encodeAnswers = (answers) => {
  try {
    const json = JSON.stringify(answers);
    return btoa(encodeURIComponent(json)); // Base64 encode safe for URL
  } catch (e) {
    console.error("Encoding error", e);
    return "";
  }
};

/**
 * URLから回答データをデコード
 */
export const decodeAnswers = (encoded) => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    console.error("Decoding error", e);
    return null;
  }
};
