export type Note = {
  id: string
  text: string
  createdAt: string
  updatedAt?: string
  pinned?: boolean
  order: number
}