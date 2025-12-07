export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'CITIZEN' | 'AUTHORITY' | 'ADMIN'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'CITIZEN' | 'AUTHORITY' | 'ADMIN'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'CITIZEN' | 'AUTHORITY' | 'ADMIN'
          created_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          title: string
          description: string
          category: 'Garbage' | 'Roads' | 'Water' | 'Electricity' | 'Safety' | 'Other'
          location: string
          status: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED'
          image_url: string | null
          user_id: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'Garbage' | 'Roads' | 'Water' | 'Electricity' | 'Safety' | 'Other'
          location: string
          status?: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED'
          image_url?: string | null
          user_id: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'Garbage' | 'Roads' | 'Water' | 'Electricity' | 'Safety' | 'Other'
          location?: string
          status?: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED'
          image_url?: string | null
          user_id?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      upvotes: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
          created_at?: string
        }
      }
      verifications: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      status_history: {
        Row: {
          id: string
          issue_id: string
          status: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED'
          changed_by: string
          comment: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          status: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED'
          changed_by: string
          comment?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          status?: 'OPEN' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED'
          changed_by?: string
          comment?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
