import React, { useState, useEffect } from "react"
import {
  Typography,
  Card,
  Box,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
} from "@mui/material"
import { Delete, Favorite } from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { apiService } from "../services/api"
import type { Post, User } from "../types"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, userPosts, setUserPosts, favoritePosts, toggleFavorite } = useAppContext()

  const [tabValue, setTabValue] = useState(0)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [favoritePostsData, setFavoritePostsData] = useState<Post[]>([])

  useEffect(() => {
    if (!currentUser) {
      navigate("/users")
      return
    }

    setEditedUser({ ...currentUser })

    const fetchPosts = async () => {
      try {
        const posts = await apiService.getPosts()
        setAllPosts([...posts, ...userPosts])
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }

    fetchPosts()
  }, [currentUser, navigate, userPosts])

  useEffect(() => {
 
    const favorites = allPosts.filter((post) => favoritePosts.includes(post.id))
    setFavoritePostsData(favorites)
  }, [allPosts, favoritePosts])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleSaveProfile = () => {
    if (editedUser) {
      setCurrentUser(editedUser)
      alert("Профиль обновлен!")
    }
  }

  const handleDeletePost = (postId: number) => {
    const updatedPosts = userPosts.filter((post) => post.id !== postId)
    setUserPosts(updatedPosts)
  }

  if (!currentUser) {
    return null
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Личный кабинет
      </Typography>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Профиль" />
            <Tab label="Мои посты" />
            <Tab label="Избранное" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <TextField
                fullWidth
                label="Имя"
                value={editedUser?.name || ""}
                onChange={(e) => setEditedUser(editedUser ? { ...editedUser, name: e.target.value } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Имя пользователя"
                value={editedUser?.username || ""}
                onChange={(e) => setEditedUser(editedUser ? { ...editedUser, username: e.target.value } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={editedUser?.email || ""}
                onChange={(e) => setEditedUser(editedUser ? { ...editedUser, email: e.target.value } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Телефон"
                value={editedUser?.phone || ""}
                onChange={(e) => setEditedUser(editedUser ? { ...editedUser, phone: e.target.value } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Веб-сайт"
                value={editedUser?.website || ""}
                onChange={(e) => setEditedUser(editedUser ? { ...editedUser, website: e.target.value } : null)}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Адрес
              </Typography>
              <TextField
                fullWidth
                label="Улица"
                value={editedUser?.address.street || ""}
                onChange={(e) =>
                  setEditedUser(
                    editedUser ? { ...editedUser, address: { ...editedUser.address, street: e.target.value } } : null,
                  )
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Квартира/Офис"
                value={editedUser?.address.suite || ""}
                onChange={(e) =>
                  setEditedUser(
                    editedUser ? { ...editedUser, address: { ...editedUser.address, suite: e.target.value } } : null,
                  )
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Город"
                value={editedUser?.address.city || ""}
                onChange={(e) =>
                  setEditedUser(
                    editedUser ? { ...editedUser, address: { ...editedUser.address, city: e.target.value } } : null,
                  )
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Почтовый индекс"
                value={editedUser?.address.zipcode || ""}
                onChange={(e) =>
                  setEditedUser(
                    editedUser ? { ...editedUser, address: { ...editedUser.address, zipcode: e.target.value } } : null,
                  )
                }
                margin="normal"
              />

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Компания
              </Typography>
              <TextField
                fullWidth
                label="Название компании"
                value={editedUser?.company.name || ""}
                onChange={(e) =>
                  setEditedUser(
                    editedUser ? { ...editedUser, company: { ...editedUser.company, name: e.target.value } } : null,
                  )
                }
                margin="normal"
              />
            </Grid>
          </Grid>

          <Box mt={3}>
            <Button variant="contained" onClick={handleSaveProfile}>
              Сохранить изменения
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Мои посты ({userPosts.length})
          </Typography>

          {userPosts.length > 0 ? (
            <List>
              {userPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleDeletePost(post.id)} color="error">
                        <Delete />
                      </IconButton>
                    }
                  >
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
                      secondary={post.body.substring(0, 100) + "..."}
                    />
                  </ListItem>
                  {index < userPosts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              У вас пока нет постов. <Link to="/posts">Создайте свой первый пост!</Link>
            </Alert>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Избранные посты ({favoritePostsData.length})
          </Typography>

          {favoritePostsData.length > 0 ? (
            <List>
              {favoritePostsData.map((post, index) => (
                <React.Fragment key={post.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => toggleFavorite(post.id)} color="error">
                        <Favorite />
                      </IconButton>
                    }
                  >
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
                      secondary={post.body.substring(0, 100) + "..."}
                    />
                  </ListItem>
                  {index < favoritePostsData.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              У вас пока нет избранных постов. <Link to="/posts">Добавьте посты в избранное!</Link>
            </Alert>
          )}
        </TabPanel>
      </Card>
    </Box>
  )
}

export default Profile
