import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Zap,
  BookOpen,
  Map,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AssessmentTestPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedOptionId }
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const data = await api.getAssessment(slug);
        setAssessment(data);
        setTimeLeft(data.durationMinutes * 60);
        setStartTime(Date.now());
      } catch (err) {
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [slug]);

  // Countdown timer
  useEffect(() => {
    if (!assessment || results || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // auto-submit on expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [assessment, results, timeLeft]);

  const handleSelectOption = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    setConfirmModalOpen(false);

    try {
      setSubmitting(true);
      const responses = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId
      }));

      // Calculate time spent in seconds
      const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

      const res = await api.submitAssessment({
        assessmentId: assessment.id,
        responses,
        timeSpentSeconds
      });

      setResults(res);

      if (res.scorePercent >= 80) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-textMuted-light dark:text-textMuted-dark">Preparing test environment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="font-bold text-lg">Assessment not found</h3>
        <Link to="/dashboard/assessments" className="text-xs font-bold text-primary">
          Back to Assessments
        </Link>
      </div>
    );
  }

  // RESULTS VIEW
  if (results) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Results Hero Banner */}
        <div className={`p-8 rounded-3xl border text-center space-y-4 ${
          results.passed
            ? 'bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent border-emerald-500/30'
            : 'bg-gradient-to-tr from-amber-500/10 via-orange-500/10 to-transparent border-amber-500/30'
        }`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 shadow-sm">
            <Award className="w-4 h-4 text-primary" />
            <span>Evaluation Completed</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-textMain-light dark:text-textMain-dark">
              {results.scorePercent}%
            </h1>
            <p className="text-sm font-bold text-textMain-light dark:text-textMain-dark">
              Proficiency Rating: <span className="text-primary">{results.proficiencyResult}</span>
            </p>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark">
              {results.correctAnswers} of {results.totalQuestions} questions answered correctly
            </p>
          </div>

          <p className="text-xs text-textMuted-light dark:text-textMuted-dark italic max-w-xl mx-auto pt-2">
            "{results.disclaimer}"
          </p>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl border-emerald-500/30 space-y-2">
            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Competencies
            </h4>
            <ul className="text-xs space-y-1.5 text-textMain-light dark:text-textMain-dark">
              {results.strongAreas.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-5 rounded-2xl border-amber-500/30 space-y-2">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Recommended Areas to Practice
            </h4>
            <ul className="text-xs space-y-1.5 text-textMain-light dark:text-textMain-dark">
              {results.areasForImprovement.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Question Review with Explanations */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
            Question Review & Educational Explanations
          </h3>

          <div className="space-y-6">
            {results.questionReview.map((qr, idx) => (
              <div
                key={qr.questionId}
                className="p-5 rounded-2xl border border-borderBase-light dark:border-borderBase-dark space-y-3 bg-white dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <h5 className="font-bold text-sm text-textMain-light dark:text-textMain-dark">
                    Question {idx + 1}: {qr.questionText}
                  </h5>
                  {qr.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full flex-shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {qr.options.map(opt => {
                    const isUserPick = opt.id === qr.selectedOptionId;
                    const isActualCorrect = opt.isCorrect;

                    let style = 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-textMuted-light dark:text-textMuted-dark';
                    if (isActualCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isUserPick && !isActualCorrect) {
                      style = 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200';
                    }

                    return (
                      <div key={opt.id} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${style}`}>
                        <span>{opt.optionText}</span>
                        {isActualCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {isUserPick && !isActualCorrect && <span className="text-[10px] text-red-500 font-bold">Your choice</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {qr.explanation && (
                  <div className="p-3 rounded-xl bg-primary-50/60 dark:bg-primary-950/30 text-xs text-textMain-light dark:text-textMain-dark border border-primary-200 dark:border-primary-800">
                    <strong className="text-primary block mb-0.5">Explanation:</strong>
                    {qr.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Roadmaps & Resources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-4 h-4 text-primary" /> Recommended Next Roadmap
            </h4>
            {results.recommendedRoadmaps.slice(0, 1).map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <div className="font-bold text-xs text-textMain-light dark:text-textMain-dark">{r.title}</div>
                <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">{r.level} • {r.durationWeeks} Weeks</p>
                <Link to={`/dashboard/roadmaps/${r.slug}`} className="text-xs font-bold text-primary block pt-1">
                  Start Roadmap →
                </Link>
              </div>
            ))}
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-textMain-light dark:text-textMain-dark uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-secondary" /> Learning Material
            </h4>
            {results.recommendedResources.slice(0, 2).map(res => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 transition-colors space-y-1"
              >
                <div className="font-bold text-xs text-textMain-light dark:text-textMain-dark truncate">{res.title}</div>
                <p className="text-[10px] text-textMuted-light dark:text-textMuted-dark">{res.type} • {res.durationMinutes} Mins</p>
              </a>
            ))}
          </div>
        </div>

        {/* Action Bottom */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => {
              setResults(null);
              setAnswers({});
              setCurrentQIndex(0);
              setTimeLeft(assessment.durationMinutes * 60);
              setStartTime(Date.now());
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold border border-borderBase-light dark:border-borderBase-dark text-textMain-light dark:text-textMain-dark hover:bg-slate-100 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Test
          </button>
          <Link
            to="/dashboard/assessments"
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-700 shadow-md shadow-primary/20"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ INTERFACE
  const currentQuestion = assessment.questions[currentQIndex];
  const isAnswered = Boolean(answers[currentQuestion?.id]);
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Test Header */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-borderBase-light dark:border-borderBase-dark">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{assessment.category}</span>
          <h2 className="font-bold text-base text-textMain-light dark:text-textMain-dark">{assessment.title}</h2>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-textMain-light dark:text-textMain-dark">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Question Number Pills Navigation */}
      <div className="flex flex-wrap items-center gap-2">
        {assessment.questions.map((q, idx) => {
          const filled = Boolean(answers[q.id]);
          const current = idx === currentQIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                current
                  ? 'bg-primary text-white ring-2 ring-primary/30'
                  : filled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 text-textMuted-light dark:text-textMuted-dark border border-borderBase-light dark:border-borderBase-dark'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-borderBase-light dark:border-borderBase-dark">
        <div className="flex items-center justify-between text-xs text-textMuted-light dark:text-textMuted-dark pb-2 border-b border-borderBase-light dark:border-borderBase-dark">
          <span>Question {currentQIndex + 1} of {totalQuestions}</span>
          <span>Answered {answeredCount}/{totalQuestions}</span>
        </div>

        <h3 className="text-lg font-bold text-textMain-light dark:text-textMain-dark leading-snug">
          {currentQuestion.questionText}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt.id;

            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary-50 dark:bg-primary-950/40 text-primary font-bold shadow-sm'
                    : 'border-borderBase-light dark:border-borderBase-dark hover:border-primary/40 bg-white dark:bg-slate-900 text-textMain-light dark:text-textMain-dark'
                }`}
              >
                <span>{opt.optionText}</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Nav Buttons */}
        <div className="pt-4 border-t border-borderBase-light dark:border-borderBase-dark flex items-center justify-between">
          <button
            type="button"
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex(currentQIndex - 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-borderBase-light dark:border-borderBase-dark text-textMain-light dark:text-textMain-dark disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          {currentQIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentQIndex(currentQIndex + 1)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-700 shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Assessment
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-soft-lg border">
            <h4 className="font-bold text-base text-textMain-light dark:text-textMain-dark">
              Submit Assessment?
            </h4>
            <p className="text-xs text-textMuted-light dark:text-textMuted-dark leading-relaxed">
              You have answered {answeredCount} out of {totalQuestions} questions. Are you ready to submit and calculate your verified score?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-textMuted-light dark:text-textMuted-dark"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
