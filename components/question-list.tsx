"use client"

import type { Question } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (id: string) => void
}

export function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No questions yet. Add your first question above.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-base">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              {question.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`text-sm px-3 py-2 rounded-md ${
                    index === question.correctAnswer ? "bg-primary/10 text-primary font-medium" : "bg-muted"
                  }`}
                >
                  {index + 1}. {answer}
                  {index === question.correctAnswer && " ✓"}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(question)}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(question.id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
