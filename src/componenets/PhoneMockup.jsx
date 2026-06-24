import React from "react";

function PhoneMockup({
  title,
  coverImage,
  content,
  tags,
  category,
  words,
}) {
  return (
    <div className="flex justify-center lg:sticky lg:top-6">
      <div className="mockup-phone w-[320px] sm:w-[360px] lg:w-[380px] h-[650px] sm:h-[720px] lg:h-[800px]">
        <div className="mockup-phone-camera"></div>

        <div className="mockup-phone-display bg-neutral-900 overflow-y-auto">
          {/* Cover Image */}
          {coverImage ? (
            <img
              src={coverImage.preview}
              alt="Cover"
              className="w-full h-44 sm:h-52 object-cover"
            />
          ) : (
            <div className="h-44 sm:h-52 flex items-center justify-center text-gray-500 border-b border-zinc-700">
              No Cover Image
            </div>
          )}

          <div className="p-4">
            {/* Category & Read Time */}
            <div className="flex flex-wrap gap-2">
              <div className="badge badge-primary">
                {category}
              </div>

              <div className="badge badge-accent badge-outline">
                📖 {words?.time || 1} min
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold mt-4 break-words">
              {title || "Your Blog Title"}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <div key={tag} className="badge badge-outline">
                  {tag}
                </div>
              ))}
            </div>

            {/* Blog Content */}
            <div
              className="prose prose-invert max-w-none mt-6"
              dangerouslySetInnerHTML={{
                __html:
                  content ||
                  "<p class='text-gray-500'>Start writing your blog...</p>",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;