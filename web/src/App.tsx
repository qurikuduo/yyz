import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Intake from './pages/Intake'
import Assessment from './pages/Assessment'
import ComprehensiveAssessment from './pages/ComprehensiveAssessment'
import Result from './pages/Result'
import SharedResult from './pages/SharedResult'
import Knowledge from './pages/Knowledge'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intake/:schemeId" element={<Intake />} />
        <Route path="/assessment/comprehensive" element={<ComprehensiveAssessment />} />
        <Route path="/assessment/:schemeId" element={<Assessment />} />
        <Route path="/result" element={<Result />} />
        <Route path="/r/:token" element={<SharedResult />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
