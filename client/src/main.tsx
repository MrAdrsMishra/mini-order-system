import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProductMainPage from './pages/ProductMainPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import App from './App';
import AddProductPage from './pages/AddProjectPage';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ProductMainPage />
      },
      {
        path: 'products',
        element: <ProductMainPage />
      },
      {
        path: 'products/:product_slug/:product_id',
        element: <ProductDetailPage /> 
      },
      {
        path: 'checkout/:product_id',
        element: <CheckoutPage />
      },
      {
        path: 'add-product',
        element: <AddProductPage />
      }
    ]
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
