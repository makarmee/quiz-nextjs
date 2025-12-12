"use client"

import { useState, useEffect } from "react"
import type { Question, QuizResult } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface QuizInterfaceProps {
  questions: Question[]
  onFinish: (result: QuizResult) => void
}

const TIMER_DURATION = 30

export function QuizInterface({ questions, onFinish }: QuizInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext()
          return TIMER_DURATION
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentIndex])

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer ?? -1]
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setTimeLeft(TIMER_DURATION)
    } else {
      const correctAnswers = newAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
      onFinish({
        totalQuestions: questions.length,
        correctAnswers,
        percentage: Math.round((correctAnswers / questions.length) * 100),
      })
    }
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>Time: {timeLeft}s</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                selectedAnswer === index ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              {index + 1}. {answer}
            </button>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleNext} disabled={selectedAnswer === null} className="w-full">
        {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
      </Button>
    </div>
  )
}
