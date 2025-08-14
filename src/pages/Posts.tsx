import type React from "react";
import { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Container,
} from "@mui/material";
import {
  Add,
  ThumbUp,
  ThumbDown,
  Favorite,
  FavoriteBorder,
  Delete,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { apiService } from "../services/api";
import type { Post, User } from "../types";

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "" });

  const {
    currentUser,
    likedPosts,
    dislikedPosts,
    favoritePosts,
    toggleLike,
    toggleDislike,
    toggleFavorite,
    userPosts,
    setUserPosts,
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, usersData] = await Promise.all([
          apiService.getPosts(),
          apiService.getUsers(),
        ]);
        setPosts([...postsData, ...userPosts]);
        setUsers(usersData);
        setFilteredPosts([...postsData, ...userPosts]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userPosts]);

  useEffect(() => {
    if (selectedUserId === "") {
      setFilteredPosts([...posts]);
    } else {
      setFilteredPosts(posts.filter((post) => post.userId === selectedUserId));
    }
  }, [selectedUserId, posts]);

  const handleCreatePost = async () => {
    if (!currentUser || !newPost.title.trim() || !newPost.body.trim()) return;

    try {
      const postData = {
        title: newPost.title,
        body: newPost.body,
        userId: currentUser.id,
      };

      const newPostWithId: Post = {
        ...postData,
        id: Date.now(),
      };

      setUserPosts([...userPosts, newPostWithId]);
      setNewPost({ title: "", body: "" });
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDeletePost = (postId: number) => {
    const updatedUserPosts = userPosts.filter((post) => post.id !== postId);
    setUserPosts(updatedUserPosts);
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const isUserPost = (postId: number) => {
    return userPosts.some((post) => post.id === postId);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography>Загрузка постов...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Посты
        </Typography>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Фильтр по пользователю</InputLabel>
          <Select
            value={selectedUserId}
            label="Фильтр по пользователю"
            onChange={(e) => setSelectedUserId(e.target.value as number | "")}
          >
            <MenuItem value="">Все пользователи</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedUserId && (
        <Box mb={2}>
          <Chip
            label={`Посты от: ${getUserName(selectedUserId as number)}`}
            onDelete={() => setSelectedUserId("")}
            color="primary"
          />
        </Box>
      )}

      <Container>
        {filteredPosts.map((post) => (
          <Grid key={post.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                mb: 2,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {post.body.substring(0, 100)}...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Автор: {getUserName(post.userId)}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between" }}>
                <Box>
                  <IconButton
                    onClick={() => toggleLike(post.id)}
                    color={likedPosts.includes(post.id) ? "primary" : "default"}
                  >
                    <ThumbUp />
                  </IconButton>
                  <IconButton
                    onClick={() => toggleDislike(post.id)}
                    color={
                      dislikedPosts.includes(post.id) ? "error" : "default"
                    }
                  >
                    <ThumbDown />
                  </IconButton>
                  <IconButton onClick={() => toggleFavorite(post.id)}>
                    {favoritePosts.includes(post.id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  {currentUser && isUserPost(post.id) && (
                    <IconButton
                      onClick={() => handleDeletePost(post.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
                <Button component={Link} to={`/posts/${post.id}`} size="small">
                  Читать далее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Container>

      {currentUser && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          <Add />
        </Fab>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Создать новый пост</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заголовок"
            fullWidth
            variant="outlined"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Содержание"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleCreatePost} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Posts;
