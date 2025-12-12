import type { Question } from "./types"

const STORAGE_KEY = "quiz-questions"

export const quizStorage = {
  getQuestions: (): Question[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveQuestions: (questions: Question[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  },

  addQuestion: (question: Omit<Question, "id">): void => {
    const questions = quizStorage.getQuestions()
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
    }
    questions.push(newQuestion)
    quizStorage.saveQuestions(questions)
  },

  updateQuestion: (id: string, question: Omit<Question, "id">): void => {
    const questions = quizStorage.getQuestions()
    const index = questions.findIndex((q) => q.id === id)
    if (index !== -1) {
      questions[index] = { ...question, id }
      quizStorage.saveQuestions(questions)
    }
  },

  deleteQuestion: (id: string): void => {
    const questions = quizStorage.getQuestions()
    const filtered = questions.filter((q) => q.id !== id)
    quizStorage.saveQuestions(filtered)
  },

  getRandomQuestions: (count: number): Question[] => {
    const questions = quizStorage.getQuestions()
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(count, questions.length))
  },
}
