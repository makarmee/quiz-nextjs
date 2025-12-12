"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Question } from "@/app/manage-questions/page"

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("quizQuestions")
    if (stored) {
      const parsedQuestions = JSON.parse(stored)
      setQuestions(parsedQuestions)
    }
    setLoading(false)
  }, [])

  const handleAnswerClick = (answerIndex: number) => {
    if (answered) return

    setSelectedAnswer(answerIndex)
    setAnswered(true)

    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No Questions Available</CardTitle>
            <CardDescription>Please add some questions first to start the quiz</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/manage-questions">
              <Button>Go to Question Management</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const progressValue = ((currentQuestion + 1) / questions.length) * 100

  if (showResult) {
    const percentage = (score / questions.length) * 100
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg mt-2">{"Here's how you did"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold text-primary">
                {score}/{questions.length}
              </div>
              <p className="text-xl text-muted-foreground">
                {percentage >= 80
                  ? "Excellent work!"
                  : percentage >= 60
                    ? "Good job!"
                    : percentage >= 40
                      ? "Not bad!"
                      : "Keep practicing!"}
              </p>
            </div>
            <Progress value={percentage} className="h-4" />
            <div className="text-center text-muted-foreground">You scored {percentage.toFixed(0)}%</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button onClick={handleRestart} size="lg" className="px-8">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardDescription>
                Question {currentQuestion + 1} of {questions.length}
              </CardDescription>
              <CardDescription>
                Score: {score}/{questions.length}
              </CardDescription>
            </div>
            <Progress value={progressValue} className="mb-4" />
            <CardTitle className="text-2xl text-balance">{questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(index)}
                variant={
                  answered
                    ? index === questions[currentQuestion].correctAnswer
                      ? "default"
                      : index === selectedAnswer
                        ? "destructive"
                        : "outline"
                    : "outline"
                }
                className="w-full justify-start text-left h-auto py-4 px-6 text-base"
                disabled={answered}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {answered && (
                <span>{selectedAnswer === questions[currentQuestion].correctAnswer ? "Correct!" : "Incorrect"}</span>
              )}
            </div>
            <Button onClick={handleNextQuestion} disabled={!answered}>
              {currentQuestion === questions.length - 1 ? "Finish" : "Next Question"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
