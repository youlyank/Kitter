import { Server } from 'socket.io';

interface CollaborationUser {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
  selection?: string
  avatar?: string
}

interface CollaborationEvent {
  type: 'cursor_move' | 'component_add' | 'component_update' | 'component_delete' | 'component_select' | 'user_typing'
  userId: string
  data: any
  timestamp: number
}

// Global state for collaboration
const users = new Map<string, CollaborationUser>()
const events: CollaborationEvent[] = []
const projectRooms = new Map<string, Set<string>>()

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
]

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)]
}

function getRandomAvatar() {
  const avatars = ['👤', '👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🎨', '👩‍🎨', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍🔬']
  return avatars[Math.floor(Math.random() * avatars.length)]
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // User joins a project room
    socket.on('join-project', (data: { projectId: string, userName: string }) => {
      const { projectId, userName } = data
      
      // Create user object
      const user: CollaborationUser = {
        id: socket.id,
        name: userName || `User ${socket.id.slice(0, 4)}`,
        color: getRandomColor(),
        avatar: getRandomAvatar()
      };
      
      users.set(socket.id, user);
      
      // Add to project room
      if (!projectRooms.has(projectId)) {
        projectRooms.set(projectId, new Set());
      }
      projectRooms.get(projectId)!.add(socket.id);
      
      // Join socket.io room
      socket.join(projectId);
      
      // Notify others in project
      socket.to(projectId).emit('user-joined', user);
      
      // Send current users in project to new user
      const projectUsers = Array.from(users.values()).filter(u => 
        projectRooms.get(projectId)?.has(u.id) && u.id !== socket.id
      );
      socket.emit('users-list', projectUsers);
      
      // Send recent events for this project
      const projectEvents = events.filter(e => {
        // In a real implementation, you'd filter by project
        return true;
      }).slice(-50);
      socket.emit('recent-events', projectEvents);
      
      console.log(`User ${user.name} joined project ${projectId}`);
    });

    // Handle cursor movement
    socket.on('cursor-move', (data: { projectId: string, x: number, y: number }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      user.cursor = { x: data.x, y: data.y };
      users.set(socket.id, user);
      
      const event: CollaborationEvent = {
        type: 'cursor_move',
        userId: socket.id,
        data: { x: data.x, y: data.y },
        timestamp: Date.now()
      };
      
      events.push(event);
      if (events.length > 1000) events.shift();
      
      socket.to(data.projectId).emit('cursor-update', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        x: data.x,
        y: data.y
      });
    });

    // Handle component selection
    socket.on('component-select', (data: { projectId: string, componentId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      user.selection = data.componentId;
      users.set(socket.id, user);
      
      const event: CollaborationEvent = {
        type: 'component_select',
        userId: socket.id,
        data: { componentId: data.componentId },
        timestamp: Date.now()
      };
      
      events.push(event);
      if (events.length > 1000) events.shift();
      
      socket.to(data.projectId).emit('selection-update', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        componentId: data.componentId
      });
    });

    // Handle component addition
    socket.on('component-add', (data: { projectId: string, component: any }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      const event: CollaborationEvent = {
        type: 'component_add',
        userId: socket.id,
        data: data.component,
        timestamp: Date.now()
      };
      
      events.push(event);
      if (events.length > 1000) events.shift();
      
      socket.to(data.projectId).emit('component-added', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        component: data.component
      });
    });

    // Handle component update
    socket.on('component-update', (data: { projectId: string, componentId: string, updates: any }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      const event: CollaborationEvent = {
        type: 'component_update',
        userId: socket.id,
        data: { componentId: data.componentId, updates: data.updates },
        timestamp: Date.now()
      };
      
      events.push(event);
      if (events.length > 1000) events.shift();
      
      socket.to(data.projectId).emit('component-updated', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        componentId: data.componentId,
        updates: data.updates
      });
    });

    // Handle component deletion
    socket.on('component-delete', (data: { projectId: string, componentId: string }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      const event: CollaborationEvent = {
        type: 'component_delete',
        userId: socket.id,
        data: { componentId: data.componentId },
        timestamp: Date.now()
      };
      
      events.push(event);
      if (events.length > 1000) events.shift();
      
      socket.to(data.projectId).emit('component-deleted', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        componentId: data.componentId
      });
    });

    // Handle typing indicator
    socket.on('typing', (data: { projectId: string, isTyping: boolean }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      socket.to(data.projectId).emit('user-typing', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        isTyping: data.isTyping
      });
    });

    // Handle chat messages
    socket.on('chat-message', (data: { projectId: string, message: string }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      const messageData = {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        message: data.message,
        timestamp: Date.now()
      };
      
      socket.to(data.projectId).emit('chat-message', messageData);
      // Also send back to sender for consistency
      socket.emit('chat-message', messageData);
    });

    // Handle real-time property editing
    socket.on('property-edit', (data: { projectId: string, componentId: string, property: string, value: any }) => {
      const user = users.get(socket.id);
      if (!user) return;
      
      socket.to(data.projectId).emit('property-updated', {
        userId: socket.id,
        userName: user.name,
        userColor: user.color,
        userAvatar: user.avatar,
        componentId: data.componentId,
        property: data.property,
        value: data.value
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const user = users.get(socket.id);
      if (user) {
        users.delete(socket.id);
        
        // Remove from all project rooms
        projectRooms.forEach((roomUsers, projectId) => {
          if (roomUsers.has(socket.id)) {
            roomUsers.delete(socket.id);
            socket.to(projectId).emit('user-left', {
              userId: socket.id,
              userName: user.name,
              userColor: user.color,
              userAvatar: user.avatar
            });
          }
        });
        
        console.log(`User disconnected: ${user.name}`);
      }
    });

    // Legacy message handler for backward compatibility
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Zero-Code Builder Collaboration Server!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};