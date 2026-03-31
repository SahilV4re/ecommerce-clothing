export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'admin'
          created_at?: string
        }
      }

      hero_slides: {
        Row: {
          id: string
          image_url: string
          title: string
          subtitle: string | null
          button_text: string
          button_link: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title: string
          subtitle?: string | null
          button_text?: string
          button_link?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title?: string
          subtitle?: string | null
          button_text?: string
          button_link?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }

      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          original_price: number
          category: 'men' | 'women' | 'kids'
          subcategory: string
          image_url: string
          stock: number
          featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          original_price: number
          category: 'men' | 'women' | 'kids'
          subcategory: string
          image_url: string
          stock: number
          featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          original_price?: number
          category?: 'men' | 'women' | 'kids'
          subcategory?: string
          image_url?: string
          stock?: number
          featured?: boolean
          created_at?: string
        }
      }

      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }

      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
        }
      }
    }
  }
}
