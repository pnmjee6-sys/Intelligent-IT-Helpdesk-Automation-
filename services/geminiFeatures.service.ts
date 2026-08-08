import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

export interface StudyPlanDay {
  day: number;
  title: string;
  topics: string[];
  tasks: string[];
  estimated_hours: number;
}

export interface QuizQuestion {
  question_number: number;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
}

export class GeminiFeaturesService {
  private static getClient(): GoogleGenAI | null {
    if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
      return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
    return null;
  }

  // 1. Study Planner Generator
  static async generateStudyPlan(
    topic: string,
    durationDays: number = 7,
    skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Promise<{ title: string; target_skill_level: string; schedule: StudyPlanDay[] }> {
    const ai = this.getClient();
    if (ai) {
      try {
        const prompt = `You are an expert IT Education and Study Planner engine.
Create a structured ${durationDays}-day study plan for learning: "${topic}" at ${skillLevel} level.
Output ONLY valid JSON matching this schema:
{
  "title": "Study Plan Title",
  "target_skill_level": "${skillLevel}",
  "schedule": [
    {
      "day": 1,
      "title": "Day Title",
      "topics": ["Topic 1", "Topic 2"],
      "tasks": ["Task 1", "Task 2"],
      "estimated_hours": 2
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('[GeminiFeaturesService] Study planner AI call failed, using heuristic template:', err);
      }
    }

    // Heuristic fallback
    return {
      title: `${topic} - ${durationDays} Day Study Roadmap (${skillLevel})`,
      target_skill_level: skillLevel,
      schedule: Array.from({ length: durationDays }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${topic} Fundamentals Part ${i + 1}`,
        topics: [`Core ${topic} Concept ${i + 1}`, `Best Practices & Architectures`],
        tasks: [`Read documentation section ${i + 1}`, `Complete practical lab exercise`],
        estimated_hours: 2,
      })),
    };
  }

  // 2. Quiz Generator
  static async generateQuiz(
    topic: string,
    numQuestions: number = 5,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ): Promise<{ topic: string; difficulty: string; questions: QuizQuestion[] }> {
    const ai = this.getClient();
    if (ai) {
      try {
        const prompt = `You are a Technical Certification Quiz Generator.
Generate a ${numQuestions}-question multiple choice quiz on the topic "${topic}" at ${difficulty} difficulty.
Output ONLY valid JSON matching this schema:
{
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question_number": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_option_index": 0,
      "explanation": "Detailed explanation of why Option A is correct."
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('[GeminiFeaturesService] Quiz generator AI call failed, using heuristic template:', err);
      }
    }

    // Heuristic fallback
    return {
      topic,
      difficulty,
      questions: Array.from({ length: numQuestions }, (_, i) => ({
        question_number: i + 1,
        question: `Sample Question ${i + 1} regarding ${topic}?`,
        options: [
          `Primary standard configuration for ${topic}`,
          `Secondary fallback option`,
          `Deprecated protocol setting`,
          `Invalid parameter value`,
        ],
        correct_option_index: 0,
        explanation: `Primary standard configuration is recommended for optimal performance in ${topic}.`,
      })),
    };
  }

  // 3. Notes Summarizer
  static async summarizeNotes(
    notesText: string,
    summaryLength: 'concise' | 'detailed' | 'bullet_points' = 'bullet_points'
  ): Promise<{ summary: string; key_takeaways: string[]; action_items: string[] }> {
    const ai = this.getClient();
    if (ai) {
      try {
        const prompt = `You are an AI IT Support Notes Summarizer.
Summarize the following notes text in ${summaryLength} format.
Output ONLY valid JSON matching this schema:
{
  "summary": "Overall summary paragraph",
  "key_takeaways": ["Takeaway 1", "Takeaway 2"],
  "action_items": ["Action item 1", "Action item 2"]
}

Notes Text:
${notesText}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('[GeminiFeaturesService] Notes summarizer AI call failed, using fallback:', err);
      }
    }

    // Heuristic fallback
    return {
      summary: `Summary of notes regarding ${notesText.substring(0, 50)}...`,
      key_takeaways: ['Identified primary root cause', 'Verified credentials and access settings'],
      action_items: ['Update Knowledge Base article', 'Notify affected user of resolution'],
    };
  }

  // 4. AI Chat Assistant
  static async runAIChat(
    messages: Array<{ role: 'user' | 'model'; text: string }>,
    newMessage: string
  ): Promise<{ reply: string }> {
    const ai = this.getClient();
    if (ai) {
      try {
        const conversationContext = messages.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
        const prompt = `You are an intelligent IT Helpdesk AI Assistant. Provide clear, professional, and helpful answers to user technical questions.

Conversation History:
${conversationContext}

USER: ${newMessage}
ASSISTANT:`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        if (response.text) {
          return { reply: response.text };
        }
      } catch (err) {
        console.warn('[GeminiFeaturesService] AI Chat call failed, using fallback response:', err);
      }
    }

    return {
      reply: `I am your IT Helpdesk AI Assistant. Regarding your question "${newMessage}", please check network settings, clear application cache, or contact your Tier 1 support lead if the issue persists.`,
    };
  }

  // 5. Flashcards Generator
  static async generateFlashcards(
    topic: string,
    cardCount: number = 5
  ): Promise<{ topic: string; flashcards: Flashcard[] }> {
    const ai = this.getClient();
    if (ai) {
      try {
        const prompt = `You are an IT Certification Flashcard Generator.
Generate ${cardCount} study flashcards for topic "${topic}".
Output ONLY valid JSON matching this schema:
{
  "topic": "${topic}",
  "flashcards": [
    {
      "id": 1,
      "front": "Front question / term",
      "back": "Back answer / explanation",
      "category": "Category name"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err) {
        console.warn('[GeminiFeaturesService] Flashcards generator AI call failed, using fallback:', err);
      }
    }

    // Heuristic fallback
    return {
      topic,
      flashcards: Array.from({ length: cardCount }, (_, i) => ({
        id: i + 1,
        front: `What is the primary role of ${topic} Component ${i + 1}?`,
        back: `${topic} Component ${i + 1} handles high-availability routing, data validation, and automated failover.`,
        category: topic,
      })),
    };
  }
}
