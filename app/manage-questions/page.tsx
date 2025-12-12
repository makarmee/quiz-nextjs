"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { QuestionDialog } from "@/components/question-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export default function ManageQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null)

  // Load questions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("quizQuestions")
    if (stored) {
      setQuestions(JSON.parse(stored))
    } else {
      // Initialize with default questions
      const defaultQuestions: Question[] = [
        {
          id: "1",
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
          id: "2",
          question: "Which CSS property controls text size?",
          options: ["text-size", "font-size", "text-style", "font-style"],
          correctAnswer: 1,
        },
      ]
      localStorage.setItem("quizQuestions", JSON.stringify(defaultQuestions))
      setQuestions(defaultQuestions)
    }
  }, [])

  const saveQuestions = (updatedQuestions: Question[]) => {
    localStorage.setItem("quizQuestions", JSON.stringify(updatedQuestions))
    setQuestions(updatedQuestions)
  }

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setIsDialogOpen(true)
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsDialogOpen(true)
  }

  const handleSaveQuestion = (question: Question) => {
    if (editingQuestion) {
      // Update existing question
      const updatedQuestions = questions.map((q) => (q.id === question.id ? question : q))
      saveQuestions(updatedQuestions)
    } else {
      // Add new question
      const newQuestion = {
        ...question,
        id: Date.now().toString(),
      }
      saveQuestions([...questions, newQuestion])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter((q) => q.id !== id)
    saveQuestions(updatedQuestions)
    setDeletingQuestionId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Questions</h1>
              <p className="text-muted-foreground">Create and manage your quiz questions</p>
            </div>
            <Button onClick={handleAddQuestion} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No questions yet</p>
              <Button onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {index + 1}. {question.question}
                      </CardTitle>
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <CardDescription
                            key={optIndex}
                            className={
                              optIndex === question.correctAnswer
                                ? "font-semibold text-green-600 dark:text-green-400"
                                : ""
                            }
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correctAnswer && " ✓"}
                          </CardDescription>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditQuestion(question)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setDeletingQuestionId(question.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Question Dialog */}
        <QuestionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          question={editingQuestion}
          onSave={handleSaveQuestion}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={!!deletingQuestionId}
          onOpenChange={(open) => !open && setDeletingQuestionId(null)}
          onConfirm={() => deletingQuestionId && handleDeleteQuestion(deletingQuestionId)}
        />
      </div>
    </div>
  )
}
