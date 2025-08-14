"use client"

import React, { type ReactNode } from "react"
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, Menu, MenuItem } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../../context/AppContext"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, setCurrentUser } = useAppContext()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    handleClose()
    navigate("/")
  }

  const handleProfile = () => {
    handleClose()
    navigate("/profile")
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              React Forum
            </Link>
          </Typography>

          <Button color="inherit" component={Link} to="/posts">
            Посты
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Пользователи
          </Button>

          {currentUser ? (
            <Box sx={{ ml: 2 }}>
              <Button
                onClick={handleMenu}
                color="inherit"
                startIcon={<Avatar sx={{ width: 24, height: 24 }}>{currentUser.name.charAt(0)}</Avatar>}
              >
                {currentUser.name}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleProfile}>Профиль</MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" component={Link} to="/users">
              Войти
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout
