import { Menu, House, NotebookPen, Plus } from "lucide-react";

export default function Navbar() {
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

                        <h1 className="text-xl font-bold ml-2">📝 BlogApp</h1>
                    </div>

                    <div className="navbar-center hidden md:flex">
                        <ul className="menu menu-horizontal gap-2">
                            <li><a>Home</a></li>
                            <li><a>Blogs</a></li>
                            <li><a>Create</a></li>
                        </ul>
                    </div>

                    <div className="navbar-end gap-6">
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://i.pravatar.cc/100?img=5" alt="Profile" />
                            </div>
                        </div>
                        <button className="btn btn-sm bg-red-700 text-md hidden md:inline-flex">
                            Logout
                        </button>
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

                <ul className="menu p-4 w-52 min-h-full  text-base-content bg-black">
                    <li className="mb-4 text-xl font-bold">📝 BlogApp</li>

                    <li>
                        <a>
                            <House size={18} />
                            Home
                        </a>
                    </li>

                    <li>
                        <a>
                            <NotebookPen size={18} />
                            Blogs
                        </a>
                    </li>

                    <li>
                        <a>
                            <Plus size={18} />
                            Create
                        </a>
                    </li>
                    <div className="divider"></div>

                    <li>
                        <a className="text-error">
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}