'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Save, 
  Download, 
  Upload, 
  Play, 
  Settings, 
  FileText,
  Code,
  Eye,
  EyeOff,
  Smartphone,
  Tablet,
  Monitor,
  Undo,
  Redo,
  Copy,
  Trash2
} from 'lucide-react'
import { Component } from '@/types/component'
import { ProjectManager } from './ProjectManager'
import { TemplateGallery } from './TemplateGallery'
import { StyleManager } from './StyleManager'
import { FormBuilder } from './FormBuilder'

interface HeaderProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  components: Component[]
  onLoadProject: (project: any) => void
  onLoadTemplate: (components: Component[]) => void
  onThemeChange: (variables: any[]) => void
  onAddForm: (fields: any[]) => void
}

export function Header({ projectName, onProjectNameChange, components, onLoadProject, onLoadTemplate, onThemeChange, onAddForm }: HeaderProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const handleSave = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          components
        })
      })

      if (response.ok) {
        const project = await response.json()
        console.log('Project saved!', project)
        // You could show a toast notification here
      } else {
        console.error('Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleExport = () => {
    const projectData = {
      name: projectName,
      components,
      timestamp: new Date().toISOString()
    }
    const dataStr = JSON.stringify(projectData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${projectName.replace(/\s+/g, '-').toLowerCase()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleGenerateCode = async () => {
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          components,
          projectName,
          framework: 'nextjs'
        })
      })

      if (response.ok) {
        const { code } = await response.json()
        
        // Create a blob with the code and download it
        const blob = new Blob([code], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.jsx`
        a.click()
        URL.revokeObjectURL(url)
        
        console.log('Code generated successfully!')
      } else {
        console.error('Failed to generate code')
      }
    } catch (error) {
      console.error('Error generating code:', error)
    }
  }

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
    }
  }

  return (
    <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section - Project Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Code className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ZeroCode Builder</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="w-64 h-8"
              placeholder="Project name"
            />
          </div>
        </div>

        {/* Center Section - Viewport Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewport === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewport('desktop')}
              className="h-7 px-3"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewport === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewport('tablet')}
              className="h-7 px-3"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewport === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewport('mobile')}
              className="h-7 px-3"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <Button
            variant={isPreview ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8"
          >
            {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <FormBuilder onAddForm={onAddForm} />
          
          <StyleManager onThemeChange={onThemeChange} currentTheme={[]} />
          
          <TemplateGallery onLoadTemplate={onLoadTemplate} />
          
          <ProjectManager 
            onLoadProject={onLoadProject}
            currentComponents={components}
          />
          
          <Button variant="outline" size="sm" onClick={handleSave} className="h-8">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport} className="h-8">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleGenerateCode} className="h-8">
            <Code className="w-4 h-4 mr-2" />
            Generate Code
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          <Button variant="ghost" size="sm" className="h-8">
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8">
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}