import { AiService } from "../service/aiService.js"

export const AiController = {
  async ask(req, res, next) {
    try {
      const { question } = req.body
      const answer = await AiService.askQuestion(question)
      res.json({ answer })
    } catch (err) {
      next(err)
    }
  }
}
