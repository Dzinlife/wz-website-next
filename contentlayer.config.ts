import { defineDocumentType, makeSource } from "contentlayer/source-files";
// import { makeSource, defineDatabase } from "contentlayer-source-notion";
// import { Client } from "@notionhq/client";
import slugify from "slugify";

// export const Post = defineDatabase(() => ({
//   name: "Post",
//   databaseId: process.env.NOTION_DATABASE_ID!,
//   query: {
//     filter: {
//       property: "Status",
//       status: {
//         equals: "Published",
//       },
//     },
//   },
//   properties: {
//     date: {
//       name: "Created time",
//     },
//   },
//   computedFields: {
//     url: {
//       type: "string",
//       resolve: (post) => `/works/${post._id}`,
//       // resolve: (post) => `${slugify(post.title)}`,
//     },
//   },
// }));

// const client = new Client({ auth: process.env.NOTION_TOKEN });

// export default makeSource({
//   client,
//   databaseTypes: [Post],
// });

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.(md|mdx)`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/works/${slugify(post.title)}`,
    },
    slug: {
      type: "string",
      resolve: (post) => `${slugify(post.title)}`,
    },
  },
}));

export default makeSource({ contentDirPath: "posts", documentTypes: [Post] });
