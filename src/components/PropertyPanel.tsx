'use client'

import { Component } from '@/types/component'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Trash2, 
  Copy,
  Palette,
  Type,
  Layout,
  Move,
  Eye,
  EyeOff
} from 'lucide-react'

interface PropertyPanelProps {
  component: Component | null
  onUpdateComponent: (id: string, updates: Partial<Component>) => void
  onDeleteComponent: (id: string) => void
}

export function PropertyPanel({
  component,
  onUpdateComponent,
  onDeleteComponent
}: PropertyPanelProps) {
  if (!component) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Properties</h2>
          <p className="text-sm text-muted-foreground">Select a component to edit</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No component selected</p>
            <p className="text-sm">Click on a component to edit its properties</p>
          </div>
        </div>
      </div>
    )
  }

  const updateProp = (key: string, value: any) => {
    onUpdateComponent(component.id, {
      props: {
        ...component.props,
        [key]: value
      }
    })
  }

  const updateStyle = (key: string, value: any) => {
    onUpdateComponent(component.id, {
      style: {
        ...component.style,
        [key]: value
      }
    })
  }

  const renderTextProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text">Text Content</Label>
        <Textarea
          id="text"
          value={component.props.text || ''}
          onChange={(e) => updateProp('text', e.target.value)}
          placeholder="Enter text content"
        />
      </div>
      
      {component.type === 'heading' && (
        <div>
          <Label htmlFor="level">Heading Level</Label>
          <Select value={component.props.level || 'h2'} onValueChange={(value) => updateProp('level', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h1">H1</SelectItem>
              <SelectItem value="h2">H2</SelectItem>
              <SelectItem value="h3">H3</SelectItem>
              <SelectItem value="h4">H4</SelectItem>
              <SelectItem value="h5">H5</SelectItem>
              <SelectItem value="h6">H6</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <Label htmlFor="fontSize">Font Size</Label>
        <Input
          id="fontSize"
          value={component.props.fontSize || ''}
          onChange={(e) => updateProp('fontSize', e.target.value)}
          placeholder="e.g., 16px, 1rem"
        />
      </div>
      
      <div>
        <Label htmlFor="color">Text Color</Label>
        <Input
          id="color"
          type="color"
          value={component.props.color || '#000000'}
          onChange={(e) => updateProp('color', e.target.value)}
        />
      </div>
    </div>
  )

  const renderInputProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="placeholder">Placeholder</Label>
        <Input
          id="placeholder"
          value={component.props.placeholder || ''}
          onChange={(e) => updateProp('placeholder', e.target.value)}
          placeholder="Enter placeholder text"
        />
      </div>
      
      {component.type === 'input' && (
        <div>
          <Label htmlFor="inputType">Input Type</Label>
          <Select value={component.props.type || 'text'} onValueChange={(value) => updateProp('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="password">Password</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="tel">Phone</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {component.type === 'textarea' && (
        <div>
          <Label htmlFor="rows">Rows</Label>
          <Input
            id="rows"
            type="number"
            value={component.props.rows || 4}
            onChange={(e) => updateProp('rows', parseInt(e.target.value))}
            min="1"
            max="20"
          />
        </div>
      )}
    </div>
  )

  const renderButtonProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={component.props.text || ''}
          onChange={(e) => updateProp('text', e.target.value)}
          placeholder="Enter button text"
        />
      </div>
      
      <div>
        <Label htmlFor="variant">Variant</Label>
        <Select value={component.props.variant || 'default'} onValueChange={(value) => updateProp('variant', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="size">Size</Label>
        <Select value={component.props.size || 'medium'} onValueChange={(value) => updateProp('size', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderLayoutProperties = () => (
    <div className="space-y-4">
      {component.type === 'container' && (
        <>
          <div>
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              value={component.props.width || ''}
              onChange={(e) => updateProp('width', e.target.value)}
              placeholder="e.g., 100%, 300px"
            />
          </div>
          
          <div>
            <Label htmlFor="padding">Padding</Label>
            <Input
              id="padding"
              value={component.props.padding || ''}
              onChange={(e) => updateProp('padding', e.target.value)}
              placeholder="e.g., 16px, 1rem"
            />
          </div>
          
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={component.props.backgroundColor || '#ffffff'}
              onChange={(e) => updateProp('backgroundColor', e.target.value)}
            />
          </div>
        </>
      )}
      
      {component.type === 'grid' && (
        <>
          <div>
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              type="number"
              value={component.props.columns || 2}
              onChange={(e) => updateProp('columns', parseInt(e.target.value))}
              min="1"
              max="12"
            />
          </div>
          
          <div>
            <Label htmlFor="gap">Gap</Label>
            <Input
              id="gap"
              value={component.props.gap || ''}
              onChange={(e) => updateProp('gap', e.target.value)}
              placeholder="e.g., 16px, 1rem"
            />
          </div>
        </>
      )}
      
      {component.type === 'flex' && (
        <>
          <div>
            <Label htmlFor="direction">Direction</Label>
            <Select value={component.props.direction || 'row'} onValueChange={(value) => updateProp('direction', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">Row</SelectItem>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="row-reverse">Row Reverse</SelectItem>
                <SelectItem value="column-reverse">Column Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="alignItems">Align Items</Label>
            <Select value={component.props.alignItems || 'center'} onValueChange={(value) => updateProp('alignItems', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="gap">Gap</Label>
            <Input
              id="gap"
              value={component.props.gap || ''}
              onChange={(e) => updateProp('gap', e.target.value)}
              placeholder="e.g., 16px, 1rem"
            />
          </div>
        </>
      )}
    </div>
  )

  const renderCommonProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="margin">Margin</Label>
        <Input
          id="margin"
          value={component.style?.margin || ''}
          onChange={(e) => updateStyle('margin', e.target.value)}
          placeholder="e.g., 16px, 1rem"
        />
      </div>
      
      <div>
        <Label htmlFor="border">Border</Label>
        <Input
          id="border"
          value={component.style?.border || ''}
          onChange={(e) => updateStyle('border', e.target.value)}
          placeholder="e.g., 1px solid #ccc"
        />
      </div>
      
      <div>
        <Label htmlFor="borderRadius">Border Radius</Label>
        <Input
          id="borderRadius"
          value={component.style?.borderRadius || ''}
          onChange={(e) => updateStyle('borderRadius', e.target.value)}
          placeholder="e.g., 8px, 0.5rem"
        />
      </div>
      
      <div>
        <Label htmlFor="opacity">Opacity</Label>
        <Slider
          value={[component.style?.opacity ? component.style.opacity * 100 : 100]}
          onValueChange={([value]) => updateStyle('opacity', value / 100)}
          max={100}
          step={1}
          className="mt-2"
        />
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Properties</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={() => onDeleteComponent(component.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {component.type}
          </Badge>
          <span className="text-sm text-muted-foreground">ID: {component.id}</span>
        </div>
      </div>

      {/* Properties Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Position */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Move className="w-4 h-4" />
              <h3 className="font-medium">Position</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="posX">X Position</Label>
                <Input
                  id="posX"
                  type="number"
                  value={component.position.x}
                  onChange={(e) => onUpdateComponent(component.id, {
                    position: { ...component.position, x: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="posY">Y Position</Label>
                <Input
                  id="posY"
                  type="number"
                  value={component.position.y}
                  onChange={(e) => onUpdateComponent(component.id, {
                    position: { ...component.position, y: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Component Specific Properties */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4" />
              <h3 className="font-medium">Component Properties</h3>
            </div>
            
            {(component.type === 'heading' || component.type === 'paragraph' || component.type === 'text') && renderTextProperties()}
            {(component.type === 'input' || component.type === 'textarea') && renderInputProperties()}
            {component.type === 'button' && renderButtonProperties()}
            {(component.type === 'container' || component.type === 'grid' || component.type === 'flex') && renderLayoutProperties()}
          </div>

          <Separator />

          {/* Common Style Properties */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4" />
              <h3 className="font-medium">Style</h3>
            </div>
            {renderCommonProperties()}
          </div>

          <Separator />

          {/* Animation Properties */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4" />
              <h3 className="font-medium">Animation</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="animation">Animation Type</Label>
                <Select 
                  value={component.style?.animation || 'none'} 
                  onValueChange={(value) => updateStyle('animation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="fadeIn">Fade In</SelectItem>
                    <SelectItem value="slideInLeft">Slide In Left</SelectItem>
                    <SelectItem value="slideInRight">Slide In Right</SelectItem>
                    <SelectItem value="slideInUp">Slide In Up</SelectItem>
                    <SelectItem value="slideInDown">Slide In Down</SelectItem>
                    <SelectItem value="zoomIn">Zoom In</SelectItem>
                    <SelectItem value="bounce">Bounce</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="shake">Shake</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={component.style?.animationDuration ? parseFloat(component.style.animationDuration) : 0.3}
                  onChange={(e) => updateStyle('animationDuration', `${e.target.value}s`)}
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>
              
              <div>
                <Label htmlFor="delay">Delay (seconds)</Label>
                <Input
                  id="delay"
                  type="number"
                  value={component.style?.animationDelay ? parseFloat(component.style.animationDelay) : 0}
                  onChange={(e) => updateStyle('animationDelay', `${e.target.value}s`)}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              
              <div>
                <Label htmlFor="iteration">Iteration</Label>
                <Select 
                  value={component.style?.animationIterationCount || '1'} 
                  onValueChange={(value) => updateStyle('animationIterationCount', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Once</SelectItem>
                    <SelectItem value="2">2 Times</SelectItem>
                    <SelectItem value="3">3 Times</SelectItem>
                    <SelectItem value="infinite">Infinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}