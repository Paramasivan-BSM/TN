import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login, resetAuthState, swipeForm } from "../services/authSlice";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ FIX

  const { loading, error, message, isAuthenticated, role } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  useEffect(() => {
    // ✅ Show snackbar on success or error
    if (message || error) {
      setOpen(true);
    }

    // ✅ Redirect after successful login
    if (isAuthenticated && role) {
      if (role === "ROLE_USER") {
        navigate("/user", { replace: true });
      } else if (role === "ROLE_WORKER") {
        navigate("/worker", { replace: true });
      }
    }
  }, [message, error, isAuthenticated, role, navigate]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    dispatch(resetAuthState());
  };

  return (
    <Container maxWidth="sm">
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >


        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          {/* Snackbar */}
          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            {message ? (
              <Alert severity="success" onClose={handleClose}>
                {message}
              </Alert>
            ) : (
              <Alert severity="error" onClose={handleClose}>
                {error}
              </Alert>
            )}
          </Snackbar>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          {/* Switch to Signup */}
          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <MuiLink component="button" onClick={() => dispatch(swipeForm())}>
              Sign up
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signin;
