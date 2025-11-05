'use client'

import { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Component } from '@/types/component'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { 
  GripVertical, 
  Trash2, 
  Copy,
  MoreHorizontal,
  Type,
  Square,
  Image as ImageIcon,
  MousePointer,
  Square as InputIcon,
  CheckSquare,
  User,
  Video,
  MessageSquare,
  FileText,
  Grid,
  Menu,
  List,
  BarChart,
  Tabs,
  Star
} from 'lucide-react'

interface RenderedComponentProps {
  component: Component
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<Component>) => void
  onDelete: () => void
}

export function RenderedComponent({
  component,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}: RenderedComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const [{ isDragActive }, drag] = useDrag({
    type: 'move-component',
    item: { id: component.id, type: 'move-component' },
    collect: (monitor) => ({
      isDragActive: monitor.isDragging(),
    }),
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true)
      setDragStart({
        x: e.clientX - component.position.x,
        y: e.clientY - component.position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      onUpdate({
        position: { x: newX, y: newY }
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const renderComponentContent = () => {
    const { type, props } = component

    switch (type) {
      case 'heading':
        const level = props.level || 'h2'
        const HeadingTag = level as keyof JSX.IntrinsicElements
        return (
          <HeadingTag
            style={{
              fontSize: props.fontSize,
              fontWeight: props.fontWeight,
              color: props.color,
              ...component.style
            }}
          >
            {props.text}
          </HeadingTag>
        )

      case 'paragraph':
        return (
          <p
            style={{
              fontSize: props.fontSize,
              color: props.color,
              lineHeight: props.lineHeight,
              ...component.style
            }}
          >
            {props.text}
          </p>
        )

      case 'text':
        return (
          <span
            style={{
              fontSize: props.fontSize,
              color: props.color,
              ...component.style
            }}
          >
            {props.text}
          </span>
        )

      case 'button':
        return (
          <Button
            variant={props.variant}
            size={props.size}
            style={component.style}
            onClick={() => console.log('Button clicked')}
          >
            {props.text}
          </Button>
        )

      case 'input':
        return (
          <Input
            type={props.type}
            placeholder={props.placeholder}
            style={component.style}
          />
        )

      case 'textarea':
        return (
          <Textarea
            placeholder={props.placeholder}
            rows={props.rows}
            style={component.style}
          />
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox checked={props.checked} />
            <label>{props.label}</label>
          </div>
        )

      case 'container':
        return (
          <div
            style={{
              width: props.width,
              padding: props.padding,
              backgroundColor: props.backgroundColor,
              border: props.border,
              borderRadius: props.borderRadius,
              ...component.style
            }}
          >
            Container
          </div>
        )

      case 'card':
        return (
          <Card style={component.style}>
            {props.title && (
              <CardHeader>
                <CardTitle>{props.title}</CardTitle>
              </CardHeader>
            )}
            <CardContent>
              {props.content}
            </CardContent>
          </Card>
        )

      case 'badge':
        return (
          <Badge variant={props.variant} style={component.style}>
            {props.text}
          </Badge>
        )

      case 'image':
        return (
          <div
            style={{
              width: props.width,
              height: props.height,
              ...component.style
            }}
            className="border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
          >
            <div className="text-center">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Image</p>
            </div>
          </div>
        )

      case 'video':
        return (
          <div
            style={{
              width: props.width,
              height: props.height,
              ...component.style
            }}
            className="border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
          >
            <div className="text-center">
              <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">Video</p>
            </div>
          </div>
        )

      case 'list':
        return (
          <div style={component.style}>
            {props.ordered ? (
              <ol>
                {props.items?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul>
                {props.items?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        )

      case 'grid':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
              gap: props.gap,
              ...component.style
            }}
          >
            <div className="p-4 border rounded">Grid Item 1</div>
            <div className="p-4 border rounded">Grid Item 2</div>
            <div className="p-4 border rounded">Grid Item 3</div>
            <div className="p-4 border rounded">Grid Item 4</div>
          </div>
        )

      case 'flex':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: props.direction,
              gap: props.gap,
              alignItems: props.alignItems,
              ...component.style
            }}
          >
            <div className="p-2 border rounded">Flex 1</div>
            <div className="p-2 border rounded">Flex 2</div>
            <div className="p-2 border rounded">Flex 3</div>
          </div>
        )

      default:
        return (
          <div
            style={component.style}
            className="p-4 border-2 border-dashed border-gray-300 rounded"
          >
            <div className="flex items-center gap-2 text-gray-500">
              <Square className="w-4 h-4" />
              <span>{component.type}</span>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={`absolute ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} ${
        isDragActive ? 'opacity-50' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Component Controls */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex gap-1 bg-white border rounded shadow-lg p-1 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              // Handle copy
            }}
          >
            <Copy className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
          <div className="w-px bg-gray-200 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab"
            onMouseDown={handleMouseDown}
          >
            <GripVertical className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Component Content */}
      {renderComponentContent()}
    </div>
  )
}