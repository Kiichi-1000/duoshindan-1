
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-gray-800">距離感診断</span>
            </div>
            <p className="text-sm text-gray-600">
              二人の距離感を診断して、<br />
              より良い関係性を築こう
            </p>
          </div>

          <div>
            <span className="font-bold text-gray-800 mb-4 block">リンク</span>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                ホーム
              </Link>
              <Link to="/note" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                タイプ別解説
              </Link>
              <Link to="/faq" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
                よくある質問
              </Link>
            </div>
          </div>

          <div>
            <span className="font-bold text-gray-800 mb-4 block">診断について</span>
            <p className="text-sm text-gray-600">
              この診断は娯楽目的です。<br />
              結果は参考程度にご利用ください。
            </p>
          </div>
        </div>

        <div className="border-t border-purple-100 pt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2026 距離感診断. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
