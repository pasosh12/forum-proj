export interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export interface AppContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  likedPosts: number[]
  dislikedPosts: number[]
  favoritePosts: number[]
  toggleLike: (postId: number) => void
  toggleDislike: (postId: number) => void
  toggleFavorite: (postId: number) => void
  userPosts: Post[]
  setUserPosts: (posts: Post[]) => void
  userComments: Comment[]
  addComment: (comment: Omit<Comment, "id">) => void
}
