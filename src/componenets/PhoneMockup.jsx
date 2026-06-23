import React from "react";

function PhoneMockup({ title, coverImage, content, tags, category ,words}) {
  return (
    <div className="mockup-phone h-[850px] p-4">
      <div className="mockup-phone-camera"></div>

      <div className="mockup-phone-display bg-neutral-900 overflow-y-auto">
        {/* Cover Image */}
        {coverImage ? (
          <img
            src={coverImage.preview}
            alt="Cover"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="h-48 flex items-center justify-center text-gray-500 border-b border-zinc-700">
            No Cover Image
          </div>
        )}

        <div className="p-4">
          {/* Category */}
          <div className="flex gap-5">
            <div className="badge badge-primary">
            {category}
          </div>
        <div class="badge badge-dash badge-accent">

            Read: {words.time} min
        </div>
          
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mt-4">
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

          {/* Content */}
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
  );
}

export default PhoneMockup;