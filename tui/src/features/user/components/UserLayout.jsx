import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { UserTopBar } from "./UserTopBar";
import Footer from "../../../components/Footer";

import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useSelector } from "react-redux";
import { fetchSkills } from '../services/UserSlice';
import { useDispatch } from 'react-redux';



export const UserLayout = () => {











  return (
    <>
      <header>

        <UserTopBar />


      </header>
      <main>

        <Outlet />

      </main>

      <Footer />

    </>
  )
}
