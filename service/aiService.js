import { PostRepository } from "../repository/postRepository.js"
import { askGemini } from "../util/geminiClient.js"

export const AiService = {
  async askQuestion(question) {
    const posts = await PostRepository.getAllSimple()
    const context = posts.map(p => `${p.title}: ${p.content}`).join("\n\n")

    const prompt = `
You are an AI assistant. Answer the question using the following blog posts:
${context}

Question: ${question}
`

    const answer = await askGemini(prompt)
    return answer
  }
}
