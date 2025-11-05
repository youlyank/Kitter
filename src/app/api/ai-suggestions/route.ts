import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { Component } from '@/types/component'

interface AIRequest {
  prompt: string
  currentComponents: Component[]
  context?: string
}

interface ComponentSuggestion {
  type: string
  name: string
  description: string
  props: Record<string, any>
  category: string
  reason: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json()
    const { prompt, currentComponents, context } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    // Create a context-aware prompt for the AI
    const systemPrompt = `You are an expert UI/UX designer and frontend developer helping users build web applications with a zero-code builder. 

Current project has ${currentComponents.length} components:
${currentComponents.map(comp => `- ${comp.type}: ${JSON.stringify(comp.props)}`).join('\n')}

Based on the user's request, suggest appropriate components that would help them achieve their goal. For each suggestion, provide:
1. Component type (from: heading, paragraph, button, input, container, card, image, list, grid, flex)
2. Component name
3. Brief description
4. Suggested properties
5. Category (Layout, Text, Input, Button, Media, Display)
6. Reason why this component helps

Respond in JSON format with an array of suggestions.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `User request: "${prompt}"${context ? `\nAdditional context: ${context}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const messageContent = completion.choices[0]?.message?.content
    
    if (!messageContent) {
      return NextResponse.json(
        { error: 'Failed to generate AI suggestions' },
        { status: 500 }
      )
    }

    // Try to parse the AI response as JSON
    let suggestions: ComponentSuggestion[]
    try {
      // Extract JSON from the response (in case the AI adds extra text)
      const jsonMatch = messageContent.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0])
      } else {
        suggestions = JSON.parse(messageContent)
      }
    } catch (parseError) {
      // Fallback: create a basic suggestion if JSON parsing fails
      suggestions = [{
        type: 'container',
        name: 'Suggested Container',
        description: 'A container to organize your content',
        props: { padding: '16px', backgroundColor: '#f8f9fa' },
        category: 'Layout',
        reason: 'Based on your request, a container would help structure your content'
      }]
    }

    return NextResponse.json({
      suggestions,
      prompt,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    )
  }
}