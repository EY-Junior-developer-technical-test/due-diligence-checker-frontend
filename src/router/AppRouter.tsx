import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { LoginPage } from '../app/auth/pages/LoginPage'
import { RegisterPage } from '../app/auth/pages/RegisterPage'
import { ProtectedRoute } from '../app/auth/components/ProtectedRoute'
import { HomePage } from '../app/shared/components/HomePage'
import { CreateSupplierPage } from '../app/suppliers/pages/CreateSupplierPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers/new"
          element={
            <ProtectedRoute>
              <CreateSupplierPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
