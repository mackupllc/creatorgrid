export type Note = {
  id: string
  text: string
  createdAt: string
  updatedAt?: string
  pinned?: boolean
  order: number
}

export type ProjectType = 'Short Form' | 'Long Form'

export type ProjectStatus = 'Idea' | 'Scripted' | 'Filming' | 'Editing' | 'Uploaded' | 'Published'

export type Project = {
  id: string
  title: string
  type: ProjectType
  script: string
  publishDate?: string
  status: ProjectStatus
  createdAt: string
  updatedAt?: string
  order: number
}