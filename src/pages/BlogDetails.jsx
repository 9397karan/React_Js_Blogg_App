import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, Clock3, ArrowLeft, ImageOff } from "lucide-react";
import { supabase } from "../services/supabase";

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchBlog() {
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
        .eq("id", id)
        .single();

      if (!isMounted) return;

      if (error || !data) {
        console.error(error);
        setError(true);
        setLoading(false);
        return;
      }

      setBlog(data);
      setLoading(false);
    }

    fetchBlog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Safely parse tags whether they're already an array or a JSON string
  const tags = (() => {
    if (!blog?.tags) return [];
    if (Array.isArray(blog.tags)) return blog.tags;
    try {
      return JSON.parse(blog.tags);
    } catch {
      return [];
    }
  })();

  if (loading) {
    return <BlogSkeleton />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center gap-4">
        <h1 className="text-3xl font-bold">Couldn't load this post</h1>
        <p className="text-gray-400 max-w-md">
          The post may have been removed, or there was a problem reaching the
          server. Try again or head back to all posts.
        </p>
        <Link to="/blogs" className="btn btn-primary mt-2">
          <ArrowLeft size={18} />
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Cover */}
      <div className="relative w-full h-[260px] sm:h-[350px] md:h-[420px] overflow-hidden bg-neutral-900">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <ImageOff size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        {/* Floating back button over the cover */}
        <Link
          to="/blogs"
          aria-label="Back to all blogs"
          className="btn btn-circle btn-sm sm:btn-md bg-black/50 border-none hover:bg-black/70 backdrop-blur-sm absolute top-4 left-4 sm:top-6 sm:left-6"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Category + read time */}
        <div className="flex flex-wrap gap-3 items-center">
          {blog.category && (
            <span className="badge badge-primary">{blog.category}</span>
          )}

          {blog.read_time && (
            <span className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock3 size={16} />
              {blog.read_time} min read
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-5 leading-tight">
          {blog.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-4 mt-8">
          <div className="avatar">
            <div className="w-12 sm:w-14 rounded-full ring ring-white/10">
              {blog.profile?.avatar ? (
                <img
                  src={blog.profile.avatar}
                  alt={blog.profile?.name ?? "Author"}
                />
              ) : (
                <div className="bg-neutral-800 w-full h-full flex items-center justify-center text-sm font-semibold">
                  {blog.profile?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">
              {blog.profile?.name ?? "Unknown author"}
            </h3>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <CalendarDays size={15} />
              {blog.created_at
                ? new Date(blog.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Unknown date"}
            </div>
          </div>
        </div>

        {/* Content */}
        <article
          className="prose prose-invert prose-headings:font-semibold max-w-none mt-10"
          dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-white/10">
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge badge-outline badge-lg hover:badge-primary transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-14 flex justify-center">
          <Link to="/blogs" className="btn btn-outline">
            <ArrowLeft size={18} />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="bg-black min-h-screen text-white animate-pulse">
      <div className="w-full h-[260px] sm:h-[350px] md:h-[420px] bg-neutral-900" />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex gap-3">
          <div className="h-6 w-20 bg-neutral-800 rounded-full" />
          <div className="h-6 w-28 bg-neutral-800 rounded-full" />
        </div>
        <div className="h-10 w-3/4 bg-neutral-800 rounded" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-800" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-neutral-800 rounded" />
            <div className="h-3 w-24 bg-neutral-800 rounded" />
          </div>
        </div>
        <div className="space-y-3 mt-8">
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-4 w-5/6 bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
}