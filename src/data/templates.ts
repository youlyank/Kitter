import { Component } from '@/types/component'

export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  components: Component[]
  tags: string[]
}

export const templates: Template[] = [
  {
    id: 'landing-page-basic',
    name: 'Basic Landing Page',
    description: 'A clean and modern landing page with hero section, features, and footer',
    category: 'Landing Pages',
    thumbnail: '/templates/landing-basic.png',
    tags: ['landing', 'marketing', 'saas'],
    components: [
      {
        id: '1',
        type: 'container',
        props: {
          padding: '80px 20px',
          backgroundColor: '#f8fafc',
          textAlign: 'center'
        },
        position: { x: 0, y: 0 },
        children: [
          {
            id: '2',
            type: 'heading',
            props: {
              text: 'Welcome to Our Platform',
              level: 'h1',
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '16px'
            },
            position: { x: 0, y: 0 },
            children: []
          },
          {
            id: '3',
            type: 'paragraph',
            props: {
              text: 'Build amazing web experiences with our zero-code builder. No programming required.',
              fontSize: '20px',
              color: '#64748b',
              marginBottom: '32px'
            },
            position: { x: 0, y: 80 },
            children: []
          },
          {
            id: '4',
            type: 'button',
            props: {
              text: 'Get Started',
              variant: 'default',
              size: 'large'
            },
            position: { x: 0, y: 160 },
            children: []
          }
        ],
        isContainer: true
      }
    ]
  },
  {
    id: 'portfolio-creative',
    name: 'Creative Portfolio',
    description: 'A stunning portfolio layout perfect for designers and creatives',
    category: 'Portfolios',
    thumbnail: '/templates/portfolio-creative.png',
    tags: ['portfolio', 'creative', 'designer'],
    components: [
      {
        id: '1',
        type: 'container',
        props: {
          padding: '120px 20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          textAlign: 'center'
        },
        position: { x: 0, y: 0 },
        children: [
          {
            id: '2',
            type: 'heading',
            props: {
              text: 'John Designer',
              level: 'h1',
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '16px'
            },
            position: { x: 0, y: 0 },
            children: []
          },
          {
            id: '3',
            type: 'paragraph',
            props: {
              text: 'UI/UX Designer & Creative Developer',
              fontSize: '24px',
              color: '#94a3b8',
              marginBottom: '48px'
            },
            position: { x: 0, y: 100 },
            children: []
          }
        ],
        isContainer: true
      }
    ]
  }
]