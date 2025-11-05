'use client'

import { useDrop } from 'react-dnd'
import { Component } from '@/types/component'
import { RenderedComponent } from './RenderedComponent'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Eye, EyeOff, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useState } from 'react'

interface CanvasProps {
  components: Component[]
  onDrop: (item: any, position: { x: number; y: number }, parentId?: string) => void
  onSelectComponent: (component: Component | null) => void
  selectedComponentId: string | null
  onUpdateComponent: (id: string, updates: Partial<Component>) => void
  onDeleteComponent: (id: string) => void
}

export function Canvas({
  components,
  onDrop,
  onSelectComponent,
  selectedComponentId,
  onUpdateComponent,
  onDeleteComponent
}: CanvasProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    drop: (item: any, monitor) => {
      const offset = monitor.getSourceClientOffset()
      if (offset) {
        onDrop(item, { x: offset.x, y: offset.y })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectComponent(null)
    }
  }

  return (
    <div className="h-full relative">
      {/* Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Card className="p-2 flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Grid
          </Button>
        </Card>
        
        {/* Responsive Breakpoints */}
        <Card className="p-2 flex gap-2">
          <Button 
            variant={viewport === 'desktop' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewport('desktop')}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button 
            variant={viewport === 'tablet' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewport('tablet')}
          >
            <Tablet className="w-4 h-4 mr-1" />
            Tablet
          </Button>
          <Button 
            variant={viewport === 'mobile' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewport('mobile')}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </Card>
      </div>

      {/* Canvas Area */}
      <div
        ref={drop}
        className={`h-full relative overflow-auto bg-white ${
          isOver && canDrop ? 'bg-blue-50' : ''
        }`}
        onClick={handleCanvasClick}
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, .02) 25%, rgba(0, 0, 0, .02) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .02) 75%, rgba(0, 0, 0, .02) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, .02) 25%, rgba(0, 0, 0, .02) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .02) 75%, rgba(0, 0, 0, .02) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Drop Zone Indicator */}
        {isOver && canDrop && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none flex items-center justify-center">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Drop component here
            </div>
          </div>
        )}

        {/* Render Components */}
        <div className="relative min-h-full p-8 flex justify-center">
          {/* Responsive Container */}
          <div 
            className={`transition-all duration-300 ${
              viewport === 'mobile' ? 'w-full max-w-sm' :
              viewport === 'tablet' ? 'w-full max-w-2xl' :
              'w-full max-w-6xl'
            }`}
          >
            {components.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 text-muted-foreground border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">Start Building</h3>
                <p className="text-center max-w-md">
                  Drag components from the palette on the left to start creating your page.
                  Click on components to select and edit their properties.
                </p>
              </div>
            )}

            {components.map((component) => (
              <RenderedComponent
                key={component.id}
                component={component}
                isSelected={selectedComponentId === component.id}
                onSelect={() => onSelectComponent(component)}
                onUpdate={(updates) => onUpdateComponent(component.id, updates)}
                onDelete={() => onDeleteComponent(component.id)}
                viewport={viewport}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}