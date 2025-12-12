export interface Question {
  id: string
  question: string
  answers: string[]
  correctAnswer: number
}

export interface QuizResult {
  totalQuestions: number
  correctAnswers: number
  percentage: number
}
