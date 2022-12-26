import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { useDispatch, useSelector } from "react-redux";
import { Suspense } from "react";
import LoadingSpinner from "./components/loadingSpinner/LoadingSpinner";
import React, { useEffect } from "react";
import { userActions } from "./components/redux-store/store";
import Messenger from "./messenger/Messenger";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import Missing from "./pages/missing/Missing";
const Home = React.lazy(() => import("./pages/home/Home"));
function App() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("jwt");
    const expDate = localStorage.getItem("exp");
    if (token && expDate > new Date().getTime()) {
      dispatch(userActions.setIsLoggedInToTrue(true));
      dispatch(userActions.setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      }
    >
      <Routes>
        <Route
          index
          element={<Navigate to="home" replace={true}></Navigate>}
        ></Route>
        <Route element={<ProtectedRoute></ProtectedRoute>}>
          <Route path="home" element={<Home></Home>}></Route>
          <Route path=":id" element={<Profile></Profile>}></Route>
          <Route path="messenger" element={<Messenger></Messenger>}></Route>
        </Route>
        <Route
          path="login"
          element={
            isLoggedIn ? <Navigate to="/home"></Navigate> : <Login></Login>
          }
        ></Route>
        <Route path="signup" element={<Signup></Signup>}></Route>
        <Route element={<ProtectedRoute></ProtectedRoute>}></Route>
        <Route path="*" element={<Missing></Missing>}></Route>
      </Routes>
    </Suspense>
  );
}

export default App;
