import { Request, Response } from "express";
import * as examService from "./exams.service";

export async function getExam(req: Request, res: Response) {
  const id = req.params.id as string; 

  const exam = await examService.getExamById(id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  res.json(exam);
}
