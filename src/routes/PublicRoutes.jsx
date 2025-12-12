import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/publicPages/Home";
import Login from "@/pages/publicPages/Login";
import Contact from "@/pages/publicPages/Contact";
import About from "@/pages/publicPages/About";


export default function PublicRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
    </MainLayout>
  );
}
