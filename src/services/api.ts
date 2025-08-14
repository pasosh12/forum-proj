import type { User, Post, Comment } from "../types"

const BASE_URL = "https://jsonplaceholder.typicode.com"

export const apiService = {
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/users`)
    return response.json()
  },

  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${BASE_URL}/users/${id}`)
    return response.json()
  },

  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts`)
    return response.json()
  },

  getPost: async (id: number): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts/${id}`)
    return response.json()
  },

  getUserPosts: async (userId: number): Promise<Post[]> => {
    const response = await fetch(`${BASE_URL}/posts?userId=${userId}`)
    return response.json()
  },

  createPost: async (post: Omit<Post, "id">): Promise<Post> => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      body: JSON.stringify(post),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    return response.json()
  },

  deletePost: async (id: number): Promise<void> => {
    await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
    })
  },

  getPostComments: async (postId: number): Promise<Comment[]> => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`)
    return response.json()
  },
}
