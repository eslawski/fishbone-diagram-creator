import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import DiagramPage from "./components/pages/DiagramPage";
import BackendTestPage from "./components/pages/BackendTestPage";
import HomePage from "./components/pages/HomePage";
import { store } from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="diagram/:diagramId" element={<DiagramPage />} />
            <Route path="backend-test" element={<BackendTestPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
