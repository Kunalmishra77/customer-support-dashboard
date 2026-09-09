export type Priority = 'low' | 'medium' | 'high'
export type Status = 'open' | 'in_progress' | 'resolved'
export type Channel = 'email' | 'chat' | 'phone'

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: 'Starter' | 'Growth' | 'Scale'
}

export interface Message {
  id: string
  author: { name: string; role: 'customer' | 'agent' }
  body: string
  sentAt: string
}

export interface Ticket {
  id: string
  subject: string
  description: string
  priority: Priority
  status: Status
  channel: Channel
  createdAt: string
  updatedAt: string
  customer: Customer
  assignee: string | null
  tags: string[]
  messages: Message[]
}
