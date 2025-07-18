import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold text-indigo-600">
              WooSync
            </NavLink>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/products" className={linkClass}>
              Products
            </NavLink>
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
