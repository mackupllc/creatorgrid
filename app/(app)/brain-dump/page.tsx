"use client"

import { useState } from "react"
import { useNotes } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Pin, Trash2, Edit3, Search, Plus, GripVertical } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function BrainDumpPage() {
  const { notes, createNote, updateNote, deleteNote, togglePin, reorderNotes } = useNotes()
  const [newNoteText, setNewNoteText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      createNote(newNoteText)
      setNewNoteText("")
    }
  }

  const handleEditNote = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const handleSaveEdit = () => {
    if (editingId && editText.trim()) {
      updateNote(editingId, editText)
      setEditingId(null)
      setEditText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    if (sourceIndex === destinationIndex) return
    
    reorderNotes(sourceIndex, destinationIndex)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-400 dark:from-black dark:via-blue-950 dark:to-blue-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Brain Dump</h1>
          <p className="text-muted-foreground">Capture your thoughts quickly and organize them later</p>
        </div>

        {/* Add Note Form */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="min-h-[100px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    handleAddNote()
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Press Ctrl+Enter to add quickly
                </span>
                <Button onClick={handleAddNote} disabled={!newNoteText.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        {notes.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Notes List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notes">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 transition-colors ${
                  snapshot.isDraggingOver ? 'bg-muted/20 rounded-lg p-2' : ''
                }`}
              >
                {filteredNotes.length === 0 && searchQuery && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notes found matching "{searchQuery}"
                  </div>
                )}

                {filteredNotes.length === 0 && !searchQuery && notes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notes yet. Add your first thought above! 💭
                  </div>
                )}

                {filteredNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index} isDragDisabled={!!searchQuery}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-all ${note.pinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''} ${
                          snapshot.isDragging ? 'shadow-lg rotate-1 scale-105' : ''
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {/* Drag Handle */}
                              {!searchQuery && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-center w-6 h-6 mt-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-opacity"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                {editingId === note.id ? (
                                  <div className="space-y-3">
                                    <Textarea
                                      value={editText}
                                      onChange={(e) => setEditText(e.target.value)}
                                      className="min-h-[80px] resize-none"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={handleSaveEdit} disabled={!editText.trim()}>
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm whitespace-pre-wrap break-words mb-2">
                                      {note.text}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <span>
                                        Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                      </span>
                                      {note.updatedAt && (
                                        <>
                                          <span>•</span>
                                          <span>
                                            Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                          </span>
                                        </>
                                      )}
                                      {note.pinned && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center gap-1 text-primary">
                                            <Pin className="w-3 h-3" />
                                            Pinned
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {editingId !== note.id && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => togglePin(note.id)}
                                  className={note.pinned ? 'text-primary' : ''}
                                >
                                  <Pin className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditNote(note.id, note.text)}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNote(note.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Stats */}
        {notes.length > 0 && (
          <div className="text-center text-xs text-muted-foreground">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
            {notes.filter(n => n.pinned).length > 0 && (
              <span> • {notes.filter(n => n.pinned).length} pinned</span>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
