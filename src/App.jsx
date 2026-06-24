import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./componenets/Navbar"
import Blogs from './pages/Blogs'
import CreateBlog from './pages/CreateBlog'
import ProtectedRoute from "./services/ProtectedRoute"
import BlogDetails from "./pages/BlogDetails"
import Dashboard from "./pages/Dashboard"
import EditBlog from "./pages/EditBlog"

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route element={<ProtectedRoute/>}>
        <Route path="/blogs" element={<Blogs/>}/>
        <Route path="/create" element={<CreateBlog/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/blog/:id" element={<BlogDetails/>}/>
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
