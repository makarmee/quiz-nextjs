"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Question } from "@/lib/types"

interface QuestionFormProps {
  question?: Question
  onSubmit: (question: Omit<Question, "id">) => void
  onCancel?: () => void
}

export function QuestionForm({ question, onSubmit, onCancel }: QuestionFormProps) {
  const [formData, setFormData] = useState({
    question: question?.question || "",
    answers: question?.answers || ["", "", "", ""],
    correctAnswer: question?.correctAnswer ?? 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.question && formData.answers.every((a) => a.trim())) {
      onSubmit(formData)
      setFormData({ question: "", answers: ["", "", "", ""], correctAnswer: 0 })
    }
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.answers]
    newAnswers[index] = value
    setFormData({ ...formData, answers: newAnswers })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question ? "Edit Question" : "Add New Question"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter your question"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Answers</Label>
            {formData.answers.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                  required
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === index}
                  onChange={() => setFormData({ ...formData, correctAnswer: index })}
                  className="h-4 w-4"
                />
                <Label className="text-sm text-muted-foreground">Correct</Label>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button type="submit">{question ? "Update" : "Add"} Question</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
