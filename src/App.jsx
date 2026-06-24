import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./componenets/Navbar"
import Blogs from './pages/Blogs'
import CreateBlog from './pages/CreateBlog'
import ProtectedRoute from "./services/ProtectedRoute"
import BlogDetails from "./pages/BlogDetails"

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route element={<ProtectedRoute/>}>
        <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/create" element={<CreateBlog/>}/>
        <Route path="/blog/:id" element={<BlogDetails/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
