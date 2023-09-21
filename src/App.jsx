import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SectorsInfo from "./sectorsinfo/sectorsinfo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ToastContainer />
      <SectorsInfo />
    </>
  );
}

export default App;
