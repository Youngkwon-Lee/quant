import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import RealtimeAnalysis from './components/RealtimeAnalysis'
import TechnicalAnalysis from './components/TechnicalAnalysis'
import Portfolio from './components/Portfolio'
import Alerts from './components/Alerts'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/realtime" element={<RealtimeAnalysis />} />
            <Route path="/technical" element={<TechnicalAnalysis />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App