import React, { useState, useEffect } from "react"
import { Typography, Card, CardContent, Box, Grid, Button, List, ListItem, ListItemText, Divider } from "@mui/material"
import { ArrowBack, Email, Phone, Language, Business } from "@mui/icons-material"
import { useParams, Link, useNavigate } from "react-router-dom"
import { apiService } from "../services/api"
import type { User, Post } from "../types"

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return

      try {
        const userId = Number.parseInt(id)
        const [userData, postsData] = await Promise.all([apiService.getUser(userId), apiService.getUserPosts(userId)])

        setUser(userData)
        setUserPosts(postsData)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Загрузка профиля...</Typography>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Пользователь не найден</Typography>
        <Button component={Link} to="/users" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Вернуться к пользователям
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} sx={{ mb: 2 }} onClick={() => navigate(-1)}>
        Назад
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>
                {user.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{user.username}
              </Typography>

              <Box mt={2}>
                <List dense>
                  <ListItem>
                    <Email sx={{ mr: 1 }} />
                    <ListItemText primary={user.email} />
                  </ListItem>
                  <ListItem>
                    <Phone sx={{ mr: 1 }} />
                    <ListItemText primary={user.phone} />
                  </ListItem>
                  <ListItem>
                    <Language sx={{ mr: 1 }} />
                    <ListItemText primary={user.website} />
                  </ListItem>
                  <ListItem>
                    <Business sx={{ mr: 1 }} />
                    <ListItemText primary={user.company.name} />
                  </ListItem>
                </List>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Адрес:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.address.street}, {user.address.suite}
                  <br />
                  {user.address.city}, {user.address.zipcode}
                </Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Компания:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.company.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.company.catchPhrase}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Посты пользователя ({userPosts.length})
              </Typography>

              {userPosts.length > 0 ? (
                <List>
                  {userPosts.map((post, index) => (
                    <React.Fragment key={post.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={
                            <Button
                              component={Link}
                              to={`/posts/${post.id}`}
                              variant="text"
                              sx={{ textAlign: "left", justifyContent: "flex-start" }}
                            >
                              {post.title}
                            </Button>
                          }
                          secondary={post.body.substring(0, 150) + "..."}
                        />
                      </ListItem>
                      {index < userPosts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  У пользователя пока нет постов
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserProfile
