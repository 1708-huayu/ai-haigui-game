import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import Result from './pages/Result'
import EditStory from './pages/EditStory'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/edit/:id" element={<EditStory />} />
      </Routes>
    </Router>
  )
}

export default App