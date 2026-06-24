import { Menu, House, NotebookPen, Plus, LayoutDashboard } from "lucide-react";
import {Link, NavLink, useNavigate} from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
    const {user,logout}=useAuth();
    const navigate=useNavigate()
    return (
        <div className="drawer bg-black">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

            {/* Page Content */}
            <div className="drawer-content">
                <div className="navbar  shadow-sm px-4">
                    <div className="navbar-start">
                        <label
                            htmlFor="mobile-drawer"
                            className="btn btn-ghost btn-circle md:hidden"
                        >
                            <Menu size={22} />
                        </label>

                        <Link to={"/"}><h1 className="text-xl font-bold ml-2">📝 BlogApp</h1></Link>
                    </div>

                    <div className="navbar-center hidden     md:flex">
                        <ul className="menu menu-horizontal gap-2">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `rounded-none border-b-2 ${isActive
                                            ? "border-white"
                                            : "border-transparent"
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/blogs"
                                    className={({ isActive }) =>
                                        `rounded-none border-b-2 ${isActive
                                            ? "border-white"
                                            : "border-transparent"
                                        }`
                                    }
                                >
                                    Blogs
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/create"
                                    className={({ isActive }) =>
                                        `rounded-none border-b-2 ${isActive
                                            ? "border-white"
                                            : "border-transparent"
                                        }`
                                    }
                                >
                                    Create
                                </NavLink>
                            </li>
                            {user && <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `rounded-none border-b-2 ${isActive
                                            ? "border-white"
                                            : "border-transparent"
                                        }`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>}
                        </ul>
                    </div>

                    <div className="navbar-end gap-2">
  {user ? (
    <>
      <div className="avatar">
        <div className="w-9 md:w-10 rounded-full">
          <img
            src={
              user?.user_metadata?.avatar_url ||
              "https://api.dicebear.com/10.x/pixel-art/svg?seed=Felix"
            }
            alt="Profile"
          />
        </div>
      </div>

      {/* Desktop only */}
      <button
        onClick={logout}
        className="btn btn-sm bg-red-700  md:inline-flex"
      >
        Logout
      </button>
    </>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="btn btn-sm bg-red-700"
    >
      Login
    </button>
  )}
</div>

                </div>

            </div>

            {/* Sliding Menu */}
            <div className="drawer-side">
                <label
                    htmlFor="mobile-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>

                <ul className="menu p-4 gap-5 w-52 min-h-full  text-base-content bg-black">
                    <li className="mb-4 text-2xl font-bold">📝 BlogApp</li>

                    <li>
                        <a href="/" className="text-xl">
                            <House size={18} />
                            Home
                        </a>
                    </li>

                    <li>
                        <a href="/blogs" className="text-xl">
                            <NotebookPen size={18} />
                            Blogs
                        </a>
                    </li>

                    <li>
                        <a href="/create" className="text-xl">
                            <Plus size={18} />
                            Create
                        </a>
                    </li>
                    {user && <li>
                        <a href="/dashboard" className="text-xl">
                            <LayoutDashboard size={18}/>
                            Dashboard
                        </a>
                    </li>}
                    <div className="divider"></div>

                    
                </ul>
            </div>
        </div>
    );
}