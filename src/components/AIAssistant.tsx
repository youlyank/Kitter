'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Sparkles, 
  Send, 
  Lightbulb,
  Wand2,
  Loader2,
  Plus
} from 'lucide-react'
import { Component } from '@/types/component'

interface AISuggestion {
  type: string
  name: string
  description: string
  props: Record<string, any>
  category: string
  reason: string
}

interface AIAssistantProps {
  components: Component[]
  onAddComponent: (suggestion: AISuggestion) => void
}

export function AIAssistant({ components, onAddComponent }: AIAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<Array<{role: string, content: string}>>([])

  const quickPrompts = [
    "Create a landing page header",
    "Add a contact form",
    "Build a product showcase",
    "Create a navigation menu",
    "Add a pricing section",
    "Build a testimonials section",
    "Create a footer",
    "Add a call-to-action"
  ]

  const generateSuggestions = async (userPrompt: string) => {
    if (!userPrompt.trim()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userPrompt,
          currentComponents: components,
          context: conversation.length > 0 ? conversation.map(c => c.content).join('\n') : undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setConversation([
          ...conversation,
          { role: 'user', content: userPrompt },
          { role: 'assistant', content: `I've suggested ${data.suggestions?.length || 0} components for your request.` }
        ])
      } else {
        console.error('Failed to get AI suggestions')
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt)
    generateSuggestions(quickPrompt)
  }

  const handleAddSuggestion = (suggestion: AISuggestion) => {
    onAddComponent(suggestion)
    setSuggestions(suggestions.filter(s => s !== suggestion))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="font-semibold text-lg">AI Assistant</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Describe what you want to build, and AI will suggest components
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">Quick Ideas</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-8 text-xs justify-start"
              onClick={() => handleQuickPrompt(quickPrompt)}
              disabled={isLoading}
            >
              {quickPrompt}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            onKeyPress={(e) => e.key === 'Enter' && generateSuggestions(prompt)}
            disabled={isLoading}
          />
          <Button
            onClick={() => generateSuggestions(prompt)}
            disabled={!prompt.trim() || isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <ScrollArea className="flex-1 p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-muted-foreground">AI is thinking...</p>
            </div>
          </div>
        )}

        {!isLoading && suggestions.length === 0 && conversation.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold mb-2">Ask AI for Help</h3>
            <p className="text-sm">
              Describe what you want to build, and I'll suggest the perfect components for you!
            </p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                AI Suggestions
              </Badge>
              <Separator className="flex-1" />
            </div>
            
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{suggestion.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleAddSuggestion(suggestion)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                  
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <strong>Why this helps:</strong> {suggestion.reason}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <strong>Properties:</strong> {JSON.stringify(suggestion.props, null, 2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {conversation.length > 0 && (
          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                Conversation
              </Badge>
              <Separator className="flex-1" />
            </div>
            
            {conversation.map((msg, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-50 ml-4' 
                  : 'bg-gray-50 mr-4'
              }`}>
                <div className="text-sm font-medium mb-1">
                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}