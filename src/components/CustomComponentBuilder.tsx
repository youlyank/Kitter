'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  Save, 
  FolderOpen,
  Star,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Eye,
  Cube,
  Package,
  Zap
} from 'lucide-react'
import { Component } from '@/types/component'

interface CustomComponentData {
  id: string
  name: string
  description: string
  category: string
  components: Component[]
  props: Record<string, any>
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  author?: string
  tags: string[]
}

interface CustomComponentBuilderProps {
  selectedComponents: Component[]
  onSaveComponent: (component: CustomComponentData) => void
  onLoadComponent: (component: CustomComponentData) => void
}

export function CustomComponentBuilder({ 
  selectedComponents, 
  onSaveComponent, 
  onLoadComponent 
}: CustomComponentBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create')
  const [customComponents, setCustomComponents] = useState<CustomComponentData[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Custom',
    isPublic: false,
    tags: [] as string[]
  })

  const categories = ['Custom', 'Layout', 'Form', 'Navigation', 'Media', 'Content', 'Interactive']

  const fetchCustomComponents = async () => {
    try {
      const response = await fetch('/api/custom-components')
      if (response.ok) {
        const components = await response.json()
        setCustomComponents(components)
      }
    } catch (error) {
      console.error('Error fetching custom components:', error)
    }
  }

  const handleSaveComponent = async () => {
    if (!formData.name.trim() || selectedComponents.length === 0) {
      return
    }

    try {
      const response = await fetch('/api/custom-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          components: selectedComponents,
          props: {},
          isPublic: formData.isPublic,
          tags: formData.tags
        })
      })

      if (response.ok) {
        const savedComponent = await response.json()
        onSaveComponent(savedComponent)
        setFormData({ name: '', description: '', category: 'Custom', isPublic: false, tags: [] })
        setActiveTab('library')
        fetchCustomComponents()
      }
    } catch (error) {
      console.error('Error saving custom component:', error)
    }
  }

  const handleLoadComponent = (component: CustomComponentData) => {
    onLoadComponent(component)
    setIsOpen(false)
  }

  const handleDeleteComponent = async (componentId: string) => {
    try {
      const response = await fetch(`/api/custom-components?id=${componentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCustomComponents(customComponents.filter(comp => comp.id !== componentId))
      }
    } catch (error) {
      console.error('Error deleting custom component:', error)
    }
  }

  const handleDuplicateComponent = async (component: CustomComponentData) => {
    try {
      const response = await fetch('/api/custom-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${component.name} (Copy)`,
          description: component.description,
          category: component.category,
          components: component.components,
          props: component.props,
          isPublic: false,
          tags: component.tags
        })
      })

      if (response.ok) {
        fetchCustomComponents()
      }
    } catch (error) {
      console.error('Error duplicating custom component:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Cube className="w-4 h-4 mr-2" />
          Custom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Custom Components</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[800px]">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('create')}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Component
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'library'
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                setActiveTab('library')
                fetchCustomComponents()
              }}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Component Library
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'create' ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="componentName">Component Name *</Label>
                      <Input
                        id="componentName"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="My Custom Component"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe what this component does..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPublic"
                        checked={formData.isPublic}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPublic: !!checked })}
                      />
                      <Label htmlFor="isPublic">Make this component public</Label>
                    </div>
                  </div>

                  {/* Right Column - Preview */}
                  <div>
                    <Label>Selected Components ({selectedComponents.length})</Label>
                    <div className="mt-2 border rounded-lg p-4 bg-gray-50 min-h-[200px]">
                      {selectedComponents.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Select components on the canvas to create a custom component</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedComponents.map((comp, index) => (
                            <div key={comp.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                              <span className="text-sm font-medium">{index + 1}.</span>
                              <Badge variant="outline" className="text-xs">
                                {comp.type}
                              </Badge>
                              <span className="text-sm text-gray-600 truncate">
                                {comp.props.text || comp.props.title || comp.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveComponent}
                    disabled={!formData.name.trim() || selectedComponents.length === 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Component
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <ScrollArea className="h-[600px]">
                  {customComponents.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Custom Components</h3>
                      <p>Create your first custom component to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {customComponents.map((component) => (
                        <Card key={component.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base mb-1">{component.name}</CardTitle>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {component.category}
                                  </Badge>
                                  {component.isPublic && (
                                    <Badge variant="outline" className="text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      Public
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDuplicateComponent(component)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500"
                                  onClick={() => handleDeleteComponent(component.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {component.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {component.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Zap className="w-3 h-3" />
                              <span>{component.components.length} components</span>
                              <span>•</span>
                              <span>{new Date(component.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {component.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {component.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleLoadComponent(component)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Use
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}