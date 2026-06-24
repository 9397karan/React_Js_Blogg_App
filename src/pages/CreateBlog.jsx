import { ImagePlus, Eye, EyeOff, X, Tag, Clock, FileText, Send, ChevronDown } from "lucide-react";
import { useState } from "react";
import RichTextEditor from "../componenets/RichTextEditor";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import PhoneMockup from "../componenets/PhoneMockup";
import { useNavigate } from "react-router-dom";

export default function CreateBlog() {
  const navigate = useNavigate();

  const categories = ["Technology", "Lifestyle", "Travel", "Design", "Health"];

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Technology");
  const [coverImage, setCoverImage] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [words, setWords] = useState({});
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleFileUpload = async (file) => {
    const fileName = `blogs/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("photos").upload(fileName, file);
    if (error) return { error };
    const { data: publicUrl } = supabase.storage.from("photos").getPublicUrl(fileName);
    return { imageUrl: publicUrl.publicUrl };
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please add a title before publishing.");
      return;
    }
    if (!coverImage) {
      alert("Please select a cover image.");
      return;
    }
    if (!content.trim()) {
      alert("Please write some content before publishing.");
      return;
    }

    setPublishing(true);

    try {
      const { imageUrl, error } = await handleFileUpload(coverImage.file);
      if (error) { console.error(error); return; }

      const blog = {
        user_id: user?.id,
        title,
        image: imageUrl,
        category: selectedCategory,
        content,
        tags,
        read_time: words.time,
        word_count: words.words,
      };

      const { error: insertError } = await supabase.from("blogs").insert(blog).select();
      if (insertError) { console.error(insertError); return; }

      setPublishSuccess(true);
      setTimeout(() => navigate("/blogs"), 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  /* ── Publishing overlay ── */
  if (publishing) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-gray-400 text-sm tracking-wide">Publishing your post…</p>
      </div>
    );
  }

  if (publishSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Send size={20} className="text-blue-400" />
        </div>
        <p className="text-white font-semibold">Post published!</p>
        <p className="text-gray-500 text-sm">Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
  

      <div className="min-h-screen sm:px-6 py-8">
        {showPreview ? (

          <div className="flex flex-col items-center">
          
            <PhoneMockup
              title={title}
              content={content}
              coverImage={coverImage}
              tags={tags}
              category={selectedCategory}
              words={words}
            />
              <button
              onClick={() => setShowPreview(false)}
              className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <EyeOff size={14} />
              Back to editor
            </button>
            
          </div>
        ) : (
          /* ── Editor layout ── */
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">

            {/* ── Left: Main editor ── */}
            <div className="space-y-5">

              {/* Cover image */}
              <label
                htmlFor="cover-image"
                className={`group relative block rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  coverImage
                    ? "h-72"
                    : "h-52 border-2 border-dashed border-white/10 hover:border-blue-500/40 bg-[#111111]"
                }`}
              >
                <input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {coverImage ? (
                  <>
                    <img
                      src={coverImage.preview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-white bg-black/60 px-4 py-2 rounded-full">
                        <ImagePlus size={14} />
                        Change cover
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 group-hover:text-gray-300 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#1E1E1E] group-hover:bg-[#2A2A2A] flex items-center justify-center transition-colors">
                      <ImagePlus size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Upload a cover image</p>
                      <p className="text-xs text-gray-600 mt-0.5">PNG, JPG, WEBP · Recommended 1200×630</p>
                    </div>
                  </div>
                )}
              </label>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedCategory(item)}
                    className={`text-xs font-medium px-4 py-1.5 rounded-full border transition-all ${
                      selectedCategory === item
                        ? "bg-blue-500/10 border-blue-500/40 text-blue-400"
                        : "border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Title */}
              <input
                type="text"
                placeholder="Your post title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-4xl sm:text-5xl font-bold outline-none placeholder:text-white/15 leading-tight"
              />

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Rich text editor */}
              <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#111111]">
                <RichTextEditor content={content} setContent={setContent} setWords={setWords} />
              </div>
            </div>

            {/* ── Right: Settings panel ── */}
            <div className="space-y-4">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 sticky top-20 space-y-6">

                <div>
                  <h2 className="text-sm font-semibold text-white">Post settings</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Metadata and publishing options</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1A1A1A] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-white">{words.words ?? 0}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Words</p>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-white">{words.time ?? 0}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Min read</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Tags */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={11} />
                    Tags
                  </label>

                  <div className={`mt-2 flex flex-wrap gap-1.5 ${tags.length > 0 ? "mb-2" : ""}`}>
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => setTags((prev) => prev.filter((_, i) => i !== index))}
                          className="hover:text-white transition-colors ml-0.5"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Add tags (Enter or comma)"
                    className="w-full mt-2 bg-[#1A1A1A] border border-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500/30 transition-colors"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "," || e.key === "Enter") {
                        e.preventDefault();
                        const tag = tagInput.trim();
                        if (!tag || tags.includes(tag)) { setTagInput(""); return; }
                        setTags((prev) => [...prev, tag]);
                        setTagInput("");
                      }
                      if (e.key === "Backspace" && tagInput === "") {
                        setTags((prev) => prev.slice(0, -1));
                      }
                    }}
                  />
                  {tags.length === 0 && (
                    <p className="text-xs text-gray-600 mt-1.5">No tags yet. Tags help readers find your post.</p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Category display */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</label>
                  <div className="mt-2 flex items-center justify-between bg-[#1A1A1A] border border-white/5 rounded-xl px-3 py-2">
                    <span className="text-sm text-white">{selectedCategory}</span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">Change by selecting a category above.</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-300 border border-white/10 hover:border-white/20 hover:text-white py-2.5 rounded-xl transition-all"
                  >
                    <Eye size={14} />
                    Preview post
                  </button>

                  <button
                    onClick={handlePublish}
                    className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <Send size={14} />
                    Publish post
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
} 