import { useEffect } from "react";
import api from "./api/axios";

function App() {
  useEffect(() => {
    api.get("/test")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>EcomPulse 🚀</h1>;
}

export default App;