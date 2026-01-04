'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Award, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export interface PHIScoreResult {
  score: number;
  tier: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement';
  correctIdentifications: number;
  totalPHI: number;
  missedPHI: string[];
  incorrectIdentifications: string[];
  feedback: string[];
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PHIScoreResult;
}

const tierIcons = {
  Excellent: CheckCircle2,
  Good: Award,
  Satisfactory: AlertCircle,
  'Needs Improvement': XCircle,
};

export function ResultsModal({ isOpen, onClose, result }: ResultsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const TierIcon = tierIcons[result.tier];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TierIcon className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-black">
                  PHI Identification Results
                </h2>
                <p className="text-sm text-gray-600">
                  Performance Analysis
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Left Column - Feedback and Details */}
            <div className="lg:col-span-5 space-y-4">
              {result.feedback.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-left">
                    Feedback
                  </h3>
                  <ul className="space-y-2">
                    {result.feedback.map((item, index) => (
                      <li key={index} className="text-sm text-black flex items-start gap-2">
                        <span className="text-blue-600 text-lg leading-none flex-shrink-0 mt-0.5">•</span>
                        <span className="text-left flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.missedPHI.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-left">
                    Missed PHI Elements
                  </h3>
                  <ul className="space-y-1">
                    {result.missedPHI.map((item, index) => (
                      <li key={index} className="text-sm text-black flex items-start gap-2">
                        <span className="text-blue-600 text-lg leading-none flex-shrink-0 mt-0.5">•</span>
                        <span className="text-left flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.incorrectIdentifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-left">
                    Incorrectly Highlighted (Not PHI)
                  </h3>
                  <ul className="space-y-1">
                    {result.incorrectIdentifications.map((item, index) => (
                      <li key={index} className="text-sm text-black flex items-start gap-2">
                        <span className="text-blue-600 text-lg leading-none flex-shrink-0 mt-0.5">•</span>
                        <span className="text-left flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Score Breakdown */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sticky top-6">
                <h3 className="text-sm font-semibold text-black mb-2 text-left">
                  Score Breakdown
                </h3>
                
                <div className="space-y-2.5">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5 text-left">Your Score</p>
                    <p className="text-2xl font-bold text-black">
                      {result.score}/100
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-0.5 text-left">Tier</p>
                    <p className="text-lg font-semibold text-black">
                      {result.tier}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1.5 text-left">Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all bg-blue-600"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="space-y-2 pt-0.5">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5 text-left">Correctly Identified</p>
                      <p className="text-lg font-semibold text-black">
                        {result.correctIdentifications}/{result.totalPHI}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5 text-left">Accuracy</p>
                      <p className="text-lg font-semibold text-black">
                        {result.totalPHI > 0
                          ? Math.round((result.correctIdentifications / result.totalPHI) * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

