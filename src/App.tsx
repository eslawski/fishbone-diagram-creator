import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import DiagramPage from "./components/pages/DiagramPage";
import BackendTest from "./components/BackendTest";
import { store } from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<div>Welcome to Fishbone Creator</div>} />
            <Route path="new" element={<DiagramPage />} />
            <Route path="backend-test" element={<BackendTest />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
