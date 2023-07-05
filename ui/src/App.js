import "./App.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Signup from "./Signup";
import HomeRoute from "./HomeRoute";
import SampleRequireLogin from "./routes/SampleRequireLogin";
import DashboardLayout from "./DashboardLayout";
import MainLayout from "./MainLayout";
import Products from "./routes/Products";
import Users from "./routes/Users";
import Product from "./routes/Product";
import User from "./routes/User";
import CurrentUser from "./routes/CurrentUser";

function SomeOtherPage() {
  return <div>Some other page</div>;
}

function SomeOtherPage2() {
  return <div>Some other page 2</div>;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeRoute />} />
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<SampleRequireLogin />} />
            <Route path="someotherpage" element={<SomeOtherPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/someotherpage2" element={<SomeOtherPage2 />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/currentuser" element={<CurrentUser />} />
        </Route>
      </Routes>
    </div>
  );
  //
}

export default App;
