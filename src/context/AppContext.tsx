"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Post, Comment, AppContextType } from "../types"

const AppContext = createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [dislikedPosts, setDislikedPosts] = useState<number[]>([])
  const [favoritePosts, setFavoritePosts] = useState<number[]>([])
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [userComments, setUserComments] = useState<Comment[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    const savedLiked = localStorage.getItem("likedPosts")
    const savedDisliked = localStorage.getItem("dislikedPosts")
    const savedFavorites = localStorage.getItem("favoritePosts")
    const savedUserPosts = localStorage.getItem("userPosts")
    const savedComments = localStorage.getItem("userComments")

    if (savedUser) setCurrentUser(JSON.parse(savedUser))
    if (savedLiked) setLikedPosts(JSON.parse(savedLiked))
    if (savedDisliked) setDislikedPosts(JSON.parse(savedDisliked))
    if (savedFavorites) setFavoritePosts(JSON.parse(savedFavorites))
    if (savedUserPosts) setUserPosts(JSON.parse(savedUserPosts))
    if (savedComments) setUserComments(JSON.parse(savedComments))
  }, [])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("currentUser")
    }
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts))
  }, [likedPosts])

  useEffect(() => {
    localStorage.setItem("dislikedPosts", JSON.stringify(dislikedPosts))
  }, [dislikedPosts])

  useEffect(() => {
    localStorage.setItem("favoritePosts", JSON.stringify(favoritePosts))
  }, [favoritePosts])

  useEffect(() => {
    localStorage.setItem("userPosts", JSON.stringify(userPosts))
  }, [userPosts])

  useEffect(() => {
    localStorage.setItem("userComments", JSON.stringify(userComments))
  }, [userComments])

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId)
      } else {
        setDislikedPosts((prevDisliked) => prevDisliked.filter((id) => id !== postId))
        return [...prev, postId]
      }
    })
  }

  const toggleDislike = (postId: number) => {
    setDislikedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId)
      } else {
        setLikedPosts((prevLiked) => prevLiked.filter((id) => id !== postId))
        return [...prev, postId]
      }
    })
  }

  const toggleFavorite = (postId: number) => {
    setFavoritePosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId)
      } else {
        return [...prev, postId]
      }
    })
  }

  const addComment = (comment: Omit<Comment, "id">) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now(),
    }
    setUserComments((prev) => [...prev, newComment])
  }

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    likedPosts,
    dislikedPosts,
    favoritePosts,
    toggleLike,
    toggleDislike,
    toggleFavorite,
    userPosts,
    setUserPosts,
    userComments,
    addComment,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const useApp = useAppContext
