import { CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog.id}`}>

      <div className="card bg-zinc-900 border border-zinc-800 hover:border-primary transition hover:-translate-y-1">

        <figure>

          <img
            src={blog.image}
            alt={blog.title}
            className="h-56 w-full object-cover"
          />

        </figure>

        <div className="card-body">

          <div className="badge badge-primary">
            {blog.category}
          </div>

          <h2 className="card-title line-clamp-2">
            {blog.title}
          </h2>

          <div
            className="text-gray-400 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          />

          <div className="flex justify-between mt-5 text-sm">

            <div className="flex items-center gap-2">

              <Clock3 size={15} />

              {blog.read_time} min

            </div>

            <div className="flex items-center gap-2">

              <CalendarDays size={15} />

              {new Date(blog.created_at).toLocaleDateString()}

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
}