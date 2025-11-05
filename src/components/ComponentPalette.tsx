'use client'

import { useDrag } from 'react-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ComponentTemplate } from '@/types/component'
import { 
  Type, 
  Square, 
  Grid,
  Menu,
  Search,
  FileText,
  Plus,
  ChevronDown,
  Image as ImageIcon,
  MousePointer,
  Square as InputIcon,
  CheckSquare,
  User,
  Video,
  Music,
  MessageSquare,
  Download,
  Settings,
  Home,
  Calendar,
  Star,
  Heart,
  Share,
  Lock,
  Eye,
  Edit,
  Trash,
  Minus,
  ArrowUp,
  List,
  BarChart,
  RectangleHorizontal
} from 'lucide-react'

const componentTemplates: ComponentTemplate[] = [
  // Layout Components
  {
    type: 'container',
    name: 'Container',
    icon: 'Square',
    defaultProps: { width: '100%', padding: '16px', backgroundColor: '#f8f9fa' },
    category: 'Layout'
  },
  {
    type: 'grid',
    name: 'Grid',
    icon: 'Grid',
    defaultProps: { columns: 2, gap: '16px' },
    category: 'Layout'
  },
  {
    type: 'flex',
    name: 'Flex Container',
    icon: 'Menu',
    defaultProps: { direction: 'row', gap: '16px', alignItems: 'center' },
    category: 'Layout'
  },
  
  // Text Components
  {
    type: 'heading',
    name: 'Heading',
    icon: 'Type',
    defaultProps: { text: 'Heading', level: 'h2', fontSize: '24px', fontWeight: 'bold' },
    category: 'Text'
  },
  {
    type: 'paragraph',
    name: 'Paragraph',
    icon: 'FileText',
    defaultProps: { text: 'This is a paragraph of text.', fontSize: '16px' },
    category: 'Text'
  },
  {
    type: 'text',
    name: 'Text',
    icon: 'Type',
    defaultProps: { text: 'Text content', fontSize: '14px' },
    category: 'Text'
  },
  
  // Input Components
  {
    type: 'input',
    name: 'Input Field',
    icon: 'InputIcon',
    defaultProps: { placeholder: 'Enter text...', type: 'text' },
    category: 'Input'
  },
  {
    type: 'textarea',
    name: 'Textarea',
    icon: 'FileText',
    defaultProps: { placeholder: 'Enter multiple lines...', rows: 4 },
    category: 'Input'
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    icon: 'CheckSquare',
    defaultProps: { label: 'Check me', checked: false },
    category: 'Input'
  },
  {
    type: 'button',
    name: 'Button',
    icon: 'MousePointer',
    defaultProps: { text: 'Click me', variant: 'default', size: 'medium' },
    category: 'Button'
  },
  
  // Media Components
  {
    type: 'image',
    name: 'Image',
    icon: 'ImageIcon',
    defaultProps: { src: '/placeholder.jpg', alt: 'Image', width: '200px', height: '150px' },
    category: 'Media'
  },
  {
    type: 'video',
    name: 'Video',
    icon: 'Video',
    defaultProps: { src: '', controls: true, width: '400px', height: '300px' },
    category: 'Media'
  },
  
  // Display Components
  {
    type: 'card',
    name: 'Card',
    icon: 'Square',
    defaultProps: { title: 'Card Title', content: 'Card content', padding: '16px' },
    category: 'Display'
  },
  {
    type: 'badge',
    name: 'Badge',
    icon: 'Star',
    defaultProps: { text: 'Badge', variant: 'default' },
    category: 'Display'
  },
  {
    type: 'avatar',
    name: 'Avatar',
    icon: 'User',
    defaultProps: { src: '', alt: 'User', size: 'medium' },
    category: 'Display'
  },
  
  // Navigation Components
  {
    type: 'navbar',
    name: 'Navigation Bar',
    icon: 'Menu',
    defaultProps: { items: ['Home', 'About', 'Contact'], position: 'top' },
    category: 'Navigation'
  },
  
  // Form Components
  {
    type: 'form',
    name: 'Form',
    icon: 'FileText',
    defaultProps: { title: 'Form', fields: [] },
    category: 'Form'
  },
  
  // Feedback Components
  {
    type: 'alert',
    name: 'Alert',
    icon: 'MessageSquare',
    defaultProps: { message: 'This is an alert message', variant: 'info' },
    category: 'Feedback'
  },
  
  // List Components
  {
    type: 'list',
    name: 'List',
    icon: 'List',
    defaultProps: { items: ['Item 1', 'Item 2', 'Item 3'], ordered: false },
    category: 'List'
  },
  
  // Advanced Components
  {
    type: 'chart',
    name: 'Chart',
    icon: 'BarChart',
    defaultProps: { type: 'bar', data: [], title: 'Chart' },
    category: 'Advanced'
  },
  {
    type: 'tabs',
    name: 'Tabs',
    icon: 'RectangleHorizontal',
    defaultProps: { tabs: ['Tab 1', 'Tab 2'], activeTab: 0 },
    category: 'Advanced'
  }
]

const iconMap: Record<string, any> = {
  Type, Square, Grid, Menu, Search, FileText, Plus, ChevronDown, ImageIcon, MousePointer,
  InputIcon, CheckSquare, User, Video, MessageSquare, Download, Settings, Home, Calendar,
  Star, Heart, Share, Lock, Eye, Edit, Trash, Minus, ArrowUp, List, BarChart, RectangleHorizontal
}

interface DraggableComponentProps {
  template: ComponentTemplate
}

function DraggableComponent({ template }: DraggableComponentProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: template,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const IconComponent = iconMap[template.icon] || Square

  return (
    <div
      ref={drag}
      className={`p-3 bg-card border rounded-lg cursor-move hover:bg-accent transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded">
          <IconComponent className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{template.name}</div>
        </div>
      </div>
    </div>
  )
}

export function ComponentPalette() {
  const categories = Array.from(new Set(componentTemplates.map(t => t.category)))

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Components</h2>
        <p className="text-sm text-muted-foreground">Drag to add to canvas</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
                <Separator className="flex-1" />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {componentTemplates
                  .filter((template) => template.category === category)
                  .map((template) => (
                    <DraggableComponent
                      key={template.type}
                      template={template}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}