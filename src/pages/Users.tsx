import type React from "react"
import { useState, useEffect } from "react"
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material"
import { Link } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import { apiService } from "../services/api"
import type { User } from "../types"

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const { currentUser, setCurrentUser } = useAppContext()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await apiService.getUsers()
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setOpenLoginDialog(false)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Загрузка пользователей...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Пользователи
        </Typography>

        {!currentUser && (
          <Button variant="contained" onClick={() => setOpenLoginDialog(true)}>
            Войти как пользователь
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} md={6} lg={4} key={user.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2 }}>{user.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="h6" component="h2">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{user.username}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.company.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {user.address.city}
                </Typography>
              </CardContent>

              <CardActions>
                <Button component={Link} to={`/users/${user.id}`} size="small">
                  Посмотреть профиль
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Выберите пользователя для входа</DialogTitle>
        <DialogContent>
          <List>
            {users.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton onClick={() => handleLogin(user)}>
                  <ListItemAvatar>
                    <Avatar>{user.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={`@${user.username} • ${user.email}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default Users
