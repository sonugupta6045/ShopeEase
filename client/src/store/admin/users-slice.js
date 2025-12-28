import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  userList: [],
};

export const fetchAllUsers = createAsyncThunk(
  "/admin/users/fetchAllUsers",
  async () => {
    // Adjust URL to your actual backend endpoint
    const result = await axios.get(
      "http://localhost:5000/api/admin/users/get"
    );
    return result?.data;
  }
);

export const updateUserRole = createAsyncThunk(
  "/admin/users/updateUserRole",
  async ({ id, role }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/users/role/${id}`,
      { role }
    );
    return result?.data;
  }
);

export const deleteUser = createAsyncThunk(
  "/admin/users/deleteUser",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/users/delete/${id}`
    );
    return result?.data;
  }
);

const AdminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      });
  },
});

export default AdminUsersSlice.reducer;