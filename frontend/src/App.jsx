import { router } from "./routes/index.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductProvider } from "./context/ProductContext";
import { CategoryProvider } from "./context/CategoryContext";
import "./App.css";

function App() {
  return (
    <>
      <AuthProvider>
        <ProductProvider>
          <CategoryProvider>
            <RouterProvider router={router} />
          </CategoryProvider>
        </ProductProvider>
      </AuthProvider>
    </>
  );
}

export default App;
