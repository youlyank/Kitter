'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart,
  ScatterChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
  Settings,
  Eye,
  Code,
  Download
} from 'lucide-react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }[]
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter'
  title: string
  description?: string
  data: ChartData
  options: {
    responsive?: boolean
    maintainAspectRatio?: boolean
    legend?: boolean
    animation?: boolean
    scales?: {
      x?: {
        display?: boolean
        title?: string
      }
      y?: {
        display?: boolean
        title?: string
        min?: number
        max?: number
      }
    }
  }
}

interface DataVisualizationProps {
  onAddChart: (config: ChartConfig) => void
}

const chartTypes = [
  { type: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { type: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { type: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
  { type: 'area', name: 'Area Chart', icon: AreaChart, description: 'Show cumulative totals' },
  { type: 'scatter', name: 'Scatter Plot', icon: ScatterChart, description: 'Show relationships between variables' }
]

const sampleData = {
  sales: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  },
  traffic: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Visitors',
        data: [1200, 1900, 1500, 2500, 2200, 3000, 2800],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'Page Views',
        data: [3200, 4900, 3500, 5500, 4200, 6000, 5800],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }
    ]
  },
  performance: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      },
      {
        label: 'Profit',
        data: [12000, 15000, 11000, 18000],
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2
      }
    ]
  }
}

