import { NextRequest, NextResponse } from 'next/server'
import { Component } from '@/types/component'

interface CodeGenerationRequest {
  components: Component[]
  projectName: string
  framework: 'react' | 'vue' | 'html' | 'nextjs'
}

function generateReactCode(components: Component[], projectName: string): string {
  const componentImports = new Set<string>()
  const componentCode: string[] = []

  // Generate imports
  components.forEach(comp => {
    switch (comp.type) {
      case 'button':
        componentImports.add('Button')
        break
      case 'input':
      case 'textarea':
        componentImports.add('Input')
        break
      case 'card':
        componentImports.add('Card, CardContent, CardHeader, CardTitle')
        break
      case 'badge':
        componentImports.add('Badge')
        break
      case 'checkbox':
        componentImports.add('Checkbox')
        break
    }
  })

  // Generate component code
  components.forEach(comp => {
    const style = comp.style ? Object.entries(comp.style).map(([k, v]) => 
      `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`
    ).join('; ') : ''

    switch (comp.type) {
      case 'heading':
        const level = comp.props.level || 'h2'
        componentCode.push(`        <${level} style="${style}">
          ${comp.props.text}
        </${level}>`)
        break
        
      case 'paragraph':
        componentCode.push(`        <p style="${style}">
          ${comp.props.text}
        </p>`)
        break
        
      case 'button':
        componentCode.push(`        <Button 
          variant="${comp.props.variant || 'default'}"
          size="${comp.props.size || 'medium'}"
          style="${style}"
        >
          ${comp.props.text}
        </Button>`)
        break
        
      case 'input':
        componentCode.push(`        <Input 
          type="${comp.props.type || 'text'}"
          placeholder="${comp.props.placeholder || ''}"
          style="${style}"
        />`)
        break
        
      case 'textarea':
        componentCode.push(`        <textarea 
          placeholder="${comp.props.placeholder || ''}"
          rows={${comp.props.rows || 4}}
          style="${style}"
        />`)
        break
        
      case 'container':
        componentCode.push(`        <div style="${style}">
          ${comp.props.content || 'Container Content'}
        </div>`)
        break
        
      default:
        componentCode.push(`        <div style="${style}">
          ${comp.type} component
        </div>`)
    }
  })

  return `import React from 'react'
${componentImports.size > 0 ? `import { ${Array.from(componentImports).join(', ')} } from '@/components/ui'` : ''}

export default function ${projectName.replace(/\s+/g, '')}Page() {
  return (
    <div className="min-h-screen bg-background p-8">
${componentCode.join('\n')}
    </div>
  )
}`
}

function generateHTMLCode(components: Component[], projectName: string): string {
  const componentCode: string[] = []

  components.forEach(comp => {
    const style = comp.style ? Object.entries(comp.style).map(([k, v]) => 
      `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`
    ).join('; ') : ''

    switch (comp.type) {
      case 'heading':
        const level = comp.props.level || 'h2'
        componentCode.push(`        <${level} style="${style}">${comp.props.text}</${level}>`)
        break
        
      case 'paragraph':
        componentCode.push(`        <p style="${style}">${comp.props.text}</p>`)
        break
        
      case 'button':
        componentCode.push(`        <button style="${style}" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          ${comp.props.text}
        </button>`)
        break
        
      case 'input':
        componentCode.push(`        <input type="${comp.props.type || 'text'}" placeholder="${comp.props.placeholder || ''}" style="${style}" />`)
        break
        
      case 'textarea':
        componentCode.push(`        <textarea placeholder="${comp.props.placeholder || ''}" rows="${comp.props.rows || 4}" style="${style}"></textarea>`)
        break
        
      default:
        componentCode.push(`        <div style="${style}">${comp.type} component</div>`)
    }
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-8">
${componentCode.join('\n')}
    </div>
</body>
</html>`
}

export async function POST(request: NextRequest) {
  try {
    const body: CodeGenerationRequest = await request.json()
    const { components, projectName, framework } = body

    if (!components || !projectName || !framework) {
      return NextResponse.json(
        { error: 'Components, projectName, and framework are required' },
        { status: 400 }
      )
    }

    let code = ''

    switch (framework) {
      case 'react':
      case 'nextjs':
        code = generateReactCode(components, projectName)
        break
      case 'html':
        code = generateHTMLCode(components, projectName)
        break
      case 'vue':
        // Vue generation would be implemented here
        code = `<!-- Vue component generation not yet implemented -->
<template>
  <div class="min-h-screen bg-background p-8">
    <!-- Vue components would go here -->
  </div>
</template>

<script>
export default {
  name: '${projectName.replace(/\s+/g, '')}'
}
</script>`
        break
      default:
        return NextResponse.json(
          { error: 'Unsupported framework' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      code,
      framework,
      projectName,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    )
  }
}