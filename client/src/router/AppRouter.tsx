import React from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "../pages/ProductsPage";
import OrdersPage from "../pages/OrdersPage";

const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
  );
};

export default AppRouter;
