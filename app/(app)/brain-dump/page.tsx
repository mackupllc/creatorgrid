"use client"

import { useState } from "react"
import { useNotes } from "@/hooks/use-notes"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Pin, Trash2, Edit3, Search, Plus, GripVertical, Brain } from "lucide-react"
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
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8 pb-2">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Brain Dump
              </h1>
            </div>
          </div>
          <p className="text-lg text-foreground/80 max-w-md mx-auto leading-relaxed">
            Capture your thoughts quickly and organize them later
          </p>
        </div>

        {/* Add Note Form */}
        <Card className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border-white/20 shadow-xl">
          <CardContent className="p-8">
            <div className="space-y-6">
              <Textarea
                placeholder="What's on your mind? ✨"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="min-h-[120px] resize-none text-lg bg-white/50 dark:bg-black/20 border-white/30 focus:bg-white/70 dark:focus:bg-black/40 transition-colors placeholder:text-foreground/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault()
                    handleAddNote()
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60 font-medium">
                  💡 Press Ctrl+Enter to add quickly
                </span>
                <Button 
                  onClick={handleAddNote} 
                  disabled={!newNoteText.trim()}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        {notes.length > 0 && (
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="🔍 Search your thoughts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/20 dark:bg-white/10 border-white/30 backdrop-blur-sm text-lg placeholder:text-foreground/50 focus:bg-white/30 dark:focus:bg-white/20 transition-colors"
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
                className={`space-y-4 ${
                  snapshot.isDraggingOver ? 'bg-white/5 dark:bg-white/10 rounded-xl p-3' : 'p-1'
                }`}
                style={{
                  minHeight: '200px'
                }}
              >
                {filteredNotes.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-lg text-foreground/70 mb-2">No notes found</p>
                    <p className="text-foreground/50">Try searching for "{searchQuery}" differently</p>
                  </div>
                )}

                {filteredNotes.length === 0 && !searchQuery && notes.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">🧠✨</div>
                    <h3 className="text-xl font-semibold text-foreground/80 mb-2">Your mind palace awaits</h3>
                    <p className="text-foreground/60">Start dumping your thoughts above and watch your ideas come to life!</p>
                  </div>
                )}

                {filteredNotes.map((note, index) => (
                  <Draggable key={note.id} draggableId={note.id} index={index} isDragDisabled={!!searchQuery}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group backdrop-blur-sm border-white/20 ${
                          note.pinned 
                            ? 'ring-2 ring-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg' 
                            : 'bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10'
                        } ${
                          snapshot.isDragging 
                            ? 'shadow-2xl bg-white/95 dark:bg-white/40' 
                            : 'transition-all duration-200 ease-out hover:shadow-xl hover:scale-[1.02]'
                        }`}
                        style={provided.draggableProps.style}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {/* Drag Handle */}
                              {!searchQuery && (
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-center w-8 h-8 mt-1 text-foreground/30 hover:text-foreground/70 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 rounded-lg hover:bg-white/20 dark:hover:bg-white/10"
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
                                    <p className="text-base leading-relaxed whitespace-pre-wrap break-words mb-3 text-foreground/90">
                                      {note.text}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-foreground/60 font-medium">
                                      <span>
                                        ✨ {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                      </span>
                                      {note.updatedAt && (
                                        <>
                                          <span>•</span>
                                          <span>
                                            📝 Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                          </span>
                                        </>
                                      )}
                                      {note.pinned && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center gap-1 text-primary font-semibold">
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
                              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => togglePin(note.id)}
                                  className={`hover:scale-110 transition-all ${
                                    note.pinned 
                                      ? 'text-primary hover:text-primary bg-primary/10 hover:bg-primary/20' 
                                      : 'text-foreground/60 hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10'
                                  }`}
                                >
                                  <Pin className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditNote(note.id, note.text)}
                                  className="text-foreground/60 hover:text-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:scale-110 transition-all"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNote(note.id)}
                                  className="text-foreground/60 hover:text-destructive hover:bg-destructive/10 hover:scale-110 transition-all"
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
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/20">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                <span className="text-lg">📝</span>
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </div>
              {notes.filter(n => n.pinned).length > 0 && (
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Pin className="w-4 h-4" />
                  {notes.filter(n => n.pinned).length} pinned
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
