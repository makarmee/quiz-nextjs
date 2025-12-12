"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Question } from "@/app/manage-questions/page"

interface QuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: Question | null
  onSave: (question: Question) => void
}

export function QuestionDialog({ open, onOpenChange, question, onSave }: QuestionDialogProps) {
  const [questionText, setQuestionText] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState(0)

  useEffect(() => {
    if (question) {
      setQuestionText(question.question)
      setOptions(question.options)
      setCorrectAnswer(question.correctAnswer)
    } else {
      setQuestionText("")
      setOptions(["", "", "", ""])
      setCorrectAnswer(0)
    }
  }, [question, open])

  const handleSave = () => {
    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      alert("Please fill in all fields")
      return
    }

    const savedQuestion: Question = {
      id: question?.id || "",
      question: questionText,
      options,
      correctAnswer,
    }

    onSave(savedQuestion)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Edit Question" : "Add New Question"}</DialogTitle>
          <DialogDescription>
            {question ? "Update the question details below" : "Fill in the details to create a new question"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              placeholder="Enter your question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label>Answer Options</Label>
            <RadioGroup value={correctAnswer.toString()} onValueChange={(v) => setCorrectAnswer(Number(v))}>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="sr-only">
                    Option {index + 1}
                  </Label>
                  <Input
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1"
                  />
                </div>
              ))}
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Select the radio button next to the correct answer</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{question ? "Update" : "Add"} Question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
