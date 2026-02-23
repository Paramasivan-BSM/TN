import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                color: "white",
                py: 6,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                mt: 'auto'
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            TradeNest ✨
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                            Connecting you with trusted professionals for all your service needs. Fast, reliable, and secure.
                        </Typography>
                        <Box>
                            <IconButton color="inherit" aria-label="Facebook">
                                <Facebook />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Twitter">
                                <Twitter />
                            </IconButton>
                            <IconButton color="inherit" aria-label="Instagram">
                                <Instagram />
                            </IconButton>
                            <IconButton color="inherit" aria-label="LinkedIn">
                                <LinkedIn />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Quick Links
                        </Typography>
                        <Link href="/" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            Home
                        </Link>
                        <Link href="/services" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            Services
                        </Link>
                        <Link href="/worker" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            Become a Worker
                        </Link>
                        <Link href="/about" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            About Us
                        </Link>
                    </Grid>

                    {/* Support */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Support
                        </Typography>
                        <Link href="/contact" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            Contact Us
                        </Link>
                        <Link href="/faq" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            FAQ
                        </Link>
                        <Link href="/privacy" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            Privacy Policy
                        </Link>
                        <Link href="/terms" color="inherit" underline="hover" display="block" sx={{ mb: 1, opacity: 0.8 }}>
                            Terms of Service
                        </Link>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                            📍 1234 Street Name, City, Country
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                            📧 support@tradenest.com
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            📞 +1 234 567 890
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

                <Box textAlign="center">
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>
                        © {new Date().getFullYear()} TradeNest. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
