import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  user: undefined,
  expDate: undefined,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    addFollower(state, action) {
      state.user = {
        ...state.user,
        following: [...state.user.following, action.payload],
      };
    },
    removeFollower(state, action) {
      state.user = {
        ...state.user,
        following: state.user.following.filter((id) => id !== action.payload),
      };
    },
    setIsLoggedInToTrue(state, action) {
      state.isLoggedIn = action.payload;
    },
    setIsLoggedInToFalse(state) {
      state.isLoggedIn = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem("jwt");
      localStorage.removeItem("exp");
      localStorage.removeItem("id");
    },
    setDate(state, action) {
      state.expDate = action.payload;
    },
  },
});
const friendSlice = createSlice({
  name: "friend",
  initialState: {
    friend: null,
  },
  reducers: {
    setFriend(state, action) {
      state.friend = action.payload;
    },
    addFollower(state, action) {
      state.friend = {
        ...state.friend,
        followers: [...state.friend.followers, action.payload],
      };
    },
    removeFollower(state, action) {
      state.friend = {
        ...state.friend,
        followers: state.friend.followers.filter(
          (item) => item._id !== action.payload
        ),
      };
    },
  },
});
const store = configureStore({
  reducer: { user: userSlice.reducer, friend: friendSlice.reducer },
});
export const userActions = userSlice.actions;
export const friendActions = friendSlice.actions;
export default store;
