"use client"

import { useState, useEffect, useRef } from "react"
import { Project, ProjectStatus, ProjectType } from "@/lib/types"
import { getLocal, setLocal } from "@/lib/storage"

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const isInitialized = useRef(false)

  const sortProjects = (projectsToSort: Project[]) => {
    return [...projectsToSort].sort((a, b) => {
      // Sort by order first
      if (typeof a.order === 'number' && typeof b.order === 'number') {
        return a.order - b.order
      }
      
      // Fallback to creation date for existing projects without order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = getLocal<Project[]>("cg:projects", [])
    
    if (savedProjects.length > 0) {
      // Ensure all projects have an order field (for backward compatibility)
      const projectsWithOrder = savedProjects.map((project, index) => ({
        ...project,
        order: project.order ?? Date.now() + index
      }))
      
      setProjects(sortProjects(projectsWithOrder))
    }
    isInitialized.current = true
  }, [])

  // Save projects to localStorage whenever projects change (but not on initial load)
  useEffect(() => {
    if (isInitialized.current) {
      setLocal("cg:projects", projects)
    }
  }, [projects])

  const createProject = (title: string, type: ProjectType) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: title.trim(),
      type,
      script: "",
      status: "Idea",
      createdAt: new Date().toISOString(),
      order: 0, // New projects get order 0 to appear first
    }
    setProjects(prev => {
      const updated = [newProject, ...prev.map(project => ({ ...project, order: project.order + 1 }))]
      return sortProjects(updated)
    })
    return newProject
  }

  const updateProject = (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'order'>>) => {
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
      return sortProjects(updated)
    })
  }

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id))
  }

  const reorderProjects = (startIndex: number, endIndex: number) => {
    setProjects(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      // Update order values based on new positions
      return result.map((project, index) => ({
        ...project,
        order: index,
        updatedAt: project.id === removed.id ? new Date().toISOString() : project.updatedAt
      }))
    })
  }

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
  }
}