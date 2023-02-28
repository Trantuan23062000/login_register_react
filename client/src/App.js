import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

import Login from "./components/login_component";
import SignUp from "./components/signup_component";
import UserDetails from "./components/userdetails";
import userHome from "./components/userHome"
import Forgot from "./components/resetpassword"



function App() {
  const isLoggedIn = window.localStorage.getItem("LoginIn");
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/login'}>
              Home
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/login'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/register'}>
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route exact path="/" element={isLoggedIn === "true" ? < UserDetails /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/UserDetails" element={<UserDetails />} />
          <Route path="/userHome" element={<userHome />} />
          <Route path="/forgot-password" element={<Forgot />} />
        </Routes>

      </div>
    </Router>
  )
}

export default App
