import { defineDocumentType, makeSource } from "contentlayer/source-files";
import slugify from "slugify";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `${slugify(post.title)}`,
    },
  },
}));

export default makeSource({ contentDirPath: "posts", documentTypes: [Post] });
