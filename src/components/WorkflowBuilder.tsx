'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Workflow, 
  Play, 
  Pause, 
  Settings, 
  Code, 
  Save,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  GitBranch,
  Clock,
  Zap,
  Database,
  Mail,
  MessageSquare,
  Bell,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'webhook' | 'email' | 'notification' | 'database'
  name: string
  description?: string
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

interface WorkflowConnection {
  id: string
  from: string
  to: string
  condition?: string
}

interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  isActive: boolean
  triggers: string[]
  createdAt: Date
  updatedAt: Date
}

interface WorkflowBuilderProps {
  onAddWorkflow: (workflow: Workflow) => void
}

const nodeTypes = [
  { type: 'trigger', name: 'Trigger', icon: Zap, description: 'Start of workflow' },
  { type: 'action', name: 'Action', icon: Play, description: 'Perform an action' },
  { type: 'condition', name: 'Condition', icon: GitBranch, description: 'Branch logic' },
  { type: 'delay', name: 'Delay', icon: Clock, description: 'Wait before next step' },
  { type: 'webhook', name: 'Webhook', icon: Code, description: 'Call external API' },
  { type: 'email', name: 'Email', icon: Mail, description: 'Send email' },
  { type: 'notification', name: 'Notification', icon: Bell, description: 'Send notification' },
  { type: 'database', name: 'Database', icon: Database, description: 'Database operation' }
]

const triggerTypes = [
  { type: 'form_submit', name: 'Form Submit', description: 'When a form is submitted' },
  { type: 'user_signup', name: 'User Signup', description: 'When a user registers' },
  { type: 'schedule', name: 'Schedule', description: 'Run on a schedule' },
  { type: 'webhook', name: 'Webhook', description: 'Triggered by external service' },
  { type: 'data_change', name: 'Data Change', description: 'When data changes' }
]

const actionTypes = [
  { type: 'send_email', name: 'Send Email', description: 'Send an email notification' },
  { type: 'create_user', name: 'Create User', description: 'Create a new user account' },
  { type: 'update_data', name: 'Update Data', description: 'Update database records' },
  { type: 'call_api', name: 'Call API', description: 'Make HTTP request' },
  { type: 'set_variable', name: 'Set Variable', description: 'Store a value' },
  { type: 'log_event', name: 'Log Event', description: 'Log an event' }
]

export function WorkflowBuilder({ onAddWorkflow }: WorkflowBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [workflow, setWorkflow] = useState<Workflow>({
    id: Date.now().toString(),
    name: 'New Workflow',
    description: 'Describe what this workflow does',
    nodes: [],
    connections: [],
    isActive: false,
    triggers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const addNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: type as WorkflowNode['type'],
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${workflow.nodes.length + 1}`,
      config: {},
      position: { x: 100 + (workflow.nodes.length * 150), y: 100 },
      connections: []
    }
    
    setWorkflow({
      ...workflow,
      nodes: [...workflow.nodes, newNode]
    })
    setSelectedNode(newNode)
  }

  const updateNode = (id: string, updates: Partial<WorkflowNode>) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    })
    if (selectedNode?.id === id) {
      setSelectedNode({ ...selectedNode, ...updates })
    }
  }

  const deleteNode = (id: string) => {
    setWorkflow({
      ...workflow,
      nodes: workflow.nodes.filter(node => node.id !== id),
      connections: workflow.connections.filter(conn => conn.from !== id && conn.to !== id)
    })
    if (selectedNode?.id === id) {
      setSelectedNode(null)
    }
  }

  const addConnection = (from: string, to: string) => {
    const newConnection: WorkflowConnection = {
      id: Date.now().toString(),
      from,
      to
    }
    
    setWorkflow({
      ...workflow,
      connections: [...workflow.connections, newConnection]
    })
  }

  const generateWorkflowCode = () => {
    const { name, description, nodes, connections } = workflow
    
    return `// ${name}
// ${description}

import { useState, useEffect } from 'react'

export default function ${name.replace(/\s+/g, '')}Workflow() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [workflowData, setWorkflowData] = useState({})

  const executeWorkflow = async () => {
    setIsRunning(true)
    
    try {
      ${nodes.map((node, index) => {
        switch (node.type) {
          case 'trigger':
            return `
      // Step ${index + 1}: ${node.name}
      console.log('Triggering: ${node.name}')
      await handleTrigger('${node.config.triggerType || 'manual'}')`
          
          case 'action':
            return `
      // Step ${index + 1}: ${node.name}
      console.log('Executing: ${node.name}')
      await handleAction('${node.config.actionType || 'default'}', workflowData)`
          
          case 'condition':
            return `
      // Step ${index + 1}: ${node.name}
      const conditionResult = await checkCondition('${node.config.condition || 'true'}', workflowData)
      if (conditionResult) {
        // Continue with true branch
      } else {
        // Continue with false branch
      }`
          
          case 'delay':
            return `
      // Step ${index + 1}: ${node.name}
      await new Promise(resolve => setTimeout(resolve, ${node.config.delay || 1000}))`
          
          case 'webhook':
            return `
      // Step ${index + 1}: ${node.name}
      const webhookResponse = await callWebhook('${node.config.url || ''}', {
        method: '${node.config.method || 'POST'}',
        data: workflowData
      })`
          
          case 'email':
            return `
      // Step ${index + 1}: ${node.name}
      await sendEmail({
        to: '${node.config.to || ''}',
        subject: '${node.config.subject || ''}',
        body: '${node.config.body || ''}',
        data: workflowData
      })`
          
          case 'notification':
            return `
      // Step ${index + 1}: ${node.name}
      await sendNotification({
        title: '${node.config.title || ''}',
        message: '${node.config.message || ''}',
        type: '${node.config.type || 'info'}'
      })`
          
          case 'database':
            return `
      // Step ${index + 1}: ${node.name}
      await performDatabaseOperation({
        operation: '${node.config.operation || 'select'}',
        table: '${node.config.table || ''}',
        data: workflowData
      })`
          
          default:
            return `
      // Step ${index + 1}: ${node.name}
      console.log('Unknown node type: ${node.type}')`
        }
      }).join('\n')}
      
      console.log('Workflow completed successfully')
    } catch (error) {
      console.error('Workflow error:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleTrigger = async (triggerType: string) => {
    // Implement trigger logic
    console.log('Trigger activated:', triggerType)
  }

  const handleAction = async (actionType: string, data: any) => {
    // Implement action logic
    console.log('Action executed:', actionType, data)
  }

  const checkCondition = async (condition: string, data: any) => {
    // Implement condition logic
    return true
  }

  const callWebhook = async (url: string, options: any) => {
    // Implement webhook logic
    const response = await fetch(url, options)
    return response.json()
  }

  const sendEmail = async (emailData: any) => {
    // Implement email logic
    console.log('Sending email:', emailData)
  }

  const sendNotification = async (notificationData: any) => {
    // Implement notification logic
    console.log('Sending notification:', notificationData)
  }

  const performDatabaseOperation = async (dbData: any) => {
    // Implement database logic
    console.log('Database operation:', dbData)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">${name}</h2>
      <p className="text-muted-foreground mb-6">${description}</p>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={executeWorkflow}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Workflow'}
        </button>
        
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Configure
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Workflow Steps:</h3>
        ${nodes.map((node, index) => `
          <div key="${node.id}" className="mb-2 p-2 bg-white rounded border">
            <strong>Step ${index + 1}:</strong> ${node.name} (${node.type})
          </div>
        `).join('')}
      </div>
    </div>
  )
}`
  }

  const handleSaveWorkflow = () => {
    onAddWorkflow(workflow)
    setIsOpen(false)
  }

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type)
    return nodeType?.icon || Workflow
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Workflow className="w-4 h-4 mr-2" />
          Workflows
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Workflow Builder</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[800px]">
          {/* Workflow Settings */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workflowName">Workflow Name</Label>
                <Input
                  id="workflowName"
                  value={workflow.name}
                  onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="workflowDescription">Description</Label>
                <Input
                  id="workflowDescription"
                  value={workflow.description}
                  onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                  placeholder="What does this workflow do?"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={workflow.isActive}
                  onCheckedChange={(checked) => setWorkflow({ ...workflow, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="previewMode"
                  checked={isPreviewMode}
                  onCheckedChange={setIsPreviewMode}
                />
                <Label htmlFor="previewMode">Preview Mode</Label>
              </div>
              
              <Button variant="outline" size="sm" onClick={generateWorkflowCode}>
                <Code className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Node Palette */}
            <div className="w-64 border-r p-4">
              <h3 className="font-medium mb-3">Add Node</h3>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {nodeTypes.map((nodeType) => {
                    const IconComponent = nodeType.icon
                    return (
                      <Button
                        key={nodeType.type}
                        variant="outline"
                        size="sm"
                        onClick={() => addNode(nodeType.type)}
                        className="w-full justify-start h-auto p-3"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{nodeType.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {nodeType.description}
                          </div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Canvas */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Workflow Canvas</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-96 relative overflow-hidden">
                {workflow.nodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Workflow className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Nodes Added</h3>
                      <p>Add nodes from the left to build your workflow</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-4">
                    {workflow.nodes.map((node, index) => {
                      const IconComponent = getNodeIcon(node.type)
                      return (
                        <div
                          key={node.id}
                          className={`absolute bg-white border rounded-lg p-3 cursor-pointer shadow-sm hover:shadow-md transition-shadow ${
                            selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{
                            left: `${node.position.x}px`,
                            top: `${node.position.y}px`
                          }}
                          onClick={() => setSelectedNode(node)}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm font-medium">{node.name}</div>
                              <div className="text-xs text-muted-foreground">{node.type}</div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    
                    {/* Connections */}
                    <svg className="absolute inset-0 pointer-events-none">
                      {workflow.connections.map((connection) => {
                        const fromNode = workflow.nodes.find(n => n.id === connection.from)
                        const toNode = workflow.nodes.find(n => n.id === connection.to)
                        
                        if (!fromNode || !toNode) return null
                        
                        return (
                          <line
                            key={connection.id}
                            x1={fromNode.position.x + 100}
                            y1={fromNode.position.y + 20}
                            x2={toNode.position.x}
                            y2={toNode.position.y + 20}
                            stroke="#6b7280"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                        )
                      })}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#6b7280"
                          />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Node Properties */}
            <div className="w-80 border-l p-4">
              {selectedNode ? (
                <div className="space-y-4">
                  <h3 className="font-medium">Node Properties</h3>
                  
                  <div>
                    <Label htmlFor="nodeName">Node Name</Label>
                    <Input
                      id="nodeName"
                      value={selectedNode.name}
                      onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nodeDescription">Description</Label>
                    <Textarea
                      id="nodeDescription"
                      value={selectedNode.description || ''}
                      onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  
                  {/* Node-specific configuration */}
                  {selectedNode.type === 'trigger' && (
                    <div>
                      <Label>Trigger Type</Label>
                      <Select
                        value={selectedNode.config.triggerType || ''}
                        onValueChange={(value) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, triggerType: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerTypes.map(trigger => (
                            <SelectItem key={trigger.type} value={trigger.type}>
                              {trigger.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedNode.type === 'action' && (
                    <div>
                      <Label>Action Type</Label>
                      <Select
                        value={selectedNode.config.actionType || ''}
                        onValueChange={(value) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, actionType: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actionTypes.map(action => (
                            <SelectItem key={action.type} value={action.type}>
                              {action.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedNode.type === 'delay' && (
                    <div>
                      <Label htmlFor="delay">Delay (ms)</Label>
                      <Input
                        id="delay"
                        type="number"
                        value={selectedNode.config.delay || 1000}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, delay: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                  )}
                  
                  {selectedNode.type === 'webhook' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="webhookUrl">URL</Label>
                        <Input
                          id="webhookUrl"
                          value={selectedNode.config.url || ''}
                          onChange={(e) => updateNode(selectedNode.id, { 
                            config: { ...selectedNode.config, url: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Method</Label>
                        <Select
                          value={selectedNode.config.method || 'POST'}
                          onValueChange={(value) => updateNode(selectedNode.id, { 
                            config: { ...selectedNode.config, method: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newNode = { ...selectedNode }
                        deleteNode(selectedNode.id)
                        addNode(selectedNode.type)
                        setTimeout(() => setSelectedNode(newNode), 100)
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNode(selectedNode.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Node Selected</h3>
                  <p>Select a node to edit its properties</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {workflow.nodes.length} nodes • {workflow.connections.length} connections
              </div>
              <Button 
                onClick={handleSaveWorkflow}
                disabled={!workflow.name || workflow.nodes.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Workflow
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}