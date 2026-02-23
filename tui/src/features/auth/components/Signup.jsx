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
import { signup, resetAuthState, swipeForm } from "../services/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const { loading, error, message,signupUserType } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: signupUserType,
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup({ ...formData, userType: "USER" }));
  };

  useEffect(() => {
    if (message || error) setOpen(true);
    if (message) setFormData({ username: "", email: "", password: "" });
  }, [message, error]);

  const handleClose = () => {
    setOpen(false);
    dispatch(resetAuthState());
  };

  return (
    <Container maxWidth="sm">
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" align="center">Create Account</Typography>

          <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            {message ? (
              <Alert severity="success">{message}</Alert>
            ) : (
              <Alert severity="error">{error}</Alert>
            )}
          </Snackbar>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required />

            <TextField fullWidth margin="normal" label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required />

            <TextField fullWidth margin="normal" label="Password" type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required />

            <Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <MuiLink component="button" onClick={() => dispatch(swipeForm())}>
              Sign in
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
