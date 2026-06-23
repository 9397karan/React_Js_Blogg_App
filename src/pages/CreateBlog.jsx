import { ImagePlus, Bold, Italic, Underline, Link } from "lucide-react";
import { useState } from "react";
import RichTextEditor from "../componenets/RichTextEditor";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import PhoneMockup from "../componenets/PhoneMockup";

export default function CreateBlog() {
  const categories = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Design",
    "Health",
  ];

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [coverImage, setCoverImage] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [words, setWords] = useState({})
  const { user } = useAuth()
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage({
        file,
        preview: URL.createObjectURL(file)
      })
    }
  }

  const handlePublish = async () => {
    // const { imageUrl } = await handleFileUpload(coverImage.file)
    // let blog = {}
    // if (imageUrl) {
    //   blog = {
    //     userId: user?.id,
    //     title,
    //     image: imageUrl,
    //     category: selectedCategory,
    //     content,
    //     tags,
    //   };
    // }


    // console.log(blog);

    console.log("WORDS:",words)
  };

  const calaulateTime = (content) => {
    const div = document.createElement('div')
    div.innerHTML = content
    const text = div.innerText || div.textContent || ""
    console.log(text)
    const words = text.trim().split(/\s+/).length

    return words;
  }

  const handleFileUpload = async (file) => {
    const fileName = `blogs/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(fileName, file);

    if (error) return { error };

    const { data: publicUrl } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    return {
      imageUrl: publicUrl.publicUrl,
    };
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Cover Image */}
          <label
            htmlFor="cover-image"
            className="border border-zinc-800 rounded-3xl h-64 flex items-center justify-center cursor-pointer overflow-hidden hover:border-zinc-600 transition"
          >
            <input
              id="cover-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {coverImage ? (
              <img
                src={coverImage.preview}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                  <ImagePlus size={28} />
                </div>

                <p className="text-zinc-400 mt-4">
                  Click to upload cover image
                </p>
              </div>
            )}
          </label>

          {/* Title */}
          <input
            type="text"
            placeholder="Enter your blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-5xl font-bold outline-none placeholder:text-zinc-500"
          />

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`badge badge-lg px-5 py-4 transition ${selectedCategory === item
                  ? "badge-primary"
                  : "badge-outline"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="border border-zinc-800 rounded-3xl overflow-hidden">

            <RichTextEditor content={content} setContent={setContent} setWords={setWords} />
          </div>
        </div>

        {/* Right Section */}
        <div>

          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sticky top-6">

            <h2 className="text-xl font-bold">
              Post Settings
            </h2>

            <p className="text-sm text-zinc-400 mt-1">
              Manage publishing details and metadata
            </p>



            {/* Tags */}
            <div className="mt-8">
              <label className="font-semibold">Tags</label>

              <input
                type="text"
                placeholder="Press comma or Enter to add tags"
                className="input input-bordered w-full mt-3 bg-black"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "," || e.key === "Enter") {
                    e.preventDefault();

                    const tag = tagInput.trim();

                    if (!tag) return;

                    if (tags.includes(tag)) {
                      setTagInput("");
                      return;
                    }

                    setTags((prev) => [...prev, tag]);
                    setTagInput("");
                  }

                  if (e.key === "Backspace" && tagInput === "") {
                    setTags((prev) => prev.slice(0, -1));
                  }
                }}
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="badge badge-primary badge-lg gap-2"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() =>
                        setTags((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Read Time */}
            <div className="border border-zinc-700 rounded-xl mt-8 p-4 flex justify-between">

              <div>
                <h3 className="font-semibold">
                  Estimated Read Time
                </h3>

                <p className="text-xs text-zinc-500">
                  Based on current content
                </p>
              </div>

              <span className="font-bold text-lg">
                {words.time} min
              </span>
              <span className="font-bold text-lg">
                {words.words} words
              </span>

            </div>

            {/* Buttons */}

            <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>open modal</button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box  border border-gray-900 rounded-xl">
                <div className="modal-action">
                  <form method="dialog">
            
                    <button className="btn">X</button>
                  </form>
                </div>
                <PhoneMockup title={title} content={content} coverImage={coverImage} tags={tags} category={selectedCategory} words={words}/>
                
                
              </div>
            </dialog>
            <button className="btn btn-primary w-full mt-8" onClick={handlePublish}>
              Publish Post
            </button>



          </div>

        </div>
      </div>
    </div>
  );
}