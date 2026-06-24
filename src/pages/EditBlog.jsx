import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImagePlus, X, AlertCircle } from "lucide-react";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import RichTextEditor from "../componenets/RichTextEditor";
import PhoneMockup from "../componenets/PhoneMockup";

export default function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const categories = [
        "Technology",
        "Lifestyle",
        "Travel",
        "Design",
        "Health",
    ];

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [saveError, setSaveError] = useState(null);

    const [title, setTitle] = useState("");
    const [titleTouched, setTitleTouched] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Technology");

    // coverImage is either null (no image) or { preview, file }
    const [coverImage, setCoverImage] = useState(null);
    const previousBlobUrl = useRef(null);

    const [content, setContent] = useState("");

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");

    const [words, setWords] = useState({
        time: 1,
        words: 0,
    });

    useEffect(() => {
        fetchBlog();
        // Revoke any blob preview URL we created when the component unmounts.
        return () => {
            if (previousBlobUrl.current) {
                URL.revokeObjectURL(previousBlobUrl.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchBlog() {
        setLoading(true);
        setLoadError(null);

        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.log(error);
            setLoadError("We couldn't load this blog. Redirecting you back to your blogs.");
            setTimeout(() => navigate("/blogs"), 1500);
            return;
        }

        if (data.user_id !== user.id) {
            navigate("/blogs");
            return;
        }

        setTitle(data.title ?? "");
        setSelectedCategory(data.category ?? categories[0]);
        setContent(data.content ?? "");

        setWords({
            time: data.read_time ?? 1,
            words: data.word_count ?? 0,
        });

        setTags(data.tags ? JSON.parse(data.tags) : []);

        setCoverImage(
            data.image ? { preview: data.image, file: null } : null
        );

        setLoading(false);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Clean up the previous blob preview before creating a new one.
        if (previousBlobUrl.current) {
            URL.revokeObjectURL(previousBlobUrl.current);
        }

        const preview = URL.createObjectURL(file);
        previousBlobUrl.current = preview;

        setCoverImage({ file, preview });
        // Reset the input so selecting the same file again still fires onChange.
        e.target.value = "";
    };

    const handleRemoveImage = () => {
        if (previousBlobUrl.current) {
            URL.revokeObjectURL(previousBlobUrl.current);
            previousBlobUrl.current = null;
        }
        setCoverImage(null);
    };

    const uploadImage = async () => {
        if (!coverImage?.file) {
            return coverImage?.preview ?? null;
        }

        const fileName = `blogs/${Date.now()}-${coverImage.file.name}`;

        const { error } = await supabase.storage
            .from("photos")
            .upload(fileName, coverImage.file);

        if (error) {
            console.log(error);
            return null;
        }

        const { data } = supabase.storage
            .from("photos")
            .getPublicUrl(fileName);

        return data.publicUrl;
    };

    const handleTagKeyDown = (e) => {
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
    };

    const removeTag = (index) => {
        setTags((prev) => prev.filter((_, i) => i !== index));
    };

    const isTitleEmpty = title.trim().length === 0;

    const handleUpdate = async () => {
        setTitleTouched(true);
        setSaveError(null);

        if (isTitleEmpty) {
            setSaveError("Give your post a title before saving.");
            return;
        }

        setSaving(true);

        try {
            let imageUrl = coverImage?.preview ?? null;

            if (coverImage?.file) {
                imageUrl = await uploadImage();

                if (!imageUrl) {
                    setSaveError("We couldn't upload your cover image. Try again.");
                    setSaving(false);
                    return;
                }
            }

            const { error } = await supabase
                .from("blogs")
                .update({
                    title: title.trim(),
                    image: imageUrl,
                    category: selectedCategory,
                    content,
                    tags: JSON.stringify(tags),
                    read_time: words.time,
                    word_count: words.words,
                })
                .eq("id", id)
                .select();

            if (error) {
                console.log(error);
                setSaveError("We couldn't save your changes. Please try again.");
                return;
            }

            navigate(`/blog/${id}`);
        } catch (err) {
            console.log(err);
            setSaveError("Something went wrong while saving. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm("Discard your changes and go back?")) {
            navigate(`/blog/${id}`);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col gap-4 justify-center items-center bg-black">
                <span className="loading loading-spinner loading-lg"></span>
                {loadError && (
                    <p className="text-zinc-400 text-sm">{loadError}</p>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-8">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Cover image */}
                    <div className="relative group border border-zinc-800 rounded-3xl h-64 overflow-hidden">
                        <label
                            htmlFor="cover-image"
                            className="absolute inset-0 flex justify-center items-center cursor-pointer"
                        >
                            <input
                                id="cover-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                                aria-label="Upload cover image"
                            />

                            {coverImage?.preview ? (
                                <>
                                    <img
                                        src={coverImage.preview}
                                        alt="Blog cover"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="text-sm font-medium flex items-center gap-2">
                                            <ImagePlus size={18} />
                                            Change cover
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-400">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <ImagePlus size={28} />
                                    </div>
                                    <p className="mt-4">Upload cover</p>
                                    <p className="text-xs text-zinc-500 mt-1">
                                        Recommended 1200×630px
                                    </p>
                                </div>
                            )}
                        </label>

                        {coverImage?.preview && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveImage();
                                }}
                                aria-label="Remove cover image"
                                className="btn btn-circle btn-sm absolute right-3 top-3 bg-black/60 border-none hover:bg-black/80"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <input
                            type="text"
                            value={title}
                            placeholder="Untitled post"
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={() => setTitleTouched(true)}
                            className={`w-full bg-transparent text-4xl sm:text-5xl font-bold outline-none placeholder:text-zinc-700 ${
                                titleTouched && isTitleEmpty
                                    ? "border-b-2 border-error pb-2"
                                    : ""
                            }`}
                            aria-invalid={titleTouched && isTitleEmpty}
                        />
                        {titleTouched && isTitleEmpty && (
                            <p className="text-error text-sm mt-2 flex items-center gap-1">
                                <AlertCircle size={14} />
                                A title is required.
                            </p>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-3" role="group" aria-label="Category">
                        {categories.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setSelectedCategory(item)}
                                aria-pressed={selectedCategory === item}
                                className={`badge badge-lg px-5 py-4 ${
                                    selectedCategory === item
                                        ? "badge-primary"
                                        : "badge-outline"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <RichTextEditor
                        content={content}
                        setContent={setContent}
                        setWords={setWords}
                    />
                </div>

                {/* Sidebar */}
                <div>
                    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 lg:sticky lg:top-6">
                        <h2 className="text-xl font-bold">Edit blog</h2>
                        <p className="text-sm text-zinc-400 mt-1">
                            Update your blog and save changes.
                        </p>

                        {/* Tags */}
                        <div className="mt-8">
                            <label htmlFor="tag-input" className="font-semibold">
                                Tags
                            </label>
                            <input
                                id="tag-input"
                                type="text"
                                placeholder="Press comma or Enter to add"
                                className="input input-bordered w-full mt-3 bg-black"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                            />

                            <div className="flex flex-wrap gap-2 mt-4">
                                {tags.map((tag, index) => (
                                    <div
                                        key={tag}
                                        className="badge badge-primary badge-lg gap-2"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            aria-label={`Remove tag ${tag}`}
                                            className="leading-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Read time */}
                        <div className="border border-zinc-700 rounded-xl mt-8 p-4 flex justify-between">
                            <div>
                                <h3 className="font-semibold">Estimated read time</h3>
                                <p className="text-xs text-zinc-500">Auto calculated</p>
                            </div>
                            <div className="text-right">
                                <h2 className="font-bold">{words.time} min</h2>
                                <p>{words.words} words</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline w-full mt-8"
                            onClick={() =>
                                document.getElementById("preview_modal").showModal()
                            }
                        >
                            Preview
                        </button>

                        <dialog id="preview_modal" className="modal">
                            <div className="modal-box max-w-md">
                                <form method="dialog">
                                    <button
                                        className="btn btn-sm btn-circle absolute right-3 top-3"
                                        aria-label="Close preview"
                                    >
                                        ✕
                                    </button>
                                </form>

                                <PhoneMockup
                                    title={title || "Untitled post"}
                                    coverImage={coverImage?.preview}
                                    content={content}
                                    tags={tags}
                                    category={selectedCategory}
                                    words={words}
                                />
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button aria-label="Close preview">close</button>
                            </form>
                        </dialog>

                        {saveError && (
                            <p className="text-error text-sm mt-6 flex items-center gap-2">
                                <AlertCircle size={14} />
                                {saveError}
                            </p>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                className="btn btn-ghost flex-1"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary flex-1"
                                disabled={saving}
                                onClick={handleUpdate}
                            >
                                {saving ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Save changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}