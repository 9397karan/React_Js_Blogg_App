import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, ImageOff, AlertCircle } from "lucide-react";

import { supabase } from "../services/supabase";
import Navbar from "../componenets/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [blogToDelete, setBlogToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted) return;

      if (error || !data?.user) {
        setUser(null);
      } else {
        setUser(data.user);
      }
      setCheckingAuth(false);
    }

    getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    async function fetchMyBlogs() {
      setLoading(true);
      setError(false);

      const { data, error } = await supabase
        .from("blogs")
        .select(`
          *,
          profile (
            name,
            avatar
          )
        `)
        .eq("user_id", user.id) 
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error(error);
        setError(true);
        setLoading(false);
        return;
      }

      setBlogs(data ?? []);
      setLoading(false);
    }

    fetchMyBlogs();

    return () => {
      isMounted = false;
    };
  }, [user]);

  async function handleConfirmDelete() {
    if (!blogToDelete) return;

    const id = blogToDelete.id;
    setDeletingId(id);
    setDeleteError(null);

  
    const previousBlogs = blogs;
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    setBlogToDelete(null);

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      console.error(error);

      setBlogs(previousBlogs);
      setDeleteError("Couldn't delete that post. Please try again.");
    }

    setDeletingId(null);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center text-center gap-4 py-32 px-6">
          <h1 className="text-2xl font-semibold">You need to log in</h1>
          <p className="text-gray-400 max-w-sm">
            Log in to view and manage the blogs you've written.
          </p>
          <Link to="/login" className="btn btn-primary mt-2">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
   

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Blogs</h1>
            {!loading && !error && (
              <p className="text-gray-400 mt-1">
                {blogs.length} {blogs.length === 1 ? "post" : "posts"}
              </p>
            )}
          </div>

          <Link to="/create" className="btn btn-primary">
            <Plus size={18} />
            New blog
          </Link>
        </div>

        {deleteError && (
          <div className="alert alert-error mb-6 text-sm">
            <AlertCircle size={18} />
            {deleteError}
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="text-center text-gray-400 py-16">
            Something went wrong loading your blogs. Please refresh the page.
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-400 py-16 flex flex-col items-center gap-4">
            <p>You haven't written any blogs yet.</p>
            <Link to="/create" className="btn btn-outline">
              <Plus size={18} />
              Write your first blog
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800/80 transition-colors"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <ImageOff size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="font-semibold hover:underline line-clamp-1"
                  >
                    {blog.title}
                  </Link>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 flex-wrap">
                    {blog.category && (
                      <span className="badge badge-outline badge-sm">
                        {blog.category}
                      </span>
                    )}
                    {blog.created_at && (
                      <span>
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    )}
                    {blog.read_time && <span>· {blog.read_time} min read</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/edit-blog/${blog.id}`}
                    aria-label="Edit post"
                    className="btn btn-ghost btn-sm btn-square"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    type="button"
                    aria-label="Delete post"
                    className="btn btn-ghost btn-sm btn-square text-red-400 hover:text-red-300"
                    disabled={deletingId === blog.id}
                    onClick={() => setBlogToDelete(blog)}
                  >
                    {deletingId === blog.id ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <div className={`modal ${blogToDelete ? "modal-open" : ""}`}>
        <div className="modal-box bg-zinc-900 text-white">
          <h3 className="font-bold text-lg">Delete this post?</h3>
          <p className="py-4 text-gray-400">
            "{blogToDelete?.title}" will be permanently deleted. This can't be
            undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setBlogToDelete(null)}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleConfirmDelete}>
              Delete
            </button>
          </div>
        </div>
        <button
          className="modal-backdrop"
          aria-label="Close"
          onClick={() => setBlogToDelete(null)}
        />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4"
        >
          <div className="w-20 h-20 rounded-lg bg-zinc-800 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 bg-zinc-800 rounded" />
            <div className="h-3 w-1/3 bg-zinc-800 rounded" />
          </div>
          <div className="w-8 h-8 bg-zinc-800 rounded" />
          <div className="w-8 h-8 bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  );
}