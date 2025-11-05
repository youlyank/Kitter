import { NextRequest, NextResponse } from 'next/server'
import { Component, Project } from '@/types/component'

// In-memory storage for demo purposes
// In production, you'd use a database like Prisma
const projects: Map<string, Project> = new Map()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    const project = projects.get(id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    return NextResponse.json(project)
  }

  // Return all projects
  const allProjects = Array.from(projects.values())
  return NextResponse.json(allProjects)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, components } = body

    if (!name || !components) {
      return NextResponse.json(
        { error: 'Name and components are required' },
        { status: 400 }
      )
    }

    const id = Date.now().toString()
    const project: Project = {
      id,
      name,
      components,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    projects.set(id, project)
    return NextResponse.json(project, { status: 201 })
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
    const { id, name, components } = body

    if (!id || !name || !components) {
      return NextResponse.json(
        { error: 'ID, name, and components are required' },
        { status: 400 }
      )
    }

    const existingProject = projects.get(id)
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updatedProject: Project = {
      ...existingProject,
      name,
      components,
      updatedAt: new Date()
    }

    projects.set(id, updatedProject)
    return NextResponse.json(updatedProject)
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
      { error: 'Project ID is required' },
      { status: 400 }
    )
  }

  const project = projects.get(id)
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  projects.delete(id)
  return NextResponse.json({ message: 'Project deleted successfully' })
}