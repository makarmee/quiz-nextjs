"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/lib/types"
import { quizStorage } from "@/lib/quiz-storage"
import { QuestionForm } from "@/components/question-form"
import { QuestionList } from "@/components/question-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  useEffect(() => {
    setQuestions(quizStorage.getQuestions())
  }, [])

  const handleAddQuestion = (question: Omit<Question, "id">) => {
    quizStorage.addQuestion(question)
    setQuestions(quizStorage.getQuestions())
  }

  const handleUpdateQuestion = (question: Omit<Question, "id">) => {
    if (editingQuestion) {
      quizStorage.updateQuestion(editingQuestion.id, question)
      setQuestions(quizStorage.getQuestions())
      setEditingQuestion(null)
    }
  }

  const handleDeleteQuestion = (id: string) => {
    quizStorage.deleteQuestion(id)
    setQuestions(quizStorage.getQuestions())
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Quiz Manager</h1>
          <Link href="/quiz">
            <Button disabled={questions.length < 5}>Start Quiz ({questions.length} questions)</Button>
          </Link>
        </div>

        <div className="space-y-8">
          <QuestionForm
            question={editingQuestion || undefined}
            onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
            onCancel={editingQuestion ? () => setEditingQuestion(null) : undefined}
          />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Questions</h2>
            <QuestionList questions={questions} onEdit={setEditingQuestion} onDelete={handleDeleteQuestion} />
          </div>
        </div>
      </div>
    </div>
  )
}