export function DataVisualization({ onAddChart }: DataVisualizationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('bar')
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    type: 'bar',
    title: 'My Chart',
    data: sampleData.sales,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: true,
      animation: true,
      scales: {
        x: { display: true, title: 'Categories' },
        y: { display: true, title: 'Values' }
      }
    }
  })

  const generateChartCode = (config: ChartConfig) => {
    const { type, title, data, options } = config
    
    return `'use client'

import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = ${JSON.stringify(data.labels.map((label, index) => {
  const dataPoint: any = { name: label }
  data.datasets.forEach(dataset => {
    dataPoint[dataset.label] = dataset.data[index]
  })
  return dataPoint
}), null, 2)}

export default function ${title.replace(/\s+/g, '')}Chart() {
  const ChartComponent = ({ data }: { data: any[] }) => {
    switch ('${type}') {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              ${data.datasets.map(dataset => 
                `<Bar dataKey="${dataset.label}" fill="${dataset.backgroundColor}" />`
              ).join('\n              ')}
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              ${data.datasets.map(dataset => 
                `<Line type="monotone" dataKey="${dataset.label}" stroke="${dataset.borderColor}" strokeWidth={2} />`
              ).join('\n              ')}
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="${data.datasets[0].label}"
              >
                ${data.labels.map((label, index) => 
                  `<Cell fill={[\${index % 10 === 0 ? '#8884d8' : '#82ca9d', '#ffc658', '#ff7300', '#0088fe'][index % 5]} />`
                ).join('\n                ')}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              ${data.datasets.map(dataset => 
                `<Area type="monotone" dataKey="${dataset.label}" stroke="${dataset.borderColor}" fill="${dataset.backgroundColor}" />`
              ).join('\n              ')}
            </AreaChart>
          </ResponsiveContainer>
        )
      
      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">${title}</h3>
      ${config.description ? `<p className="text-muted-foreground mb-4">${config.description}</p>` : ''}
      <ChartComponent data={data} />
    </div>
  )
}`
  }

  const updateData = (sampleKey: string) => {
    setChartConfig(prev => ({
      ...prev,
      data: sampleData[sampleKey as keyof typeof sampleData]
    }))
  }

  const addDataset = () => {
    const newDataset = {
      label: `Dataset ${chartConfig.data.datasets.length + 1}`,
      data: chartConfig.data.labels.map(() => Math.floor(Math.random() * 10000)),
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
      borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
      borderWidth: 2
    }
    
    setChartConfig(prev => ({
      ...prev,
      data: {
        ...prev.data,
        datasets: [...prev.data.datasets, newDataset]
      }
    }))
  }

  const removeDataset = (index: number) => {
    setChartConfig(prev => ({
      ...prev,
      data: {
        ...prev.data,
        datasets: prev.data.datasets.filter((_, i) => i !== index)
      }
    }))
  }

  const updateDataset = (index: number, field: string, value: any) => {
    setChartConfig(prev => ({
      ...prev,
      data: {
        ...prev.data,
        datasets: prev.data.datasets.map((dataset, i) => 
          i === index ? { ...dataset, [field]: value } : dataset
        )
      }
    }))
  }

  const handleAddChart = () => {
    onAddChart(chartConfig)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Charts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Data Visualization Builder</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[800px]">
          {/* Chart Type Selection */}
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Chart Type</h3>
            <div className="grid grid-cols-5 gap-3">
              {chartTypes.map((chartType) => {
                const IconComponent = chartType.icon
                return (
                  <Button
                    key={chartType.type}
                    variant={selectedType === chartType.type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(chartType.type)}
                    className="h-auto p-3 flex flex-col items-center"
                  >
                    <IconComponent className="w-6 h-6 mb-2" />
                    <div className="text-xs font-medium">{chartType.name}</div>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - Configuration */}
            <div className="w-80 border-r p-4 space-y-4">
              <div>
                <Label htmlFor="chartTitle">Chart Title</Label>
                <Input
                  id="chartTitle"
                  value={chartConfig.title}
                  onChange={(e) => setChartConfig({ ...chartConfig, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="chartDescription">Description</Label>
                <Input
                  id="chartDescription"
                  value={chartConfig.description || ''}
                  onChange={(e) => setChartConfig({ ...chartConfig, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>

              <div>
                <Label>Sample Data</Label>
                <Select value="sales" onValueChange={updateData}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Data</SelectItem>
                    <SelectItem value="traffic">Website Traffic</SelectItem>
                    <SelectItem value="performance">Performance Metrics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Datasets</Label>
                  <Button variant="outline" size="sm" onClick={addDataset}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {chartConfig.data.datasets.map((dataset, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Input
                            value={dataset.label}
                            onChange={(e) => updateDataset(index, 'label', e.target.value)}
                            className="text-sm"
                            placeholder="Dataset name"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataset(index)}
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            ×
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Fill Color</Label>
                            <Input
                              type="color"
                              value={dataset.backgroundColor}
                              onChange={(e) => updateDataset(index, 'backgroundColor', e.target.value)}
                              className="h-8 w-full p-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Border Color</Label>
                            <Input
                              type="color"
                              value={dataset.borderColor}
                              onChange={(e) => updateDataset(index, 'borderColor', e.target.value)}
                              className="h-8 w-full p-1"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Center - Preview */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Preview</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => generateChartCode(chartConfig)}>
                    <Code className="w-4 h-4 mr-2" />
                    Generate Code
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="p-6 w-full">
                  <div className="text-center">
                    <div className="mb-4">
                      {selectedType === 'bar' && <BarChart3 className="w-16 h-16 mx-auto text-blue-500" />}
                      {selectedType === 'line' && <LineChart className="w-16 h-16 mx-auto text-green-500" />}
                      {selectedType === 'pie' && <PieChart className="w-16 h-16 mx-auto text-purple-500" />}
                      {selectedType === 'area' && <AreaChart className="w-16 h-16 mx-auto text-orange-500" />}
                      {selectedType === 'scatter' && <ScatterChart className="w-16 h-16 mx-auto text-red-500" />}
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{chartConfig.title}</h4>
                    {chartConfig.description && (
                      <p className="text-muted-foreground text-sm mb-4">{chartConfig.description}</p>
                    )}
                    <div className="bg-muted p-4 rounded">
                      <div className="text-sm text-muted-foreground mb-2">Data Preview:</div>
                      <div className="text-xs font-mono">
                        {chartConfig.data.labels.join(', ')}
                      </div>
                      <div className="mt-2 space-y-1">
                        {chartConfig.data.datasets.map((dataset, index) => (
                          <div key={index} className="text-xs">
                            <span 
                              className="inline-block w-3 h-3 rounded mr-2"
                              style={{ backgroundColor: dataset.backgroundColor }}
                            />
                            {dataset.label}: [{dataset.data.slice(0, 3).join(', ')}...]
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Options */}
            <div className="w-64 border-l p-4 space-y-4">
              <h3 className="font-medium">Chart Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Responsive</Label>
                  <input
                    type="checkbox"
                    checked={chartConfig.options.responsive}
                    onChange={(e) => setChartConfig({
                      ...chartConfig,
                      options: { ...chartConfig.options, responsive: e.target.checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Legend</Label>
                  <input
                    type="checkbox"
                    checked={chartConfig.options.legend}
                    onChange={(e) => setChartConfig({
                      ...chartConfig,
                      options: { ...chartConfig.options, legend: e.target.checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Animation</Label>
                  <input
                    type="checkbox"
                    checked={chartConfig.options.animation}
                    onChange={(e) => setChartConfig({
                      ...chartConfig,
                      options: { ...chartConfig.options, animation: e.target.checked }
                    })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={handleAddChart}
                  className="w-full"
                  disabled={!chartConfig.title}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}