import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateXPAndStreak } from '../store/slices/authSlice.js';
import { HelpCircle, Clock, BookOpen, Layers, CheckCircle2, ChevronRight, ChevronLeft, Award, Sparkles, RefreshCw, XCircle } from 'lucide-react';
import api from '../utils/api.js';

const MockTests = () => {
  const dispatch = useDispatch();

  // Test Setup States
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [settingUp, setSettingUp] = useState(true);

  // Active Test States
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedIndex }
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [testActive, setTestActive] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Results State
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch subjects initially
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/student/subjects');
        if (res.data.success) {
          setSubjects(res.data.subjects);
          if (res.data.subjects.length > 0) {
            setSelectedSubjectId(res.data.subjects[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (!selectedSubjectId) return;
    const fetchChapters = async () => {
      try {
        const res = await api.get(`/student/subjects/${selectedSubjectId}/chapters`);
        if (res.data.success) {
          setChapters(res.data.chapters);
          if (res.data.chapters.length > 0) {
            setSelectedChapterId(res.data.chapters[0]._id);
          } else {
            setSelectedChapterId('');
          }
        }
      } catch (err) {
        console.error('Failed to load chapters:', err);
      }
    };
    fetchChapters();
  }, [selectedSubjectId]);

  // Test Timer
  useEffect(() => {
    if (!testActive || secondsRemaining <= 0) {
      if (testActive && secondsRemaining === 0) {
        handleSubmitTest();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testActive, secondsRemaining]);

  const handleGenerateTest = async () => {
    if (!selectedSubjectId || !selectedChapterId) return;

    setGenerating(true);
    try {
      const res = await api.post('/ai/generate-test', {
        subjectId: selectedSubjectId,
        chapterId: selectedChapterId,
        difficulty,
        count,
      });

      if (res.data.success) {
        setTest(res.data.test);
        setSecondsRemaining(res.data.test.duration * 60);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setSettingUp(false);
        setTestActive(true);
        setShowResult(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate test. Make sure mock data is configured or the Gemini key is valid.');
    } finally {
      setGenerating(false);
    }
  };

  const handleOptionSelect = (questionId, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    setTestActive(false);
    try {
      // Map answers to the correct payload format
      const answerPayload = Object.keys(answers).map((qId) => ({
        questionId: qId,
        selectedOption: answers[qId],
      }));

      // If they skipped some questions, fill them
      test.questions.forEach((q) => {
        if (answers[q._id] === undefined) {
          answerPayload.push({
            questionId: q._id,
            selectedOption: -1, // representing skipped
          });
        }
      });

      const timeTaken = test.duration * 60 - secondsRemaining;

      const res = await api.post('/ai/submit-test', {
        testId: test._id,
        answers: answerPayload,
        timeTaken,
      });

      if (res.data.success) {
        setResult(res.data.result);
        setShowResult(true);
        // Update user XP globally
        dispatch(updateXPAndStreak({
          xp: res.data.result.totalXp,
          badges: res.data.result.badges
        }));
      }
    } catch (err) {
      console.error('Failed to submit test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getFormattedTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI MCQ Practice & Mock Tests</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Generate custom test worksheets instantly</span>
          </p>
        </div>
      </div>

      {/* 1. Setup Panel */}
      {settingUp && !showResult && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
          <h2 className="text-lg font-bold">Configure Practice Test</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Subject Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
              <div className="relative font-semibold">
                <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chapter Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Chapter</label>
              <div className="relative font-semibold">
                <Layers className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  disabled={chapters.length === 0}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none disabled:bg-slate-100"
                >
                  {chapters.map((chap) => (
                    <option key={chap._id} value={chap._id}>{chap.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
              <div className="flex gap-3">
                {['easy', 'medium', 'hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl border uppercase tracking-wider transition-all ${
                      difficulty === d
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Number of Questions</label>
              <div className="flex gap-3">
                {[5, 10, 15].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all ${
                      count === c
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c} MCQs
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateTest}
            disabled={generating || !selectedSubjectId || !selectedChapterId}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors text-sm"
          >
            {generating ? (
              <RefreshCw className="h-5 w-5 animate-spin mr-1.5" />
            ) : (
              <Sparkles className="h-5 w-5 mr-1.5" />
            )}
            <span>Generate Dynamic MCQ Test with AI</span>
          </button>
        </div>
      )}

      {/* 2. Test Attempt Panel */}
      {testActive && test && (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left panel showing questions */}
          <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
            <div className="flex justify-between items-center border-b pb-3 border-slate-200/20">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </span>
              <div className="flex items-center space-x-1.5 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full border border-red-500/10 font-bold text-xs">
                <Clock className="h-4 w-4" />
                <span>{getFormattedTime(secondsRemaining)}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-sm font-semibold leading-relaxed">
              {test.questions[currentQuestionIndex].question}
            </div>

            {/* Option Buttons */}
            <div className="space-y-3">
              {test.questions[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(test.questions[currentQuestionIndex]._id, idx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                    answers[test.questions[currentQuestionIndex]._id] === idx
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 dark:bg-blue-950/20 dark:text-blue-200'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                  }`}
                >
                  <span className="inline-block bg-slate-200 dark:bg-slate-850 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 font-bold mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200/20">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl disabled:opacity-50 text-xs font-semibold"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === test.questions.length - 1}
                className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-850 p-2.5 rounded-xl disabled:opacity-50 text-xs font-semibold"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right panel showing navigation circles and submit */}
          <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Question Grid</h3>
            <div className="flex flex-wrap gap-2.5">
              {test.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                    currentQuestionIndex === idx
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : answers[test.questions[idx]._id] !== undefined
                      ? 'border-green-500 bg-green-50/50 text-green-600'
                      : 'border-slate-200 text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-colors text-xs uppercase tracking-wider"
            >
              {submitting ? 'Submitting Answers...' : 'Submit Test & Get Score'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Results Panel */}
      {showResult && result && (
        <div className="space-y-8">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-amber-500 text-white p-3 rounded-2xl inline-block shadow-lg mb-2"><Award className="h-8 w-8" /></div>
              <h2 className="text-2xl font-bold">Test Performance Graded!</h2>
              <p className="text-xs text-slate-400">{result.testTitle}</p>
            </div>

            {/* Results Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-y py-6 border-slate-200/20">
              <div>
                <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{result.score}</div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-1">Total Score</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{result.accuracy.toFixed(1)}%</div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-1">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-green-600">{result.correctAnswers} / {result.totalQuestions}</div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-1">Correct Answers</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-600 dark:text-slate-400">{getFormattedTime(result.timeTaken)}</div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mt-1">Time Taken</div>
              </div>
            </div>

            {/* AI suggestions */}
            <div className="bg-blue-500/10 border border-blue-500/25 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>AI Tutor Analytics Critique</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {result.suggestions}
              </p>
            </div>

            {/* Reset Button to configure next test */}
            <button
              onClick={() => {
                setSettingUp(true);
                setShowResult(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-xs"
            >
              Start Another Practice Test
            </button>
          </div>

          {/* Test Answers Review Sheet */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
            <h3 className="text-lg font-bold border-b pb-3 border-slate-200/20">Review Answers Sheet</h3>
            <div className="space-y-6">
              {result.questions.map((q, idx) => {
                const userAns = result.gradedAnswers ? result.gradedAnswers[idx] : null; // Wait, let's map graded answers
                // Let's resolve what answer index the student chose
                const answerObject = result.answers.find((a) => a.questionId === q._id);
                const chosenOptIdx = answerObject ? answerObject.selectedOption : -1;
                const isCorrect = answerObject ? answerObject.isCorrect : false;

                return (
                  <div key={q._id} className="space-y-3 pb-6 border-b last:border-none border-slate-200/10 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-400">{idx + 1}.</span>
                      <p className="font-semibold leading-relaxed text-slate-700 dark:text-slate-300">{q.question}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 pl-6">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'border-slate-200 dark:border-slate-800';
                        if (optIdx === q.correctAnswer) {
                          btnStyle = 'border-green-500 bg-green-500/10 text-green-600 font-semibold';
                        } else if (optIdx === chosenOptIdx && !isCorrect) {
                          btnStyle = 'border-red-500 bg-red-500/10 text-red-600 font-semibold';
                        }
                        return (
                          <div key={optIdx} className={`p-3 rounded-xl border text-[11px] flex items-center ${btnStyle}`}>
                            <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-bold mr-2 text-slate-600 dark:text-slate-400">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pl-6 pt-2 text-slate-500 space-y-1">
                      <div className="flex items-center space-x-1">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-bold">
                          {isCorrect ? 'Correct Answer Selected' : chosenOptIdx === -1 ? 'Skipped Question' : 'Incorrect Answer Selected'}
                        </span>
                      </div>
                      <p className="leading-relaxed bg-slate-100/50 dark:bg-slate-850/50 p-3 rounded-xl border border-slate-200/10">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
