import { router } from "./routes/index.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import './App.css'

function App() {


  return (
    <>
     <AuthProvider>
        <RouterProvider router={router} />
     </AuthProvider>
    </>
  )
}

export default App
