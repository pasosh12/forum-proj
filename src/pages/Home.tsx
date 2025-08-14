import type React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { PostAdd, People, Forum } from "@mui/icons-material";

const Home: React.FC = () => {
  return (
    <Box className="flex flex-col align-center justify-center gap">
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Добро пожаловать в React Forum
      </Typography>

      <Typography
        variant="h6"
        component="p"
        gutterBottom
        align="center"
        color="text.secondary"
      >
        Современный форум для общения и обмена идеями
      </Typography>

      <Box className="flex flex-col justify-center  space-y-5  ">
        <Box className="mb-5">
          <Card sx={{ display: "flex", flexDirection: "column", py: 2, mb: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Forum sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Посты
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Просматривайте, создавайте и обсуждайте посты. Ставьте лайки и
                добавляйте в избранное.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                size="large"
                component={Link}
                to="/posts"
                variant="contained"
              >
                Перейти к постам
              </Button>
            </CardActions>
          </Card>
        </Box>

        <Box className="mb-5">
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              py: 2,
              mb: 2,
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <People sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Пользователи
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Знакомьтесь с участниками сообщества, просматривайте профили и
                их посты.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                size="large"
                component={Link}
                to="/users"
                variant="contained"
              >
                Посмотреть пользователей
              </Button>
            </CardActions>
          </Card>
        </Box>

        <Box>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              py: 2,
              mb: 2,
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <PostAdd sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Создать пост
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Поделитесь своими мыслями и идеями с сообществом. Войдите, чтобы
                создать пост.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                size="large"
                component={Link}
                to="/posts"
                variant="outlined"
              >
                Начать писать
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
