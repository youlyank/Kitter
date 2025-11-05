'use client'

import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  MessageSquare, 
  Send, 
  Eye, 
  EyeOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Crown,
  User
} from 'lucide-react'

interface CollaborationUser {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
  selection?: string
  avatar?: string
}

interface ChatMessage {
  userId: string
  userName: string
  userColor: string
  userAvatar?: string
  message: string
  timestamp: number
}

interface CollaborationPanelProps {
  projectId: string
  userName: string
  isConnected: boolean
  onToggleConnection: () => void
}

export function CollaborationPanel({ 
  projectId, 
  userName, 
  isConnected, 
  onToggleConnection 
}: CollaborationPanelProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [users, setUsers] = useState<CollaborationUser[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isConnected && !socket) {
      const newSocket = io('/', {
        path: '/api/socketio'
      })

      newSocket.on('connect', () => {
        console.log('Connected to collaboration server')
        newSocket.emit('join-project', { projectId, userName })
      })

      newSocket.on('users-list', (usersList: CollaborationUser[]) => {
        setUsers(usersList)
      })

      newSocket.on('user-joined', (user: CollaborationUser) => {
        setUsers(prev => [...prev, user])
      })

      newSocket.on('user-left', (data: { userId: string; userName: string }) => {
        setUsers(prev => prev.filter(u => u.id !== data.userId))
      })

      newSocket.on('chat-message', (message: ChatMessage) => {
        setMessages(prev => [...prev, message])
      })

      newSocket.on('cursor-update', (data: any) => {
        // Handle cursor updates - could show on canvas
        console.log('Cursor update:', data)
      })

      newSocket.on('selection-update', (data: any) => {
        // Handle selection updates - could highlight selected components
        console.log('Selection update:', data)
      })

      newSocket.on('component-added', (data: any) => {
        // Handle component addition from other users
        console.log('Component added:', data)
      })

      newSocket.on('component-updated', (data: any) => {
        // Handle component updates from other users
        console.log('Component updated:', data)
      })

      newSocket.on('component-deleted', (data: any) => {
        // Handle component deletion from other users
        console.log('Component deleted:', data)
      })

      newSocket.on('user-typing', (data: any) => {
        // Handle typing indicators
        console.log('User typing:', data)
      })

      setSocket(newSocket)
    } else if (!isConnected && socket) {
      socket.disconnect()
      setSocket(null)
      setUsers([])
      setMessages([])
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [isConnected, projectId, userName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('chat-message', { projectId, message: newMessage.trim() })
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="sm"
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <Users className="w-5 h-5" />
          {users.length > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
              {users.length + 1}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-background border rounded-lg shadow-lg">
      <Card className="h-96">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collaboration ({users.length + 1})
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="h-6 w-6 p-0"
              >
                <MessageSquare className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleConnection}
                className="h-6 w-6 p-0"
              >
                {isConnected ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Active Users */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded">
              <span className="text-xs">{userName}</span>
              <Crown className="w-3 h-3 text-yellow-500" />
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1 px-2 py-1 rounded"
                style={{ backgroundColor: `${user.color}20` }}
              >
                <span className="text-xs">{user.userAvatar}</span>
                <span className="text-xs">{user.name}</span>
              </div>
            ))}
          </div>

          {/* Media Controls */}
          <div className="flex gap-2">
            <Button
              variant={isVideoEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className="h-6"
            >
              {isVideoEnabled ? <Video className="w-3 h-3" /> : <VideoOff className="w-3 h-3" />}
            </Button>
            <Button
              variant={isAudioEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className="h-6"
            >
              {isAudioEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
            </Button>
            <Button variant="outline" size="sm" className="h-6">
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full">
          {showChat ? (
            <div className="flex flex-col h-full">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      No messages yet. Start a conversation!
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div key={index} className="flex gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: message.userColor }}
                        >
                          {message.userAvatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">{message.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="text-sm bg-muted p-2 rounded">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={sendMessage}
                    size="sm"
                    disabled={!isConnected || !newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-center text-muted-foreground text-sm">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Click the chat icon to start collaborating</p>
                <p className="text-xs mt-1">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}