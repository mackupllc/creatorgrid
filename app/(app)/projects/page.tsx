"use client"

import { useState } from "react"
import { useProjects } from "@/hooks/use-projects"
import { ProjectType, ProjectStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Calendar as CalendarIcon, FileText, Edit3, Trash2, Video, Monitor, GripVertical } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

const statusColors = {
  "Idea": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  "Scripted": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Filming": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "Editing": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Uploaded": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Published": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
}

export default function ProjectsPage() {
  const { projects, createProject, updateProject, deleteProject, reorderProjects } = useProjects()
  const [newProjectTitle, setNewProjectTitle] = useState("")
  const [newProjectType, setNewProjectType] = useState<ProjectType>("Short Form")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [scriptDialog, setScriptDialog] = useState<{ open: boolean; projectId: string | null; script: string }>({
    open: false,
    projectId: null,
    script: ""
  })
  const [editingTitle, setEditingTitle] = useState<{ id: string; title: string } | null>(null)

  const handleCreateProject = () => {
    if (newProjectTitle.trim()) {
      createProject(newProjectTitle, newProjectType)
      setNewProjectTitle("")
      setNewProjectType("Short Form")
      setIsCreateDialogOpen(false)
    }
  }

  const openScriptDialog = (projectId: string, currentScript: string) => {
    setScriptDialog({
      open: true,
      projectId,
      script: currentScript
    })
  }

  const saveScript = () => {
    if (scriptDialog.projectId) {
      updateProject(scriptDialog.projectId, { script: scriptDialog.script })
      setScriptDialog({ open: false, projectId: null, script: "" })
    }
  }

  const updateProjectField = (id: string, field: keyof Parameters<typeof updateProject>[1], value: any) => {
    updateProject(id, { [field]: value })
  }

  const saveTitle = () => {
    if (editingTitle) {
      updateProject(editingTitle.id, { title: editingTitle.title })
      setEditingTitle(null)
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index
    
    if (sourceIndex === destinationIndex) return
    
    reorderProjects(sourceIndex, destinationIndex)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-400 dark:from-black dark:via-blue-950 dark:to-blue-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 pt-8 pb-2">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Projects
                </h1>
              </div>
            </div>
            <p className="text-lg text-foreground/80 max-w-md mx-auto leading-relaxed">
              Manage your content creation pipeline from idea to publish
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🎬✨</div>
              <h3 className="text-xl font-semibold text-foreground/80 mb-2">No projects yet</h3>
              <p className="text-foreground/60 mb-6">Create your first content project and start organizing your creative workflow!</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="projects">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-6 ${
                      snapshot.isDraggingOver ? 'bg-white/5 dark:bg-white/10 rounded-xl p-3' : 'p-1'
                    }`}
                    style={{ minHeight: '200px' }}
                  >
                    {projects.map((project, index) => (
                      <Draggable key={project.id} draggableId={project.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`backdrop-blur-sm border-white/20 group ${
                              snapshot.isDragging 
                                ? 'shadow-2xl bg-white/95 dark:bg-white/40 scale-[1.02]' 
                                : 'bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 hover:shadow-xl hover:scale-[1.01]'
                            }`}
                            style={provided.draggableProps.style}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                {/* Drag Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="flex items-center justify-center w-8 h-8 mt-2 text-foreground/30 hover:text-foreground/70 cursor-grab active:cursor-grabbing transition-all opacity-0 group-hover:opacity-100 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 flex-shrink-0"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0 space-y-4">
                                  {/* Title */}
                                  <div className="space-y-2">
                                    {editingTitle?.id === project.id ? (
                                      <div className="space-y-2">
                                        <Input
                                          value={editingTitle.title}
                                          onChange={(e) => setEditingTitle({ ...editingTitle, title: e.target.value })}
                                          className="bg-white/50 dark:bg-black/20 border-white/30"
                                          autoFocus
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              saveTitle()
                                            } else if (e.key === 'Escape') {
                                              setEditingTitle(null)
                                            }
                                          }}
                                        />
                                        <div className="flex gap-2">
                                          <Button size="sm" onClick={saveTitle}>Save</Button>
                                          <Button size="sm" variant="outline" onClick={() => setEditingTitle(null)}>Cancel</Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-xl text-foreground/90 leading-tight flex-1 min-w-0">
                                          {project.title}
                                        </h3>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => setEditingTitle({ id: project.id, title: project.title })}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-foreground/60 hover:text-foreground"
                                        >
                                          <Edit3 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Fields Row */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Type */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground/70">Type</label>
                                      <Select
                                        value={project.type}
                                        onValueChange={(value: ProjectType) => updateProjectField(project.id, 'type', value)}
                                      >
                                        <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/30 h-9">
                                          <div className="flex items-center gap-2">
                                            {project.type === 'Short Form' ? (
                                              <Video className="w-4 h-4" />
                                            ) : (
                                              <Monitor className="w-4 h-4" />
                                            )}
                                            <SelectValue />
                                          </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Short Form">
                                            <div className="flex items-center gap-2">
                                              <Video className="w-4 h-4" />
                                              Short Form
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="Long Form">
                                            <div className="flex items-center gap-2">
                                              <Monitor className="w-4 h-4" />
                                              Long Form
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Publish Date */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground/70">Publish Date</label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal bg-white/50 dark:bg-black/20 border-white/30 h-9",
                                              !project.publishDate && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">
                                              {project.publishDate ? format(new Date(project.publishDate), "MMM d") : "Pick date"}
                                            </span>
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={project.publishDate ? new Date(project.publishDate) : undefined}
                                            onSelect={(date) => {
                                              updateProjectField(project.id, 'publishDate', date?.toISOString())
                                            }}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground/70">Status</label>
                                      <Select
                                        value={project.status}
                                        onValueChange={(value: ProjectStatus) => updateProjectField(project.id, 'status', value)}
                                      >
                                        <SelectTrigger className="bg-white/50 dark:bg-black/20 border-white/30 h-9">
                                          <SelectValue>
                                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[project.status])}>
                                              {project.status}
                                            </span>
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Object.keys(statusColors).map((status) => (
                                            <SelectItem key={status} value={status}>
                                              <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusColors[status as ProjectStatus])}>
                                                {status}
                                              </span>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground/70">Actions</label>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => openScriptDialog(project.id, project.script)}
                                          className="bg-white/50 dark:bg-black/20 border-white/30 h-9 px-2"
                                          title="Edit Script"
                                        >
                                          <FileText className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => deleteProject(project.id)}
                                          className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60 hover:text-destructive h-9 px-2"
                                          title="Delete Project"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Script Preview & Metadata */}
                                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/10">
                                    <div className="flex-1 min-w-0">
                                      {project.script && (
                                        <p className="text-sm text-foreground/70 truncate">
                                          📝 {project.script.slice(0, 80)}...
                                        </p>
                                      )}
                                    </div>
                                    <span className="text-xs text-foreground/60 flex-shrink-0">
                                      ✨ {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                    </span>
                                  </div>
                                </div>
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
          )}

          {/* Add New Project Button */}
          <div className="text-center">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title</label>
                    <Input
                      placeholder="Enter project title..."
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newProjectTitle.trim()) {
                          handleCreateProject()
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Type</label>
                    <Select value={newProjectType} onValueChange={(value: ProjectType) => setNewProjectType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short Form">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Short Form
                          </div>
                        </SelectItem>
                        <SelectItem value="Long Form">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Long Form
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateProject} disabled={!newProjectTitle.trim()} className="flex-1">
                      Create Project
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Script Dialog */}
          <Dialog open={scriptDialog.open} onOpenChange={(open) => setScriptDialog(prev => ({ ...prev, open }))}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Edit Script</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Textarea
                  placeholder="Start writing your script here..."
                  value={scriptDialog.script}
                  onChange={(e) => setScriptDialog(prev => ({ ...prev, script: e.target.value }))}
                  className="min-h-[300px] resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={saveScript} className="flex-1">
                    Save Script
                  </Button>
                  <Button variant="outline" onClick={() => setScriptDialog({ open: false, projectId: null, script: "" })}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Stats */}
          {projects.length > 0 && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full border border-white/20">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                  <span className="text-lg">🎬</span>
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                </div>
                {Object.entries(statusColors).map(([status, colorClass]) => {
                  const count = projects.filter(p => p.status === status).length
                  if (count === 0) return null
                  return (
                    <div key={status} className="flex items-center gap-2 text-sm font-medium">
                      <span className={cn("w-3 h-3 rounded-full", colorClass)} />
                      {count} {status.toLowerCase()}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
