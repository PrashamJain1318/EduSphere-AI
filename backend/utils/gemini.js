import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API if key is present
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Ask AI Doubt Chat
 */
export const getAIChatResponse = async (prompt, systemInstruction = '') => {
  if (!genAI) {
    return `[Mock AI Response - Set GEMINI_API_KEY in .env to enable live AI]

Here is a conceptual answer:
1. **Explanation**: The concept you requested involves core principles.
2. **Formula/Numerical Tip**: Ensure you note down standard units and equations.
3. **Step-by-step breakdown**:
   - Step A: Analyze the values given.
   - Step B: Apply relevant equations.
   - Step C: Double check the calculations.
   
Let me know if you want me to explain this in further detail or solve another question!`;
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || 'You are EduSphere AI, a premium educational study assistant for Class 10 and 12 Indian students. Answer academic queries clearly with formulas and step by step derivations.'
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return `AI service is currently busy. Here is a fallback tip: Make sure to review your NCERT text examples and solve previous year question papers.`;
  }
};

/**
 * AI Study Planner Generator
 */
export const getAIStudyPlan = async (examDate, subjects, hoursPerDay) => {
  const prompt = `Create a detailed daily and weekly study plan for Class 10/12 exams. 
  Target Exam Date: ${examDate}
  Subjects to prepare: ${subjects.join(', ')}
  Available daily study hours: ${hoursPerDay} hours.
  Please structure the response as standard markdown with sections: 'Overview', 'Weekly Breakdown', 'Daily Routine', and 'Revision Strategy'.`;

  if (!genAI) {
    return `# Dynamic study plan (Demo Mode)
## Overview
With your exam scheduled for **${examDate}**, you have a structured timeline to cover: ${subjects.join(', ')}.

## Weekly Breakdown
- **Week 1-2**: Focus on high weightage chapters in: ${subjects[0]}. Practice basic MCQs.
- **Week 3-4**: Transition to core chapters of: ${subjects.slice(1).join(', ') || 'other subjects'}.
- **Final Week**: Revision, formula sheets, and mock tests.

## Daily Routine (${hoursPerDay} hrs/day)
- **Morning (1.5 hrs)**: Conceptual reading and notes summarizing.
- **Afternoon (2 hrs)**: Practice exercises, numericals, and video lectures.
- **Evening (remaining time)**: Weekly mock test corrections and doubt solving.

## Revision Strategy
- Maintain a separate short-notes notebook.
- Attempt at least 3 previous year question papers.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Study Plan Error:', error);
    return `Unable to contact AI. Basic recommendation: Divide your ${hoursPerDay} hours evenly among ${subjects.join(', ')} and set aside 30 minutes daily for quick revisions.`;
  }
};

/**
 * AI Mock Test Generator
 */
export const getAIGeneratedQuestions = async (subject, chapter, difficulty, count = 5) => {
  const prompt = `Act as an expert Class 10 and Class 12 board examiner.
  Generate exactly ${count} multiple choice questions (MCQs) for the Subject: "${subject}", Chapter: "${chapter}", and Difficulty: "${difficulty}".
  
  Return the response ONLY as a JSON array of objects, with NO markdown wrappers (no \`\`\`json etc.). The JSON must match this schema exactly:
  [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // index of correct option (0-3)
      "explanation": "Detailed explanation of why this answer is correct."
    }
  ]`;

  if (!genAI) {
    return getMockQuestionsFallback(subject, chapter, difficulty, count);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Clean up any markdown code block wraps if returned by the LLM
    let cleanJSON = text;
    if (cleanJSON.startsWith('```')) {
      cleanJSON = cleanJSON.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Gemini Question Generation Error:', error);
    return getMockQuestionsFallback(subject, chapter, difficulty, count);
  }
};

function getMockQuestionsFallback(subject, chapter, difficulty, count) {
  const mockDB = [
    {
      question: `Which of the following is correct regarding ${subject} - ${chapter}?`,
      options: ["Statement A is correct", "Statement B is correct", "Both are correct", "None of the above"],
      correctAnswer: 2,
      explanation: `Both statements are correct under the principles of ${subject} - ${chapter} at ${difficulty} level.`
    },
    {
      question: `What is the primary formula/definition associated with ${chapter}?`,
      options: ["Expression X = Y", "Expression Y = Z", "Expression Z = W", "None of these"],
      correctAnswer: 0,
      explanation: "Expression X = Y represents the standard proportional relation in this chapter."
    },
    {
      question: `For a typical Class 10/12 board problem on ${chapter}, what constant value is assumed?`,
      options: ["Unity (1.0)", "Zero (0.0)", "Variable value", "Undefined"],
      correctAnswer: 0,
      explanation: "Unity is assumed for simplified relative calculation in standard syllabus."
    },
    {
      question: `Which key scientist/philosopher formulated the primary theory of ${chapter}?`,
      options: ["Sir Isaac Newton", "Albert Einstein", "Standard Textbook Author", "Antoine Lavoisier"],
      correctAnswer: 0,
      explanation: "Newton's models form the initial core foundation of the classical theory."
    },
    {
      question: `What represents the main applications of ${subject}?`,
      options: ["Industrial manufacturing", "Research and development", "Daily life processes", "All of the above"],
      correctAnswer: 3,
      explanation: "All are valid applications under normal academic standards."
    }
  ];
  return mockDB.slice(0, count);
}

/**
 * AI Notes Summarizer Text Helper
 */
export const summarizeNotesText = async (text) => {
  const prompt = `Act as an elite academic tutor. Analyze the following chapter study text/notes and generate a detailed revision summary.
  Please structure your output using clean Markdown headings, with exactly these sections:
  1. 'Chapter Summary' (Brief 1-paragraph overview)
  2. 'Key Concepts & Definitions' (Bullet points)
  3. 'Essential Formulas & Equations' (List with LaTeX equations if applicable)
  4. 'Important Exam Tips' (Bullet points)
  
  Notes Text:
  ${text.substring(0, 8000)}`; // limit payload size

  if (!genAI) {
    return `# Chapter Study Summary (Demo Mode)

## Chapter Summary
This chapter details core conceptual principles, including structural definitions, practical applications, and formula derivations essential for board preparations.

## Key Concepts & Definitions
- **Core Principle**: Standard definition and relative application.
- **Secondary Concept**: Inter-relationships between constants and variable equations.

## Essential Formulas & Equations
- **Standard Relation**: \\(X = Y \\cdot Z\\)
- **Relative Constant**: \\(K = \\frac{A}{B}\\)

## Important Exam Tips
- Memorize standard units and dimensions.
- Focus on textbook numerical examples.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini Summarize Error:', error);
    return `Unable to contact AI. Basic recommendation: Review your textbook core examples and formula sheet pages.`;
  }
};

/**
 * AI Quiz Generator from Notes text
 */
export const generateQuizFromText = async (text, difficulty, count = 5) => {
  const prompt = `Act as a board examiner. Read the following chapter notes text and generate exactly ${count} multiple choice questions (MCQs) reflecting the difficulty: "${difficulty}".
  
  Return the response ONLY as a JSON array of objects, with NO markdown wrappers (no \`\`\`json etc.). The JSON must match this schema exactly:
  [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // index of correct option (0-3)
      "explanation": "Detailed explanation of why this answer is correct based on the text."
    }
  ]
  
  Notes Text:
  ${text.substring(0, 5000)}`;

  if (!genAI) {
    return [
      {
        question: `Based on the provided text, what represents the primary application?`,
        options: ["Application Alpha", "Application Beta", "Both Alpha and Beta", "None of these"],
        correctAnswer: 2,
        explanation: "The text indicates both Alpha and Beta are core practical implementations."
      },
      {
        question: `Which constant value is specified in the text for base calculations?`,
        options: ["1.0", "0.0", "Variable", "Infinity"],
        correctAnswer: 0,
        explanation: "The textbook notes define unity (1.0) as the standard proportionality index."
      }
    ].slice(0, count);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const textRes = result.response.text().trim();
    
    let cleanJSON = textRes;
    if (cleanJSON.startsWith('```')) {
      cleanJSON = cleanJSON.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Gemini Text Quiz Error:', error);
    return [
      {
        question: `Based on the provided text, what represents the primary application?`,
        options: ["Application Alpha", "Application Beta", "Both Alpha and Beta", "None of these"],
        correctAnswer: 2,
        explanation: "The text indicates both Alpha and Beta are core practical implementations."
      }
    ];
  }
};

