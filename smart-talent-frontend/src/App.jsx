
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import UploadView from "./components/UploadView";
import RankingView from "./components/RankingView";
import Header from "./components/Header";
import Jobview from "./components/jobview";
import Fullranking from "./components/fullranking";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadView />} />

          <Route path="/job/:jobId" element={<Jobview />} />
          <Route path="/job/new" element={<Jobview />} />

          <Route path="/ranking/:jobId" element={<RankingView />} />
          <Route path="/ranking-full/:jobId" element={<Fullranking />} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;