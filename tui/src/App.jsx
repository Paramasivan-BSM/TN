import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Authertication from "./pages/Authertication";

import { Worker } from "./pages/Worker";
import WorkerHome from "./features/worker/components/WorkerHome";
import WorkerRegistration from "./features/worker/components/WorkerRegistration";
import WorkerDashboard from "./features/worker/components/WorkerDashboard";
import WorkerInbox from "./features/worker/components/WorkerInbox";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./features/auth/components/AuthRedirect";
import { checkAuth } from "./features/auth/services/authSlice";
import { fetchLocation } from "./features/user/services/locationSlice";
import { UserLayout } from "./features/user/components/UserLayout";
import { UserStyleContent } from "./features/user/components/UserStyleContent";
import { ResultPage } from "./features/user/components/ResultPage";
import DetailedWorkerPage from "./features/user/components/DetailedWorkerpage";
import UserBookings from "./features/user/components/UserBookings";
import PaymentPage from "./features/user/components/PaymentPage";


const App = () => {
  const dispatch = useDispatch();

  const { authChecked, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());

    if (isAuthenticated) {
      dispatch(fetchLocation());

    }

  }, [dispatch]);

  // 🔑 BLOCK EVERYTHING until auth check finishes
  if (!authChecked) {
    return <h3>Checking session...</h3>;
  }

  return (
    <Router>
      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <AuthRedirect />
              : <Authertication />
          }
        />

        <Route
          path="/userlayout"
          element={
            <ProtectedRoute allowedRoles={["ROLE_USER"]}>
              <UserLayout />
            </ProtectedRoute>
          }


        >

          <Route index element={<UserStyleContent />}></Route>
          <Route path="/userlayout/search/:servicetype" element={<ResultPage />}></Route>
          <Route path="/userlayout/deatil/:worker" element={<DetailedWorkerPage />}></Route>
          <Route path="/userlayout/bookings" element={<UserBookings />}></Route>
          <Route path="/userlayout/pay/:bookingId" element={<PaymentPage />}></Route>


        </Route>

        <Route
          path="/worker"
          element={
            <ProtectedRoute allowedRoles={["ROLE_WORKER"]}>
              <Worker />
            </ProtectedRoute>
          }
        >

          <Route index element={<WorkerHome />} />
          <Route path="register" element={<WorkerRegistration />} />
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="inbox" element={<WorkerInbox />} />
        </Route>

      </Routes>
    </Router>
  );
};


export default App;
