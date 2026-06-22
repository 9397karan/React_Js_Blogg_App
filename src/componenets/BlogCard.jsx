export default function BlogCard({ blog }) {
  return (
    <div className="card border border-gray-800 shadow-md hover:shadow-xl transition">

      <figure>
        <img
          src={blog.image}
          alt={blog.title}
          className="h-56 w-full object-cover"
        />
      </figure>

      <div className="card-body">

        <div className="badge ">
          {blog.category}
        </div>

        <h2 className="card-title">
          {blog.title}
        </h2>

        <p className="text-base-content/70">
          {blog.desc}
        </p>

        <div className="flex justify-between items-center mt-6">

          <div className="flex items-center gap-3">

            <div className="avatar">

              <div className="w-10 rounded-full">

                <img src={blog.avatar} />

              </div>

            </div>

            <div>

              <h3 className="font-semibold">
                {blog.author}
              </h3>

              <p className="text-xs">
                {blog.date}
              </p>

            </div>

          </div>

          <button className="btn btn-ghost btn-sm">
            Read More
          </button>

        </div>

      </div>

    </div>
  );
}