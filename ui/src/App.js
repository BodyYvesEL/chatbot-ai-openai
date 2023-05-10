import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import IndexPage from './components/IndexPage'
import Pricing from './components/Pricing'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Dashboard2 from './components/Dashboard2'
import UpgradePRO from './components/UpgradePRO'
import UpgradeSTANDARD from './components/UpgradeSTANDARD'
import { FailurePage, SuccessPage } from './components/StripePaymentResponse'
import Directories from './components/Directories'
import Settings from './components/Settings'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard2" element={<Dashboard2 />} />
            <Route path="/upgradePRO" element={<UpgradePRO />} />
            <Route path="/upgradeSTANDARD" element={<UpgradeSTANDARD />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<FailurePage />} />
            <Route path="directories" element={<Directories />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  )
}

export default App
