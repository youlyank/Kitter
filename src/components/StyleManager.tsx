'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Palette, 
  Sun, 
  Moon, 
  Droplets,
  Type,
  Layout,
  Settings,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Save
} from 'lucide-react'

interface ThemeVariable {
  name: string
  value: string
  category: 'colors' | 'typography' | 'spacing' | 'borders' | 'shadows'
  description?: string
}

interface ThemePreset {
  name: string
  description: string
  variables: ThemeVariable[]
  isDefault?: boolean
}

interface StyleManagerProps {
  onThemeChange: (variables: ThemeVariable[]) => void
  currentTheme: ThemeVariable[]
}

const defaultThemeVariables: ThemeVariable[] = [
  // Colors
  { name: '--primary', value: '#3b82f6', category: 'colors', description: 'Primary brand color' },
  { name: '--primary-foreground', value: '#ffffff', category: 'colors', description: 'Primary text color' },
  { name: '--secondary', value: '#6b7280', category: 'colors', description: 'Secondary color' },
  { name: '--secondary-foreground', value: '#ffffff', category: 'colors', description: 'Secondary text color' },
  { name: '--background', value: '#ffffff', category: 'colors', description: 'Background color' },
  { name: '--foreground', value: '#1f2937', category: 'colors', description: 'Main text color' },
  { name: '--muted', value: '#f3f4f6', category: 'colors', description: 'Muted background' },
  { name: '--muted-foreground', value: '#6b7280', category: 'colors', description: 'Muted text' },
  { name: '--accent', value: '#f3f4f6', category: 'colors', description: 'Accent color' },
  { name: '--accent-foreground', value: '#1f2937', category: 'colors', description: 'Accent text' },
  { name: '--destructive', value: '#ef4444', category: 'colors', description: 'Destructive color' },
  { name: '--destructive-foreground', value: '#ffffff', category: 'colors', description: 'Destructive text' },
  { name: '--border', value: '#e5e7eb', category: 'colors', description: 'Border color' },
  { name: '--input', value: '#ffffff', category: 'colors', description: 'Input background' },
  { name: '--ring', value: '#3b82f6', category: 'colors', description: 'Focus ring color' },
  
  // Typography
  { name: '--font-family-sans', value: 'Inter, system-ui, sans-serif', category: 'typography', description: 'Sans serif font' },
  { name: '--font-family-mono', value: 'JetBrains Mono, monospace', category: 'typography', description: 'Monospace font' },
  { name: '--font-size-xs', value: '0.75rem', category: 'typography', description: 'Extra small text' },
  { name: '--font-size-sm', value: '0.875rem', category: 'typography', description: 'Small text' },
  { name: '--font-size-base', value: '1rem', category: 'typography', description: 'Base text size' },
  { name: '--font-size-lg', value: '1.125rem', category: 'typography', description: 'Large text' },
  { name: '--font-size-xl', value: '1.25rem', category: 'typography', description: 'Extra large text' },
  { name: '--font-size-2xl', value: '1.5rem', category: 'typography', description: '2X large text' },
  { name: '--font-size-3xl', value: '1.875rem', category: 'typography', description: '3X large text' },
  { name: '--font-size-4xl', value: '2.25rem', category: 'typography', description: '4X large text' },
  { name: '--line-height-tight', value: '1.25', category: 'typography', description: 'Tight line height' },
  { name: '--line-height-normal', value: '1.5', category: 'typography', description: 'Normal line height' },
  { name: '--line-height-relaxed', value: '1.75', category: 'typography', description: 'Relaxed line height' },
  
  // Spacing
  { name: '--spacing-xs', value: '0.25rem', category: 'spacing', description: 'Extra small spacing' },
  { name: '--spacing-sm', value: '0.5rem', category: 'spacing', description: 'Small spacing' },
  { name: '--spacing-md', value: '1rem', category: 'spacing', description: 'Medium spacing' },
  { name: '--spacing-lg', value: '1.5rem', category: 'spacing', description: 'Large spacing' },
  { name: '--spacing-xl', value: '2rem', category: 'spacing', description: 'Extra large spacing' },
  { name: '--spacing-2xl', value: '3rem', category: 'spacing', description: '2X large spacing' },
  
  // Borders
  { name: '--border-radius-sm', value: '0.125rem', category: 'borders', description: 'Small border radius' },
  { name: '--border-radius-md', value: '0.375rem', category: 'borders', description: 'Medium border radius' },
  { name: '--border-radius-lg', value: '0.5rem', category: 'borders', description: 'Large border radius' },
  { name: '--border-radius-xl', value: '0.75rem', category: 'borders', description: 'Extra large border radius' },
  { name: '--border-width', value: '1px', category: 'borders', description: 'Border width' },
  
  // Shadows
  { name: '--shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', category: 'shadows', description: 'Small shadow' },
  { name: '--shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)', category: 'shadows', description: 'Medium shadow' },
  { name: '--shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)', category: 'shadows', description: 'Large shadow' },
  { name: '--shadow-xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)', category: 'shadows', description: 'Extra large shadow' }
]

