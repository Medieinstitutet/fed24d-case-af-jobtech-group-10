import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import About from './pages/About';
import JobDetail from './pages/JobDetail';
import Layout from './pages/Layout';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/job/:id" element={<JobDetail />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
