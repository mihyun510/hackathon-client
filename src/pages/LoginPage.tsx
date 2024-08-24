import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // AuthContext를 가져옵니다.

const LoginPage = () => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // useAuth 훅을 사용하여 로그인 함수 가져오기

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "/login",
        { username: id, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.headers.authorization?.split(" ")[1];
      if (token) {
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem("jwtToken", token);
        login(); // 로그인 상태를 업데이트
        // 로그인 성공 후 페이지 이동
        navigate("/"); // 루트 페이지로 이동
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setError("로그인에 실패했습니다. 다시 시도하세요.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        로그인
      </Typography>

      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="ID"
        variant="outlined"
        value={id}
        onChange={(e) => setId(e.target.value)}
        fullWidth
      />

      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        로그인
      </Button>
    </Box>
  );
};

export default LoginPage;
