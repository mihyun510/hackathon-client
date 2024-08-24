import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  Toolbar,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useAuth } from "../../contexts/AuthContext"; // useAuth 추가

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();  // useAuth 훅 사용

  const handlePushHomePage = () => navigate("/");
  const handlePushCartPage = () => navigate("/cart");
  const handlePushCreatePage = () => navigate("/create");
  const handleLoginPage = () => navigate("/login");

  const handleLogout = () => {
    logout(); // 로그아웃 호출
    navigate("/login"); // 홈으로 이동
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h1"
              sx={{ fontSize: 26, fontWeight: "bold", cursor: "pointer" }}
              onClick={handlePushHomePage}
            >
              온라인 쇼핑몰
            </Typography>
            <div>
              <Button color="inherit" onClick={handlePushCartPage}>
                장바구니
              </Button>
              {isLoggedIn ? (
                <Button color="inherit" onClick={handleLogout}>
                  로그아웃
                </Button>
              ) : (
                <Button color="inherit" onClick={handleLoginPage}>
                  로그인
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Container fixed>{children}</Container>
      </Box>

      <Box sx={{ position: "fixed", bottom: "16px", right: "16px" }}>
        <Fab color="primary" onClick={handlePushCreatePage}>
          <CreateIcon />
        </Fab>
      </Box>
    </>
  );
};

export default Layout;
