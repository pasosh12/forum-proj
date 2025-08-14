import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  IconButton,
  Divider,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  Favorite,
  FavoriteBorder,
  ArrowBack,
} from "@mui/icons-material";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { apiService } from "../services/api";
import type { Post, User, Comment } from "../types";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  const {
    currentUser,
    likedPosts,
    dislikedPosts,
    favoritePosts,
    toggleLike,
    toggleDislike,
    toggleFavorite,
    userPosts,
    userComments,
    addComment,
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const postId = Number.parseInt(id);
        const postData = await apiService.getPost(postId);

        const foundInUserPosts = userPosts.find((p) => p.id === postData.id);
        const finalPost = foundInUserPosts || postData;
        setPost(finalPost);

        const userData = await apiService.getUser(finalPost.userId);
        setUser(userData);

        const comments = await apiService.getPostComments(postId);
        const userPostComments = userComments.filter(
          (comment) => comment.postId === postId
        );
        setComments([...comments, ...userPostComments]);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, userPosts, userComments]);

  const handleAddComment = () => {
    if (!currentUser || !newComment.trim() || !post) return;

    const comment: Omit<Comment, "id"> = {
      postId: post.id,
      name: currentUser.name,
      email: currentUser.email,
      body: newComment,
    };

    addComment(comment);
    setNewComment("");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Typography>Загрузка поста...</Typography>
      </Box>
    );
  }

  if (!post || !user) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">Пост не найден</Typography>
        <Button
          component={Link}
          to="/posts"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Вернуться к постам
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={Link}
        to="/posts"
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        Назад
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {post.title}
          </Typography>

          <Typography variant="body1" paragraph>
            {post.body}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Автор: {user.name} ({user.email})
          </Typography>
        </CardContent>

        <CardActions>
          <IconButton
            onClick={() => toggleLike(post.id)}
            color={likedPosts.includes(post.id) ? "primary" : "default"}
          >
            <ThumbUp />
          </IconButton>
          <Typography variant="body2">
            {likedPosts.includes(post.id) ? "Нравится" : ""}
          </Typography>

          <IconButton
            onClick={() => toggleDislike(post.id)}
            color={dislikedPosts.includes(post.id) ? "error" : "default"}
          >
            <ThumbDown />
          </IconButton>
          <Typography variant="body2">
            {dislikedPosts.includes(post.id) ? "Не нравится" : ""}
          </Typography>

          <IconButton onClick={() => toggleFavorite(post.id)}>
            {favoritePosts.includes(post.id) ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
          <Typography variant="body2">
            {favoritePosts.includes(post.id) ? "В избранном" : ""}
          </Typography>
        </CardActions>
      </Card>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Комментарии ({comments.length})
        </Typography>

        {currentUser && (
          <Box mb={3}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Написать комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              sx={{ mt: 1 }}
            >
              Добавить комментарий
            </Button>
          </Box>
        )}

        <List>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{comment.name.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.name}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {comment.email}
                      </Typography>
                      <br />
                      {comment.body}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>

        {comments.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={4}
          >
            Пока нет комментариев. Будьте первым!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PostDetail;
