"use client"

import { useState, useEffect, useRef } from "react"
import { Note } from "@/lib/types"
import { getLocal, setLocal } from "@/lib/storage"

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const isInitialized = useRef(false)

  const sortNotes = (notesToSort: Note[]) => {
    return [...notesToSort].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      
      // If both have order values, sort by order
      if (typeof a.order === 'number' && typeof b.order === 'number') {
        return a.order - b.order
      }
      
      // Fallback to creation date for existing notes without order
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = getLocal<Note[]>("cg:notes", [])
    console.log("Loading notes from localStorage:", savedNotes)
    
    if (savedNotes.length > 0) {
      // Ensure all notes have an order field (for backward compatibility)
      const notesWithOrder = savedNotes.map((note, index) => ({
        ...note,
        order: note.order ?? Date.now() + index
      }))
      
      console.log("Setting notes to state:", notesWithOrder)
      setNotes(sortNotes(notesWithOrder))
    }
    isInitialized.current = true
  }, [])

  // Save notes to localStorage whenever notes change (but not on initial load)
  useEffect(() => {
    if (isInitialized.current) {
      console.log("Saving notes to localStorage:", notes)
      setLocal("cg:notes", notes)
    }
  }, [notes])

  const createNote = (text: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
      order: 0, // New notes get order 0 to appear first
    }
    setNotes(prev => {
      const updated = [newNote, ...prev.map(note => ({ ...note, order: note.order + 1 }))]
      return sortNotes(updated)
    })
    return newNote
  }

  const updateNote = (id: string, text: string) => {
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === id 
          ? { ...note, text: text.trim(), updatedAt: new Date().toISOString() }
          : note
      )
      return sortNotes(updated)
    })
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const togglePin = (id: string) => {
    setNotes(prev => {
      const updated = prev.map(note => 
        note.id === id 
          ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
          : note
      )
      return sortNotes(updated)
    })
  }

  const reorderNotes = (startIndex: number, endIndex: number) => {
    setNotes(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      
      // Update order values based on new positions
      return result.map((note, index) => ({
        ...note,
        order: index,
        updatedAt: note.id === removed.id ? new Date().toISOString() : note.updatedAt
      }))
    })
  }

  console.log("Current notes state:", notes)

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    reorderNotes,
  }
}