const themePresets: ThemePreset[] = [
  {
    name: 'Default',
    description: 'Clean and modern default theme',
    variables: defaultThemeVariables,
    isDefault: true
  },
  {
    name: 'Dark Mode',
    description: 'Dark theme for low-light environments',
    variables: defaultThemeVariables.map(v => {
      if (v.name === '--background') return { ...v, value: '#0f172a' }
      if (v.name === '--foreground') return { ...v, value: '#f8fafc' }
      if (v.name === '--muted') return { ...v, value: '#1e293b' }
      if (v.name === '--muted-foreground') return { ...v, value: '#94a3b8' }
      if (v.name === '--border') return { ...v, value: '#334155' }
      if (v.name === '--input') return { ...v, value: '#1e293b' }
      return v
    })
  },
  {
    name: 'Ocean',
    description: 'Calming blue ocean theme',
    variables: defaultThemeVariables.map(v => {
      if (v.name === '--primary') return { ...v, value: '#0891b2' }
      if (v.name === '--secondary') return { ...v, value: '#0e7490' }
      if (v.name === '--accent') return { ...v, value: '#e0f2fe' }
      return v
    })
  },
  {
    name: 'Forest',
    description: 'Natural green forest theme',
    variables: defaultThemeVariables.map(v => {
      if (v.name === '--primary') return { ...v, value: '#059669' }
      if (v.name === '--secondary') return { ...v, value: '#047857' }
      if (v.name === '--accent') return { ...v, value: '#d1fae5' }
      return v
    })
  },
  {
    name: 'Sunset',
    description: 'Warm orange sunset theme',
    variables: defaultThemeVariables.map(v => {
      if (v.name === '--primary') return { ...v, value: '#ea580c' }
      if (v.name === '--secondary') return { ...v, value: '#c2410c' }
      if (v.name === '--accent') return { ...v, value: '#fed7aa' }
      return v
    })
  }
]

export function StyleManager({ onThemeChange, currentTheme }: StyleManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('colors')
  const [themeVariables, setThemeVariables] = useState<ThemeVariable[]>(currentTheme)
  const [selectedPreset, setSelectedPreset] = useState<string>('Default')

  const categories = ['colors', 'typography', 'spacing', 'borders', 'shadows']
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'colors': return <Palette className="w-4 h-4" />
      case 'typography': return <Type className="w-4 h-4" />
      case 'spacing': return <Layout className="w-4 h-4" />
      case 'borders': return <div className="w-4 h-4 border-2 border-gray-400 rounded" />
      case 'shadows': return <div className="w-4 h-4 bg-gray-300 rounded shadow-md" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const updateVariable = (name: string, value: string) => {
    const updatedVariables = themeVariables.map(v => 
      v.name === name ? { ...v, value } : v
    )
    setThemeVariables(updatedVariables)
    onThemeChange(updatedVariables)
  }

  const applyPreset = (preset: ThemePreset) => {
    setThemeVariables(preset.variables)
    setSelectedPreset(preset.name)
    onThemeChange(preset.variables)
  }

  const exportTheme = () => {
    const themeData = {
      name: 'Custom Theme',
      variables: themeVariables,
      timestamp: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(themeData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'custom-theme.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string)
        if (themeData.variables && Array.isArray(themeData.variables)) {
          setThemeVariables(themeData.variables)
          onThemeChange(themeData.variables)
        }
      } catch (error) {
        console.error('Error importing theme:', error)
      }
    }
    reader.readAsText(file)
  }

  const resetToDefault = () => {
    const defaultVars = defaultThemeVariables
    setThemeVariables(defaultVars)
    setSelectedPreset('Default')
    onThemeChange(defaultVars)
  }

  const filteredVariables = themeVariables.filter(v => v.category === activeCategory)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Themes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Theme & Style Manager</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[800px]">
          {/* Presets */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Theme Presets</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetToDefault}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={exportTheme}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <label className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={importTheme}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {themePresets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={selectedPreset === preset.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyPreset(preset)}
                  className="h-auto p-3 flex flex-col items-start"
                >
                  <div className="font-medium text-sm mb-1">{preset.name}</div>
                  <div className="text-xs text-muted-foreground text-left">
                    {preset.description}
                  </div>
                  {preset.isDefault && (
                    <Badge variant="secondary" className="text-xs mt-2">
                      Default
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Category Sidebar */}
            <div className="w-48 border-r p-4">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className="w-full justify-start"
                  >
                    {getCategoryIcon(category)}
                    <span className="ml-2 capitalize">{category}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Variables Editor */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium capitalize">{activeCategory} Variables</h3>
                <Badge variant="outline">
                  {filteredVariables.length} variables
                </Badge>
              </div>
              
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredVariables.map((variable) => (
                    <Card key={variable.name}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <Label className="font-mono text-sm">{variable.name}</Label>
                            {variable.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {variable.description}
                              </p>
                            )}
                          </div>
                          {variable.category === 'colors' && (
                            <div
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: variable.value }}
                            />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {variable.category === 'colors' ? (
                            <Input
                              type="color"
                              value={variable.value}
                              onChange={(e) => updateVariable(variable.name, e.target.value)}
                              className="w-16 h-8 p-1"
                            />
                          ) : null}
                          
                          <Input
                            value={variable.value}
                            onChange={(e) => updateVariable(variable.name, e.target.value)}
                            placeholder="Enter value..."
                            className="flex-1"
                          />
                          
                          {variable.category === 'colors' && (
                            <Input
                              value={variable.value}
                              onChange={(e) => updateVariable(variable.name, e.target.value)}
                              placeholder="#000000"
                              className="w-24"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}