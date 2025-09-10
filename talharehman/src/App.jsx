
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Components/Home/Home.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'
import About from './Components/About/About.jsx'
import Certificate from './Components/Certificate/Certificate.jsx'
import Projects from './Components/Projects/Projects.jsx'
import Contact from './Components/Contact/Contact.jsx'


function App() {
  return (
    <>
      <BrowserRouter>

        <Navbar />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/certificates' element={<Certificate />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/contacts' element={<Contact />} />
        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
