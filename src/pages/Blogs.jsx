import { useEffect, useMemo, useState } from "react";
import { Search, X, AlertCircle } from "lucide-react";

import { supabase } from "../services/supabase";
import BlogCard from "../componenets/BlogCard";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogs() {
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

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBlogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return blogs;
    return blogs.filter((blog) =>
      blog.title?.toLowerCase().includes(query)
    );
  }, [blogs, search]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">Explore Blogs</h1>

        {!loading && !error && (
          <p className="text-gray-400 mb-8">
            {blogs.length} {blogs.length === 1 ? "post" : "posts"}
            {search && ` · ${filteredBlogs.length} matching "${search}"`}
          </p>
        )}

        <div className="relative mb-10">
          <Search
            className="absolute left-4 top-3 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search blogs..."
            aria-label="Search blogs"
            className="input input-bordered w-full pl-12 pr-12 bg-zinc-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {loading ? (
          <BlogsSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center text-center text-gray-400 gap-4 py-16">
            <AlertCircle size={32} />
            <p>Something went wrong loading blogs. Please try again.</p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            {blogs.length === 0 ? (
              <p>No blogs published yet.</p>
            ) : (
              <>
                <p>No blogs match "{search}".</p>
                <button
                  className="btn btn-ghost btn-sm mt-3"
                  onClick={() => setSearch("")}
                >
                  Clear search
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlogsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-zinc-900">
          <div className="h-44 bg-zinc-800" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-zinc-800 rounded" />
            <div className="h-3 w-1/2 bg-zinc-800 rounded" />
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-8 rounded-full bg-zinc-800" />
              <div className="h-3 w-20 bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}