import { router } from "./routes/index.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductProvider } from "./context/ProductContext";
import "./App.css";

function App() {
  return (
    <>
      <AuthProvider>
        <ProductProvider>
          <RouterProvider router={router} />
        </ProductProvider>
      </AuthProvider>
    </>
  );
}

export default App;
