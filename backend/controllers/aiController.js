import Subject from '../models/Subject.js';
import Chapter from '../models/Chapter.js';
import Question from '../models/Question.js';
import Test from '../models/Test.js';
import Result from '../models/Result.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { getAIChatResponse, getAIStudyPlan, getAIGeneratedQuestions, summarizeNotesText, generateQuizFromText } from '../utils/gemini.js';

/**
 * Ask AI Doubt Assistant
 */
export const askDoubtAI = async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ success: false, message: 'Please provide a question' });
  }
  try {
    const aiResponse = await getAIChatResponse(question);
    res.json({ success: true, answer: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate AI Study Planner
 */
export const createStudyPlanAI = async (req, res) => {
  const { examDate, subjects, hoursPerDay } = req.body;
  if (!examDate || !subjects || !hoursPerDay) {
    return res.status(400).json({ success: false, message: 'Please provide exam date, subjects, and study hours' });
  }
  try {
    const plan = await getAIStudyPlan(examDate, subjects, hoursPerDay);
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate AI Custom Test
 */
export const generateMockQuestionsAI = async (req, res) => {
  const { subjectId, chapterId, difficulty, count } = req.body;
  if (!subjectId || !chapterId || !difficulty) {
    return res.status(400).json({ success: false, message: 'Please provide subjectId, chapterId, and difficulty' });
  }

  try {
    const subject = await Subject.findById(subjectId);
    const chapter = await Chapter.findById(chapterId);

    if (!subject || !chapter) {
      return res.status(404).json({ success: false, message: 'Subject or Chapter not found' });
    }

    const questionCount = parseInt(count, 10) || 5;

    // Call Gemini utility to generate questions in JSON format
    const questionsData = await getAIGeneratedQuestions(
      subject.name,
      chapter.name,
      difficulty,
      questionCount
    );

    // Save generated questions to DB
    const questionIds = [];
    const populatedQuestions = [];

    for (const item of questionsData) {
      const q = await Question.create({
        subjectId,
        chapterId,
        difficulty,
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation || 'No explanation provided.',
      });
      questionIds.push(q._id);
      populatedQuestions.push(q);
    }

    // Create a new practice test
    const test = await Test.create({
      title: `AI Practice: ${subject.name} - ${chapter.name} (${difficulty})`,
      subjectId,
      chapterId,
      type: 'practice',
      questions: questionIds,
      duration: questionCount * 3, // 3 minutes per question
    });

    res.status(201).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        subjectId: test.subjectId,
        chapterId: test.chapterId,
        type: test.type,
        duration: test.duration,
        questions: populatedQuestions,
      },
    });
  } catch (error) {
    console.error('AI Test Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit test and analyze performance (Module 4 & 5 + AI Weak Topic Detection)
 */
export const submitTestResult = async (req, res) => {
  const { testId, answers, timeTaken } = req.body; // answers: [{ questionId, selectedOption }]
  if (!testId || !answers) {
    return res.status(400).json({ success: false, message: 'Test ID and answers are required' });
  }

  try {
    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    const gradedAnswers = [];

    for (const ans of answers) {
      const question = test.questions.find((q) => q._id.toString() === ans.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === ans.selectedOption;
        if (isCorrect) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
        gradedAnswers.push({
          questionId: ans.questionId,
          selectedOption: ans.selectedOption,
          isCorrect,
        });
      }
    }

    const totalQuestions = test.questions.length;
    const score = correctAnswers * 4 - wrongAnswers * 1; // standard marking: +4 for correct, -1 for wrong
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // AI performance analysis recommendations (fallback to local suggestions if api key is missing)
    let weakTopics = [];
    let suggestions = '';
    const subjectDoc = await Subject.findById(test.subjectId);
    const chapterDoc = test.chapterId ? await Chapter.findById(test.chapterId) : null;
    const topicName = chapterDoc ? `${subjectDoc.name} - ${chapterDoc.name}` : subjectDoc.name;

    if (accuracy < 50) {
      weakTopics.push(topicName);
      suggestions = `Your accuracy is ${accuracy.toFixed(1)}%. Focus on basic definitions and re-watch lecture videos for this chapter. Try solving easier difficulty level MCQs first.`;
    } else if (accuracy < 80) {
      weakTopics.push(topicName);
      suggestions = `Good attempt! Your accuracy is ${accuracy.toFixed(1)}%. We recommend revising the core formulas and attempting medium-level practice questions to improve your grip.`;
    } else {
      suggestions = `Excellent work! Accuracy: ${accuracy.toFixed(1)}%. You have mastered this topic. Move on to the next chapter or try solving hard-level numericals.`;
    }

    const result = await Result.create({
      userId: req.user._id,
      testId,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      accuracy,
      timeTaken,
      answers: gradedAnswers,
      weakTopics,
      suggestions,
    });

    // Award XP
    const user = await User.findById(req.user._id);
    const xpEarned = correctAnswers * 10; // 10 XP per correct answer
    user.xp += xpEarned;
    
    // Check first test badge
    if (!user.badges.includes('First Test Completed')) {
      user.badges.push('First Test Completed');
    }
    if (accuracy === 100 && !user.badges.includes('Perfect Score')) {
      user.badges.push('Perfect Score');
    }
    await user.save();

    res.status(201).json({
      success: true,
      result: {
        _id: result._id,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        accuracy: result.accuracy,
        timeTaken: result.timeTaken,
        weakTopics: result.weakTopics,
        suggestions: result.suggestions,
        xpEarned,
        totalXp: user.xp,
        badges: user.badges,
        testTitle: test.title,
        questions: test.questions, // return questions with correct answers for explanations
      },
    });
  } catch (error) {
    console.error('Submit Test Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get AI Personalized Dashboard Recommendations (Module 9 & 10 + AI Weak Topics)
 */
export const getRecommendations = async (req, res) => {
  try {
    // Look at past test scores
    const results = await Result.find({ userId: req.user._id })
      .populate({
        path: 'testId',
        populate: { path: 'subjectId' },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    let weakChapters = [];
    let weakSubjects = [];

    // Analyze subjects with accuracy < 70%
    results.forEach((resItem) => {
      if (resItem.accuracy < 70) {
        if (resItem.weakTopics && resItem.weakTopics.length > 0) {
          weakChapters.push(...resItem.weakTopics);
        }
      }
    });

    // Fallback if no test results yet
    if (results.length === 0) {
      weakChapters.push('Practice mock tests to discover your weak areas!');
    }

    res.json({
      success: true,
      weakChapters: [...new Set(weakChapters)],
      suggestions: results.length === 0 
        ? 'No mock tests submitted yet. We recommend starting with a Mathematics or Science diagnostic test.'
        : 'Based on your recent tests, we suggest re-watching lectures on topics listed below and practicing Medium difficulty MCQs.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Summarize Notes
 */
export const summarizeNotes = async (req, res) => {
  const { notesText } = req.body;
  if (!notesText) {
    return res.status(400).json({ success: false, message: 'Please provide study text to summarize.' });
  }
  try {
    const summary = await summarizeNotesText(notesText);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Quiz Generator from custom text
 */
export const generateQuiz = async (req, res) => {
  const { notesText, difficulty, count } = req.body;
  if (!notesText) {
    return res.status(400).json({ success: false, message: 'Please provide study notes to build questions from.' });
  }
  try {
    const questionCount = parseInt(count, 10) || 5;
    const questionsData = await generateQuizFromText(notesText, difficulty || 'medium', questionCount);
    
    // Save generated questions to DB under a generic AI category
    const questionIds = [];
    const populatedQuestions = [];
    
    // We can fetch a default Subject or Chapter
    const defaultSubject = await Subject.findOne();
    const defaultChapter = await Chapter.findOne();
    
    for (const item of questionsData) {
      const q = await Question.create({
        subjectId: defaultSubject?._id || new mongoose.Types.ObjectId(),
        chapterId: defaultChapter?._id || new mongoose.Types.ObjectId(),
        difficulty: difficulty || 'medium',
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation || 'Based on your uploaded document.',
      });
      questionIds.push(q._id);
      populatedQuestions.push(q);
    }
    
    // Create a new practice test
    const test = await Test.create({
      title: `AI Notes Quiz: ${difficulty || 'medium'}`,
      subjectId: defaultSubject?._id || new mongoose.Types.ObjectId(),
      chapterId: defaultChapter?._id || new mongoose.Types.ObjectId(),
      type: 'practice',
      questions: questionIds,
      duration: questionCount * 3,
    });
    
    res.status(201).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        type: test.type,
        duration: test.duration,
        questions: populatedQuestions,
      },
    });
  } catch (error) {
    console.error('Quiz Maker Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

