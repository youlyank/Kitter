import { NextRequest, NextResponse } from 'next/server'
import { Component } from '@/types/component'

interface CustomComponent {
  id: string
  name: string
  description: string
  category: string
  components: Component[]
  props: Record<string, any>
  thumbnail?: string
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  author?: string
  tags: string[]
}

// In-memory storage for demo purposes
const customComponents: Map<string, CustomComponent> = new Map()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const category = searchParams.get('category')
  const isPublic = searchParams.get('public')

  if (id) {
    const component = customComponents.get(id)
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }
    return NextResponse.json(component)
  }

  let components = Array.from(customComponents.values())

  // Filter by category
  if (category) {
    components = components.filter(comp => comp.category === category)
  }

  // Filter by public status
  if (isPublic === 'true') {
    components = components.filter(comp => comp.isPublic)
  }

  return NextResponse.json(components)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category, components, props, isPublic, author, tags } = body

    if (!name || !components || !Array.isArray(components)) {
      return NextResponse.json(
        { error: 'Name, components array are required' },
        { status: 400 }
      )
    }

    const id = Date.now().toString()
    const customComponent: CustomComponent = {
      id,
      name,
      description: description || '',
      category: category || 'Custom',
      components,
      props: props || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: isPublic || false,
      author: author || 'Anonymous',
      tags: tags || []
    }

    customComponents.set(id, customComponent)
    return NextResponse.json(customComponent, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, category, components, props, isPublic, tags } = body

    if (!id || !name || !components || !Array.isArray(components)) {
      return NextResponse.json(
        { error: 'ID, name, and components array are required' },
        { status: 400 }
      )
    }

    const existingComponent = customComponents.get(id)
    if (!existingComponent) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    const updatedComponent: CustomComponent = {
      ...existingComponent,
      name,
      description,
      category,
      components,
      props,
      updatedAt: new Date(),
      isPublic: isPublic !== undefined ? isPublic : existingComponent.isPublic,
      tags: tags || existingComponent.tags
    }

    customComponents.set(id, updatedComponent)
    return NextResponse.json(updatedComponent)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Component ID is required' },
      { status: 400 }
    )
  }

  const component = customComponents.get(id)
  if (!component) {
    return NextResponse.json({ error: 'Component not found' }, { status: 404 })
  }

  customComponents.delete(id)
  return NextResponse.json({ message: 'Component deleted successfully' })
}