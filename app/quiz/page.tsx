"use client"

import { useState, useEffect } from "react"
import type { Question, QuizResult } from "@/lib/types"
import { quizStorage } from "@/lib/quiz-storage"
import { QuizInterface } from "@/components/quiz-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [quizStarted, setQuizStarted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const randomQuestions = quizStorage.getRandomQuestions(5)
    setQuestions(randomQuestions)
  }, [])

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleFinish = (quizResult: QuizResult) => {
    setResult(quizResult)
    setQuizStarted(false)
  }

  const handleRetake = () => {
    const randomQuestions = quizStorage.getRandomQuestions(5)
    setQuestions(randomQuestions)
    setResult(null)
    setQuizStarted(true)
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold text-primary">{result.percentage}%</div>
                <p className="text-xl text-muted-foreground">
                  You got {result.correctAnswers} out of {result.totalQuestions} questions correct
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRetake} className="flex-1">
                  Retake Quiz
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Manager
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Ready to Start?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">You will be asked {questions.length} random questions</p>
                <p className="text-muted-foreground">Each question has a 30-second timer</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleStartQuiz} className="flex-1" disabled={questions.length === 0}>
                  Start Quiz
                </Button>
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Manager
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <QuizInterface questions={questions} onFinish={handleFinish} />
      </div>
    </div>
  )
}
