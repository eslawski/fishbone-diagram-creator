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
            <Route index element={
              <div style={{ textAlign: "center", padding: "40px" }}>
                <h1>Welcome to Fishbone Creator</h1>
                <div style={{ marginTop: "20px" }}>
                  <a href="/diagram/cd52c7e2-0712-4646-9fbb-f3de4b0cc756" style={{ padding: "10px 20px", backgroundColor: "#52c41a", color: "white", textDecoration: "none", borderRadius: "6px" }}>
                    View Example Diagram
                  </a>
                </div>
              </div>
            } />
            <Route path="diagram/:diagramId" element={<DiagramPage />} />
            <Route path="backend-test" element={<BackendTest />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
