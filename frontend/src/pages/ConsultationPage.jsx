import React, { useState } from 'react';
import { ChevronRight, SkipForward } from 'lucide-react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import Badge from '../components/Common/Badge';

const ConsultationMCQ = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const totalMCQs = 6;

  const questions = [
    {
      id: 1,
      question: "Where exactly is the itching/rash located?",
      options: [
        { id: 'face', label: '🧑 Face', description: 'On face and cheeks' },
        { id: 'arms', label: '💪 Arms & Hands', description: 'On arms or hands' },
        { id: 'legs', label: '🦵 Legs & Feet', description: 'On legs or feet' },
        { id: 'chest', label: '🫀 Chest & Back', description: 'On chest or back' },
        { id: 'multiple', label: '🌍 Multiple areas', description: 'All over body' },
      ],
      type: 'single'
    },
    {
      id: 2,
      question: "How long has this been happening?",
      options: [
        { id: 'days', label: 'Days (recently started)' },
        { id: 'weeks', label: 'Few weeks' },
        { id: 'months', label: '1-3 months' },
        { id: '6months', label: '6 months' },
        { id: 'years', label: '1+ years (chronic)' },
      ],
      type: 'single'
    },
    {
      id: 3,
      question: "What makes it WORSE? (Select all that apply)",
      options: [
        { id: 'heat', label: '🔥 Heat/Warm weather' },
        { id: 'cold', label: '❄️ Cold/Winter' },
        { id: 'water', label: '💧 Water/Bathing' },
        { id: 'stress', label: '😰 Stress' },
        { id: 'food', label: '🍔 Certain foods' },
        { id: 'night', label: '🌙 At night' },
      ],
      type: 'multiple'
    },
    {
      id: 4,
      question: "What makes it BETTER?",
      options: [
        { id: 'cool', label: '❄️ Cool applications/air' },
        { id: 'warm', label: '☀️ Warmth' },
        { id: 'oily', label: '🧴 Oily substances' },
        { id: 'dry', label: '🏜️ Dry environment' },
        { id: 'rest', label: '😴 Rest' },
        { id: 'movement', label: '🏃 Movement/activity' },
      ],
      type: 'single'
    },
    {
      id: 5,
      question: "Intensity of itching/discomfort?",
      options: [
        { id: 'mild', label: '1-2: Mild, barely noticeable' },
        { id: 'moderate', label: '3-5: Moderate, manageable' },
        { id: 'severe', label: '6-8: Severe, bothersome' },
        { id: 'extreme', label: '9-10: Extreme, unbearable' },
      ],
      type: 'single',
      visual: 'scale'
    },
    {
      id: 6,
      question: "Any discharge or oozing?",
      options: [
        { id: 'no', label: 'No discharge' },
        { id: 'clear', label: 'Clear liquid' },
        { id: 'yellowish', label: 'Yellowish/pus' },
        { id: 'bloody', label: 'Bloody' },
        { id: 'not_sure', label: "Not sure" },
      ],
      type: 'single'
    },
  ];

  const question = questions[currentQuestion - 1];

  const handleSelectOption = (optionId) => {
    if (question.type === 'single') {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: optionId });
    } else {
      const current = selectedAnswers[currentQuestion] || [];
      if (current.includes(optionId)) {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion]: current.filter(id => id !== optionId)
        });
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion]: [...current, optionId]
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalMCQs) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Move to free text phase
      console.log('Moving to free text phase');
    }
  };

  const progress = (currentQuestion / totalMCQs) * 100;

  return (
    <div className="min-h-screen bg-homoeo-light p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-homoeo-dark mb-2">Patient Consultation</h1>
          <p className="text-homoeo-text-light">Skin Allergy Assessment</p>
        </div>

        {/* Progress Section */}
        <Card className="mb-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-homoeo-dark">
                📋 Structured Questions
              </span>
              <Badge variant="secondary">
                Q{currentQuestion}/{totalMCQs}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-homoeo-light rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-homoeo-royal to-homoeo-sky h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <p className="text-xs text-homoeo-text-light">
              {totalMCQs - currentQuestion} more questions to complete structured assessment
            </p>
          </div>
        </Card>

        {/* Question Card */}
        <Card className="mb-6 animate-slideUp">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-homoeo-dark mb-2">
              {question.question}
            </h2>
            {question.type === 'multiple' && (
              <p className="text-sm text-homoeo-text-light">
                ℹ️ You can select multiple options
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option) => {
              const isSelected = question.type === 'single'
                ? selectedAnswers[currentQuestion] === option.id
                : (selectedAnswers[currentQuestion] || []).includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-smooth
                    ${isSelected
                      ? 'border-homoeo-royal bg-homoeo-royal bg-opacity-10'
                      : 'border-homoeo-border hover:border-homoeo-sky'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center
                      ${isSelected
                        ? 'border-homoeo-royal bg-homoeo-royal'
                        : 'border-homoeo-border'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-homoeo-royal' : 'text-homoeo-dark'}`}>
                      {option.label}
                    </span>
                  </div>
                  {option.description && (
                    <p className="text-xs text-homoeo-text-light mt-2 ml-8">
                      {option.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between">
          {currentQuestion > 1 && (
            <Button variant="outline">
              ← Previous
            </Button>
          )}
          
          <div className="flex gap-3 ml-auto">
            {currentQuestion < totalMCQs && (
              <Button variant="ghost">
                <SkipForward size={20} />
                Skip
              </Button>
            )}
            
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion]}
            >
              {currentQuestion === totalMCQs ? 'Continue to Details' : 'Next Question'}
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Patient Info */}
        <Card className="mt-8 bg-homoeo-light border-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-homoeo-text-light text-sm">Patient Name</p>
              <p className="font-semibold text-homoeo-dark">Priya Sharma</p>
            </div>
            <div>
              <p className="text-homoeo-text-light text-sm">Age</p>
              <p className="font-semibold text-homoeo-dark">35 years</p>
            </div>
            <div>
              <p className="text-homoeo-text-light text-sm">Chief Complaint</p>
              <p className="font-semibold text-homoeo-dark">Skin Allergy</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationMCQ;