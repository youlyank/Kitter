'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  FormInput,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  FileText,
  CheckSquare,
  Radio,
  List,
  Plus,
  Trash2,
  Settings,
  Eye,
  Code,
  Save
} from 'lucide-react'

interface FormField {
  id: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  name: string
  label: string
  placeholder?: string
  required: boolean
  validation: {
    minLength?: number
    maxLength?: number
    pattern?: string
    custom?: string
  }
  options?: string[]
  defaultValue?: string
  description?: string
}

interface FormBuilderProps {
  onAddForm: (fields: FormField[]) => void
}

const fieldTypes = [
  { type: 'text', name: 'Text Input', icon: FormInput, description: 'Single line text input' },
  { type: 'email', name: 'Email', icon: Mail, description: 'Email address input' },
  { type: 'tel', name: 'Phone', icon: Phone, description: 'Phone number input' },
  { type: 'textarea', name: 'Textarea', icon: MessageSquare, description: 'Multi-line text input' },
  { type: 'select', name: 'Dropdown', icon: List, description: 'Select from options' },
  { type: 'checkbox', name: 'Checkbox', icon: CheckSquare, description: 'Single checkbox' },
  { type: 'radio', name: 'Radio Group', icon: Radio, description: 'Radio button group' },
  { type: 'file', name: 'File Upload', icon: FileText, description: 'File upload field' }
]

const validationRules = [
  { name: 'Required', value: 'required', description: 'Field must be filled' },
  { name: 'Min Length', value: 'minLength', description: 'Minimum character count' },
  { name: 'Max Length', value: 'maxLength', description: 'Maximum character count' },
  { name: 'Email Pattern', value: 'email', description: 'Valid email format' },
  { name: 'Phone Pattern', value: 'phone', description: 'Valid phone format' },
  { name: 'Custom Regex', value: 'custom', description: 'Custom validation pattern' }
]

export function FormBuilder({ onAddForm }: FormBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [formSettings, setFormSettings] = useState({
    title: 'Contact Form',
    description: 'Please fill out the form below',
    submitText: 'Submit',
    resetText: 'Reset',
    successMessage: 'Form submitted successfully!',
    errorMessage: 'Please fix the errors and try again.'
  })

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: type as FormField['type'],
      name: `field_${fields.length + 1}`,
      label: `${fieldTypes.find(f => f.type === type)?.name || 'Field'}`,
      required: false,
      validation: {},
      options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
    }
    setFields([...fields, newField])
    setSelectedField(newField)
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
    if (selectedField?.id === id) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id))
    if (selectedField?.id === id) {
      setSelectedField(null)
    }
  }

  const duplicateField = (field: FormField) => {
    const newField: FormField = {
      ...field,
      id: Date.now().toString(),
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`
    }
    setFields([...fields, newField])
  }

  const generateFormCode = () => {
    const formFields = fields.map(field => {
      let fieldCode = ''
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'tel':
          fieldCode = `        <div>
          <Label htmlFor="${field.name}">${field.label}${field.required ? ' *' : ''}</Label>
          <Input
            type="${field.type}"
            id="${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
            ${field.validation.minLength ? `minLength="${field.validation.minLength}"` : ''}
            ${field.validation.maxLength ? `maxLength="${field.validation.maxLength}"` : ''}
          />
        </div>`
          break
          
        case 'textarea':
          fieldCode = `        <div>
          <Label htmlFor="${field.name}">${field.label}${field.required ? ' *' : ''}</Label>
          <Textarea
            id="${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
            rows={4}
          />
        </div>`
          break
          
        case 'select':
          fieldCode = `        <div>
          <Label htmlFor="${field.name}">${field.label}${field.required ? ' *' : ''}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="${field.placeholder || 'Select an option'}" />
            </SelectTrigger>
            <SelectContent>
              ${field.options?.map(option => 
                `<SelectItem value="${option}">${option}</SelectItem>`
              ).join('\n              ')}
            </SelectContent>
          </Select>
        </div>`
          break
          
        case 'checkbox':
          fieldCode = `        <div className="flex items-center space-x-2">
          <Checkbox id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} />
          <Label htmlFor="${field.name}">${field.label}${field.required ? ' *' : ''}</Label>
        </div>`
          break
          
        default:
          fieldCode = `        <div>
          <Label>${field.label}${field.required ? ' *' : ''}</Label>
          <Input type="${field.type}" name="${field.name}" ${field.required ? 'required' : ''} />
        </div>`
      }
      
      return fieldCode
    }).join('\n\n')

    return `'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ${formSettings.title.replace(/\s+/g, '')}Form() {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    ${fields.map(field => {
      if (field.required) {
        return `    if (!formData['${field.name}']) {
      newErrors['${field.name}'] = '${field.label} is required'
    }`
      }
      return ''
    }).join('\n')}
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitted(true)
      setFormData({})
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({})
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h3 className="text-lg font-semibold mb-2">${formSettings.successMessage}</h3>
          <Button onClick={handleReset} variant="outline">
            Submit Another Response
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>${formSettings.title}</CardTitle>
        <p className="text-muted-foreground">${formSettings.description}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
${formFields}
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : '${formSettings.submitText}'}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              ${formSettings.resetText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}`
  }

  const handleAddForm = () => {
    if (fields.length === 0) return
    
    onAddForm(fields)
    setIsOpen(false)
    setFields([])
    setSelectedField(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FormInput className="w-4 h-4 mr-2" />
          Form Builder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Form Builder</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[800px]">
          {/* Form Settings */}
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Form Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formTitle">Form Title</Label>
                <Input
                  id="formTitle"
                  value={formSettings.title}
                  onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="submitText">Submit Button Text</Label>
                <Input
                  id="submitText"
                  value={formSettings.submitText}
                  onChange={(e) => setFormSettings({ ...formSettings, submitText: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3">
              <Label htmlFor="formDescription">Description</Label>
              <Input
                id="formDescription"
                value={formSettings.description}
                onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
                placeholder="Form description"
              />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Field Types */}
            <div className="w-64 border-r p-4">
              <h3 className="font-medium mb-3">Add Field</h3>
              <div className="space-y-2">
                {fieldTypes.map((fieldType) => {
                  const IconComponent = fieldType.icon
                  return (
                    <Button
                      key={fieldType.type}
                      variant="outline"
                      size="sm"
                      onClick={() => addField(fieldType.type)}
                      className="w-full justify-start h-auto p-3"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{fieldType.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {fieldType.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Form Fields ({fields.length})</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={generateFormCode}>
                    <Code className="w-4 h-4 mr-2" />
                    Generate Code
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleAddForm}
                    disabled={fields.length === 0}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Form
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="h-[500px]">
                {fields.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FormInput className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Fields Added</h3>
                    <p>Add fields from the left to build your form</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <Card 
                        key={field.id} 
                        className={`cursor-pointer transition-colors ${
                          selectedField?.id === field.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedField(field)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{index + 1}.</span>
                                <Badge variant="outline" className="text-xs">
                                  {field.type}
                                </Badge>
                                {field.required && (
                                  <Badge variant="destructive" className="text-xs">
                                    Required
                                  </Badge>
                                )}
                              </div>
                              <div className="font-medium">{field.label}</div>
                              <div className="text-sm text-muted-foreground">
                                Name: {field.name}
                              </div>
                              {field.placeholder && (
                                <div className="text-sm text-muted-foreground">
                                  Placeholder: {field.placeholder}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  duplicateField(field)
                                }}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteField(field.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Field Properties */}
            <div className="w-80 border-l p-4">
              {selectedField ? (
                <div className="space-y-4">
                  <h3 className="font-medium">Field Properties</h3>
                  
                  <div>
                    <Label htmlFor="fieldLabel">Label</Label>
                    <Input
                      id="fieldLabel"
                      value={selectedField.label}
                      onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input
                      id="fieldName"
                      value={selectedField.name}
                      onChange={(e) => updateField(selectedField.id, { name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                    <Input
                      id="fieldPlaceholder"
                      value={selectedField.placeholder || ''}
                      onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fieldDescription">Description</Label>
                    <Textarea
                      id="fieldDescription"
                      value={selectedField.description || ''}
                      onChange={(e) => updateField(selectedField.id, { description: e.target.value })}
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fieldRequired"
                      checked={selectedField.required}
                      onCheckedChange={(checked) => updateField(selectedField.id, { required: !!checked })}
                    />
                    <Label htmlFor="fieldRequired">Required Field</Label>
                  </div>
                  
                  {(selectedField.type === 'select' || selectedField.type === 'radio') && (
                    <div>
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={selectedField.options?.join('\n') || ''}
                        onChange={(e) => updateField(selectedField.id, { 
                          options: e.target.value.split('\n').filter(opt => opt.trim()) 
                        })}
                        rows={4}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label>Validation</Label>
                    <div className="space-y-2 mt-2">
                      <div>
                        <Label htmlFor="minLength">Min Length</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={selectedField.validation.minLength || ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, minLength: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLength">Max Length</Label>
                        <Input
                          id="maxLength"
                          type="number"
                          value={selectedField.validation.maxLength || ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, maxLength: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a field to edit its properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}