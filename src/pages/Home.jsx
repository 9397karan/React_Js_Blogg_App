import BlogCard from "../componenets/BlogCard";
import Navbar from "../componenets/Navbar";
import SearchBar from "../componenets/SearchBar";


const blogs = [
  {
    id: 1,
    category: "Technology",
    title: "Getting Started with SwiftUI",
    desc: "Learn the essentials of building beautiful interfaces with modern design patterns.",
    author: "Sarah Chen",
    date: "Jan 12, 2026",
    image: "https://cdn.europosters.eu/image/1300/image/750/wall-murals/marvel-spiderman-10590-i55636.jpg",
    avatar: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    category: "Design",
    title: "Designing Better Mobile Reading Experiences",
    desc: "A practical guide to typography, spacing, and content hierarchy.",
    author: "Alex Morgan",
    date: "Feb 03, 2026",
    image: "https://cdn.europosters.eu/image/1300/image/750/wall-murals/marvel-spiderman-10590-i55636.jpg",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    id: 3,
    category: "Productivity",
    title: "Top Productivity Tips for Writers",
    desc: "Discover simple workflows and habits to help you stay productive.",
    author: "Priya Patel",
    date: "Mar 18, 2026",
    image: "https://cdn.europosters.eu/image/1300/image/750/wall-murals/marvel-spiderman-10590-i55636.jpg",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen ">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="text-center">
          <h1 className="text-5xl font-bold">
            Explore Our Blog
          </h1>

          <p className="text-base-content/70 mt-4">
            Discover stories, ideas and insights from writers around the world.
          </p>
        </div>

        <SearchBar />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

          {blogs.map(blog=>(
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}

        </div>

       

      </div>

    </div>
  );
}