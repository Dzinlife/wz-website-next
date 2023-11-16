import "server-only";

import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
//@ts-ignore
import { NotionCompatAPI } from "notion-compat";
import { NotionRenderer } from "react-notion-x";
import { NotionAPI } from "notion-client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notionCompat = new NotionCompatAPI(notion) as NotionAPI;

export const fetchPages = React.cache(() => {
  return notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
  });
});

export const fetchPageBySlug = React.cache((slug: string) => {
  return notion.databases
    .query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    })
    .then((res) => {
      console.log(1211111, res.results[0].id);
      return res.results[0] as PageObjectResponse | undefined;
    });
});

// export const fetchRecordsByPageId = React.cache(async (id: string) => {
//   return (await notionCompat.getPage(id)) as React.ComponentProps<
//     typeof NotionRenderer
//   >["recordMap"];
// });

export const fetchPageBlocks = React.cache((pageId: string) => {
  return notion.blocks.children
    .list({ block_id: pageId })
    .then((res) => res.results as BlockObjectResponse[]);
});
