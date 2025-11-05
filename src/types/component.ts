export interface Component {
  id: string
  type: string
  props: Record<string, any>
  position: { x: number; y: number }
  children: Component[]
  parentId?: string
  style?: React.CSSProperties
  isContainer?: boolean
}

export interface ComponentTemplate {
  type: string
  name: string
  icon: string
  defaultProps: Record<string, any>
  category: string
}

export interface Project {
  id: string
  name: string
  components: Component[]
  createdAt: Date
  updatedAt: Date
}