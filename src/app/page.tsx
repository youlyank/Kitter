'use client'

import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ComponentPalette } from '@/components/ComponentPalette'
import { AIAssistant } from '@/components/AIAssistant'
import { CustomComponentBuilder } from '@/components/CustomComponentBuilder'
import { Canvas } from '@/components/Canvas'
import { PropertyPanel } from '@/components/PropertyPanel'
import { Header } from '@/components/Header'
import { ProjectManager } from '@/components/ProjectManager'
import { Component, Project } from '@/types/component'

export default function Home() {
  const [components, setComponents] = useState<Component[]>([])
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
  const [projectName, setProjectName] = useState('Untitled Project')
  const [activeTab, setActiveTab] = useState<'components' | 'ai' | 'custom'>('components')

  const handleDrop = (item: any, position: { x: number; y: number }, parentId?: string) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type: item.type,
      props: { ...item.defaultProps },
      position,
      children: [],
      parentId,
      isContainer: ['container', 'card', 'grid', 'flex'].includes(item.type)
    }
    
    if (parentId) {
      // Add as child of parent component
      setComponents(components.map(comp => 
        comp.id === parentId 
          ? { ...comp, children: [...comp.children, newComponent] }
          : comp
      ))
    } else {
      // Add to root level
      setComponents([...components, newComponent])
    }
    
    setSelectedComponent(newComponent)
  }

  const handleUpdateComponent = (id: string, updates: Partial<Component>) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ))
    if (selectedComponent?.id === id) {
      setSelectedComponent({ ...selectedComponent, ...updates })
    }
  }

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id))
    if (selectedComponent?.id === id) {
      setSelectedComponent(null)
    }
  }

  const handleLoadProject = (project: Project) => {
    setComponents(project.components)
    setProjectName(project.name)
    setSelectedComponent(null)
  }

  const handleLoadTemplate = (templateComponents: Component[]) => {
    setComponents(templateComponents)
    setSelectedComponent(null)
  }

  const handleAddAIComponent = (suggestion: any) => {
    const newComponent: Component = {
      id: Date.now().toString(),
      type: suggestion.type,
      props: suggestion.props,
      position: { x: 100, y: 100 },
      children: []
    }
    setComponents([...components, newComponent])
    setSelectedComponent(newComponent)
  }

  const handleSaveCustomComponent = (customComponent: any) => {
    console.log('Custom component saved:', customComponent)
  }

  const handleLoadCustomComponent = (customComponent: any) => {
    const newComponents = customComponent.components.map((comp: Component) => ({
      ...comp,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }))
    setComponents([...components, ...newComponents])
  }

  const handleThemeChange = (variables: any[]) => {
    // Apply CSS variables to the document
    variables.forEach((variable: any) => {
      document.documentElement.style.setProperty(variable.name, variable.value)
    })
  }

  const handleAddForm = (fields: any[]) => {
    // Convert form fields to components and add to canvas
    const formComponents = fields.map((field, index) => ({
      id: Date.now().toString() + index,
      type: field.type === 'textarea' ? 'textarea' : 'input',
      props: {
        type: field.type,
        placeholder: field.placeholder || field.label,
        label: field.label,
        required: field.required
      },
      position: { x: 100, y: 100 + (index * 60) },
      children: []
    }))
    
    setComponents([...components, ...formComponents])
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        <Header 
          projectName={projectName}
          onProjectNameChange={setProjectName}
          components={components}
          onLoadProject={handleLoadProject}
          onLoadTemplate={handleLoadTemplate}
          onThemeChange={handleThemeChange}
          onAddForm={handleAddForm}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar with Tabs */}
          <div className="w-80 border-r bg-card flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'components'
                    ? 'bg-background text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('components')}
              >
                Components
              </button>
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'ai'
                    ? 'bg-background text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                AI Assistant
              </button>
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'custom'
                    ? 'bg-background text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('custom')}
              >
                Custom
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {activeTab === 'components' ? (
                <ComponentPalette />
              ) : activeTab === 'ai' ? (
                <AIAssistant 
                  components={components}
                  onAddComponent={handleAddAIComponent}
                />
              ) : (
                <CustomComponentBuilder 
                  selectedComponents={selectedComponents}
                  onSaveComponent={handleSaveCustomComponent}
                  onLoadComponent={handleLoadCustomComponent}
                />
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-muted/30">
            <Canvas
              components={components}
              onDrop={handleDrop}
              onSelectComponent={setSelectedComponent}
              selectedComponentId={selectedComponent?.id}
              onUpdateComponent={handleUpdateComponent}
              onDeleteComponent={handleDeleteComponent}
            />
          </div>

          {/* Property Panel */}
          <div className="w-80 border-l bg-card">
            <PropertyPanel
              component={selectedComponent}
              onUpdateComponent={handleUpdateComponent}
              onDeleteComponent={handleDeleteComponent}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  )
}