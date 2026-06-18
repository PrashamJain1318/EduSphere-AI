import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateXPAndStreak } from '../store/slices/authSlice.js';
import { Send, Bot, User, Loader2, Sparkles, HelpCircle, FileText, ClipboardList, CheckCircle2, XCircle, Award, BookOpen } from 'lucide-react';
import api from '../utils/api.js';

const AIAssistant = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('chat'); // chat, summarizer, quiz

  // ----------------------------------------------------
  // TAB 1: DOUBT CHAT STATES
  // ----------------------------------------------------
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your EduSphere AI study companion. Ask me any doubt, numerical problem, formula explanation, or ask me to generate a chapter summary note.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const examples = [
    'Explain Newton’s Laws with examples',
    'Solve physics numerical: A car starts from rest and accelerates uniformly at 2 m/s² for 10s. Find displacement.',
    'Explain Organic Chemistry Esterification reaction',
    'Generate short revision notes for Carbon and its Compounds',
  ];

  // ----------------------------------------------------
  // TAB 2: SUMMARIZER STATES
  // ----------------------------------------------------
  const [notesText, setNotesText] = useState('');
  const [summaryOutput, setSummaryOutput] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  // ----------------------------------------------------
  // TAB 3: QUIZ GENERATOR STATES
  // ----------------------------------------------------
  const [quizText, setQuizText] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('medium');
  const [quizCount, setQuizCount] = useState(5);
  const [quizLoading, setQuizLoading] = useState(false);

  // Active quiz attempting states
  const [quizTest, setQuizTest] = useState(null); // holds { _id, title, duration, questions }
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionId: selectedIndex }
  const [quizCurrentIdx, setQuizCurrentIdx] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  const handleSendChat = async (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;
    if (!textToSend) setChatInput('');

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setChatLoading(true);

    try {
      const res = await api.post('/ai/doubt', { question: text });
      if (res.data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: res.data.answer }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'AI encountered an issue. Please verify your backend setup.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSummarizeNotes = async (e) => {
    e.preventDefault();
    if (!notesText.trim()) return;

    setSummaryLoading(true);
    setSummaryOutput('');
    try {
      const res = await api.post('/ai/summarize-notes', { notesText });
      if (res.data.success) {
        setSummaryOutput(res.data.summary);
      }
    } catch (err) {
      console.error(err);
      setSummaryOutput('Failed to summarize notes. Ensure your backend and Gemini key are operational.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizText.trim()) return;

    setQuizLoading(true);
    setQuizTest(null);
    setQuizAnswers({});
    setQuizCurrentIdx(0);
    setQuizSubmitted(false);
    setQuizResult(null);

    try {
      const res = await api.post('/ai/generate-quiz', {
        notesText: quizText,
        difficulty: quizDifficulty,
        count: quizCount,
      });

      if (res.data.success) {
        setQuizTest(res.data.test);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate quiz.');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizOptionSelect = (qId, optionIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizTest) return;
    setQuizSubmitting(true);
    try {
      const payloadAnswers = Object.keys(quizAnswers).map((qId) => ({
        questionId: qId,
        selectedOption: quizAnswers[qId],
      }));

      // Add missing skipped questions
      quizTest.questions.forEach((q) => {
        if (quizAnswers[q._id] === undefined) {
          payloadAnswers.push({
            questionId: q._id,
            selectedOption: -1,
          });
        }
      });

      const res = await api.post('/ai/submit-test', {
        testId: quizTest._id,
        answers: payloadAnswers,
        timeTaken: 120, // dummy time taken
      });

      if (res.data.success) {
        setQuizResult(res.data.result);
        setQuizSubmitted(true);
        // Dispatch XP globally
        dispatch(updateXPAndStreak({
          xp: res.data.result.totalXp,
          badges: res.data.result.badges
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setQuizSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 dark:bg-[#0b0f19]">
      {/* Title */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-2xl text-white shadow-md">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Advanced AI Assistant Suite</h1>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
            <span>Powered by Google Gemini</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        {[
          { id: 'chat', label: 'AI Doubt Solver', icon: <HelpCircle className="h-4 w-4" /> },
          { id: 'summarizer', label: 'AI Notes Summarizer', icon: <FileText className="h-4 w-4" /> },
          { id: 'quiz', label: 'AI Quiz Maker', icon: <ClipboardList className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-1.5 pb-3 px-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: CHAT SOLVER */}
      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto flex flex-col h-[480px] justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-xl text-white flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-700'}`}>
                  {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line border shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-50/70 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200/50'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="p-2 rounded-xl bg-slate-700 text-white flex-shrink-0"><Bot className="h-4 w-4" /></div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border text-xs sm:text-sm text-slate-500 flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span>Solving equation parameters...</span>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="mb-4 space-y-2.5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Common Queries</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {examples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(ex)}
                    className="text-left p-3 bg-slate-100/50 hover:bg-blue-50/50 dark:bg-slate-850/50 dark:hover:bg-blue-950/10 rounded-xl border text-[11px] font-semibold text-slate-600 dark:text-slate-350"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="flex gap-2.5 bg-white dark:bg-slate-800 p-2 rounded-2xl border shadow-sm"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Input your doubt formula or request summary..."
              disabled={chatLoading}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: NOTES SUMMARIZER */}
      {activeTab === 'summarizer' && (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <form onSubmit={handleSummarizeNotes} className="glass-card p-6 rounded-3xl border shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Study Text</h3>
            <textarea
              rows="10"
              required
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Paste chapter notes, lecture transcript transcripts, or formula lists here (supports up to 8000 characters)..."
              className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl text-xs focus:outline-none font-medium"
            ></textarea>
            <button
              type="submit"
              disabled={summaryLoading || !notesText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-xs flex items-center justify-center space-x-1"
            >
              {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              <span>Summarize Notes with AI</span>
            </button>
          </form>

          <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border shadow-sm min-h-[350px] flex flex-col">
            <h3 className="text-sm font-bold border-b pb-3 border-slate-200/20">AI Generated Summary Report</h3>
            {summaryOutput ? (
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-250 flex-1 overflow-y-auto max-h-[400px] pr-1 mt-4">
                {summaryOutput}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <FileText className="h-10 w-10 text-slate-350 dark:text-slate-700 mb-3 animate-pulse" />
                <p className="text-xs">Paste your document notes in the console panel to review key definitions and formula summaries.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ MAKER */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Setup Panel (Only visible if no test loaded or quiz submitted) */}
          {!quizTest && (
            <form onSubmit={handleGenerateQuiz} className="glass-card p-6 rounded-3xl border shadow-sm space-y-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Configure Custom Quiz</h3>
              <div className="grid md:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="md:col-span-3">
                  <label className="block text-slate-500 mb-1.5">Paste Document Text</label>
                  <textarea
                    rows="6"
                    required
                    value={quizText}
                    onChange={(e) => setQuizText(e.target.value)}
                    placeholder="Paste chapter notes here to build MCQs..."
                    className="w-full p-3 bg-white dark:bg-slate-800 border rounded-xl"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5">Difficulty</label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5">Number of Questions</label>
                  <select
                    value={quizCount}
                    onChange={(e) => setQuizCount(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border rounded-xl"
                  >
                    <option value="3">3 MCQs</option>
                    <option value="5">5 MCQs</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={quizLoading || !quizText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-1.5 text-xs"
              >
                {quizLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Sparkles className="h-4.5 w-4.5" />}
                <span>Generate Custom Quiz</span>
              </button>
            </form>
          )}

          {/* Test Attempt Panel */}
          {quizTest && !quizSubmitted && (
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
                <div className="flex justify-between items-center border-b pb-3 border-slate-200/20">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    MCQ {quizCurrentIdx + 1} of {quizTest.questions.length}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
                    AI Practice
                  </span>
                </div>

                <div className="text-sm font-semibold leading-relaxed">
                  {quizTest.questions[quizCurrentIdx].question}
                </div>

                <div className="space-y-3">
                  {quizTest.questions[quizCurrentIdx].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizOptionSelect(quizTest.questions[quizCurrentIdx]._id, idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        quizAnswers[quizTest.questions[quizCurrentIdx]._id] === idx
                          ? 'border-blue-500 bg-blue-50/70 text-blue-950 dark:bg-blue-950/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                      }`}
                    >
                      <span className="inline-block bg-slate-200 dark:bg-slate-850 px-2.5 py-1 rounded-lg text-slate-600 mr-3">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-200/20">
                  <button
                    onClick={() => setQuizCurrentIdx((prev) => Math.max(0, prev - 1))}
                    disabled={quizCurrentIdx === 0}
                    className="bg-slate-100 dark:bg-slate-850 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setQuizCurrentIdx((prev) => Math.min(quizTest.questions.length - 1, prev + 1))}
                    disabled={quizCurrentIdx === quizTest.questions.length - 1}
                    className="bg-slate-100 dark:bg-slate-850 px-3 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Navigator card */}
              <div className="glass-card p-6 rounded-3xl border shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Progress Grid</h3>
                <div className="flex flex-wrap gap-2.5">
                  {quizTest.questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizCurrentIdx(idx)}
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs border transition-all ${
                        quizCurrentIdx === idx
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : quizAnswers[quizTest.questions[idx]._id] !== undefined
                          ? 'border-green-500 bg-green-50 text-green-600'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={quizSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl shadow-lg text-xs"
                >
                  {quizSubmitting ? 'Posting answers...' : 'Submit quiz worksheet'}
                </button>
              </div>
            </div>
          )}

          {/* Quiz result sheet */}
          {quizSubmitted && quizResult && (
            <div className="space-y-8 animate-float">
              <div className="glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
                <div className="text-center space-y-2">
                  <div className="bg-amber-500 text-white p-3 rounded-2xl inline-block shadow-lg mb-2"><Award className="h-8 w-8" /></div>
                  <h2 className="text-2xl font-bold">Quiz Performance Graded!</h2>
                  <p className="text-xs text-slate-400">{quizTest.title}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center border-y py-6 border-slate-200/20">
                  <div>
                    <div className="text-2xl font-black text-blue-600">{quizResult.score}</div>
                    <div className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mt-1">Total Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-indigo-600">{quizResult.accuracy.toFixed(1)}%</div>
                    <div className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mt-1">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-green-600">{quizResult.correctAnswers} / {quizResult.totalQuestions}</div>
                    <div className="text-[9px] uppercase text-slate-400 font-bold tracking-wider mt-1">Correct answers</div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-xs leading-relaxed">
                  <strong>AI Grader Suggestion:</strong> {quizResult.suggestions}
                </div>

                <button
                  onClick={() => setQuizTest(null)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs"
                >
                  Configure Another Document Quiz
                </button>
              </div>

              {/* Review Sheet */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
                <h3 className="text-lg font-bold border-b pb-3 border-slate-200/20">Review Answers Sheet</h3>
                <div className="space-y-6">
                  {quizTest.questions.map((q, idx) => {
                    const ansObj = quizResult.answers.find((a) => a.questionId === q._id);
                    const chosenIdx = ansObj ? ansObj.selectedOption : -1;
                    const isCorrect = ansObj ? ansObj.isCorrect : false;

                    return (
                      <div key={q._id} className="space-y-3 pb-6 border-b last:border-none border-slate-200/10 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-slate-400">{idx + 1}.</span>
                          <p className="font-semibold leading-relaxed text-slate-700 dark:text-slate-350">{q.question}</p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 pl-6">
                          {q.options.map((opt, optIdx) => {
                            let cellStyle = 'border-slate-200 dark:border-slate-800';
                            if (optIdx === q.correctAnswer) {
                              cellStyle = 'border-green-500 bg-green-500/10 text-green-600 font-semibold';
                            } else if (optIdx === chosenIdx && !isCorrect) {
                              cellStyle = 'border-red-500 bg-red-500/10 text-red-600 font-semibold';
                            }
                            return (
                              <div key={optIdx} className={`p-3 rounded-xl border text-[11px] flex items-center ${cellStyle}`}>
                                <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] font-bold mr-2 text-slate-600">
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
                              {isCorrect ? 'Correct Answer Selected' : chosenIdx === -1 ? 'Skipped Question' : 'Incorrect Answer Selected'}
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
      )}
    </div>
  );
};

export default AIAssistant;
