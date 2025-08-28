"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getLocal, setLocal } from "@/lib/storage"
import { Brain, FolderKanban, Calendar, Edit3 } from "lucide-react"

export default function Home() {
  const [name, setName] = useState("")
  const [tempName, setTempName] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const storedName = getLocal("cg:name", "")
    setName(storedName)
    setTempName(storedName)
    if (!storedName) {
      setIsEditing(true)
    }
  }, [])

  const handleSaveName = () => {
    const trimmedName = tempName.trim()
    setName(trimmedName)
    setLocal("cg:name", trimmedName)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Welcome Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">CreatorGrid</h1>
          
          {name && !isEditing ? (
            <div className="space-y-2">
              <h2 className="text-2xl text-muted-foreground">
                Welcome back, {name}!
              </h2>
              <p className="text-lg text-primary">What are you cooking?</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Change name
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl text-muted-foreground">
                {name ? `Edit your name` : `What should we call you?`}
              </h2>
              <div className="flex gap-2 max-w-sm mx-auto">
                <Input
                  placeholder="Your name..."
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-center"
                  autoFocus
                />
                <Button onClick={handleSaveName} disabled={!tempName.trim()}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <Link href="/brain-dump">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <Brain className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Brain Dump</h3>
                <p className="text-muted-foreground">
                  Capture ideas and thoughts quickly
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/projects">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <FolderKanban className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Projects</h3>
                <p className="text-muted-foreground">
                  Manage your content projects
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <Calendar className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Calendar</h3>
                <p className="text-muted-foreground">
                  Schedule and track publishing
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
