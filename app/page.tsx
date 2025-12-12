"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play } from "lucide-react"
import Link from "next/link"

const quizQuestions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which CSS property controls text size?",
    options: ["text-size", "font-size", "text-style", "font-style"],
    correctAnswer: 1,
  },
  {
    question: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correctAnswer: 1,
  },
  {
    question: "Which HTML tag is used for the largest heading?",
    options: ["<heading>", "<h6>", "<head>", "<h1>"],
    correctAnswer: 3,
  },
  {
    question: "What is the correct JavaScript syntax to print 'Hello World'?",
    options: ["print('Hello World')", "console.log('Hello World')", "echo('Hello World')", "printf('Hello World')"],
    correctAnswer: 1,
  },
]

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const handleAnswerClick = (answerIndex: number) => {
    if (answered) return

    setSelectedAnswer(answerIndex)
    setAnswered(true)

    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < quizQuestions.length) {
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

  const progressValue = ((currentQuestion + 1) / quizQuestions.length) * 100

  if (showResult) {
    const percentage = (score / quizQuestions.length) * 100
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Quiz Complete! 🎉</CardTitle>
            <CardDescription className="text-lg mt-2">Here's how you did</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <div className="text-6xl font-bold text-primary">
                {score}/{quizQuestions.length}
              </div>
              <p className="text-xl text-muted-foreground">
                {percentage >= 80
                  ? "Excellent work! 🌟"
                  : percentage >= 60
                    ? "Good job! 👍"
                    : percentage >= 40
                      ? "Not bad! 💪"
                      : "Keep practicing! 📚"}
              </p>
            </div>
            <Progress value={percentage} className="h-4" />
            <div className="text-center text-muted-foreground">You scored {percentage.toFixed(0)}%</div>
          </CardContent>
          <CardFooter className="flex justify-center">
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
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-balance">Quiz Master</h1>
          <p className="text-xl text-muted-foreground">Create and take quizzes with ease</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/manage-questions" className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center p-12">
                <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-3">Manage Questions</CardTitle>
                <CardDescription className="text-base">
                  Add, edit, and delete quiz questions to build your perfect quiz
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/quiz" className="block group">
            <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer border-2 hover:border-primary">
              <CardHeader className="text-center p-12">
                <div className="mx-auto mb-6 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Play className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl mb-3">Start Quiz</CardTitle>
                <CardDescription className="text-base">
                  Test your knowledge with the available quiz questions
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {!showResult && (
          <div className="mt-12">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardDescription>
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </CardDescription>
                  <CardDescription>
                    Score: {score}/{quizQuestions.length}
                  </CardDescription>
                </div>
                <Progress value={progressValue} className="mb-4" />
                <CardTitle className="text-2xl text-balance">{quizQuestions[currentQuestion].question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    variant={
                      answered
                        ? index === quizQuestions[currentQuestion].correctAnswer
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
                    <span>
                      {selectedAnswer === quizQuestions[currentQuestion].correctAnswer ? "✅ Correct!" : "❌ Incorrect"}
                    </span>
                  )}
                </div>
                <Button onClick={handleNextQuestion} disabled={!answered}>
                  {currentQuestion === quizQuestions.length - 1 ? "Finish" : "Next Question"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
