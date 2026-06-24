import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import { supabase } from "../services/supabase";
import BlogCard from "../componenets/BlogCard";
import Navbar from "../componenets/Navbar";
import SearchBar from "../componenets/SearchBar";

const HOME_BLOG_LIMIT = 6;

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        .order("created_at", { ascending: false })
        .limit(HOME_BLOG_LIMIT);

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

  const categories = [...new Set(blogs.map((b) => b.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-black text-white">
  

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.25), transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <span className="badge badge-outline gap-1 mb-5 py-3 px-4">
            <Sparkles size={14} />
            Fresh stories, every week
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="text-base-content/70 text-lg mt-5 max-w-xl mx-auto">
            Discover stories, ideas and insights from writers around the world.
          </p>

          

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map((category) => (
                <span key={category} className="badge badge-ghost">
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Latest Posts</h2>

          <Link
            to="/blogs"
            className="link link-hover flex items-center gap-1 text-sm text-base-content/70 hover:text-white"
          >
            View all posts
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <HomeSkeleton />
        ) : error ? (
          <div className="text-center text-gray-400 py-16">
            Something went wrong loading posts. Please refresh the page.
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            No posts published yet — check back soon.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link to="/blogs" className="btn btn-primary">
              Browse all posts
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {Array.from({ length: HOME_BLOG_LIMIT }).map((_, i) => (
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