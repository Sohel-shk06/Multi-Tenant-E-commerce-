import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminLogin from './login'
import SetPassword from './SetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/setpassword" element={<SetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App