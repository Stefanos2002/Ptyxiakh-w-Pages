"use client";
import React from "react";
import axios from "axios";

// descriptions will be a dictionary-like object where keys are
// numbers(post Ids) and values are strings(post descriptions)
// Record is used when keys and values are of 2 different types
type DescriptionsData = Record<number, string>;
type Post = {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
};

// export const handleClick = (postTitle: string) => {
//   const filtered = posts.find((post) => {
//     return post.title === postTitle;
//   });
//   return filtered;
// };

async function fetchDescriptionsAndUrls(posts: Post[]) {}

export default async function Posts() {
  //({}) initializes an empty object

  // const [posts, setPosts] = useState<Post[]>([]);

  // const handleSearch = (postTitle: string) => {
  //   // postTitle = postTitle.replaceAll(/_/g, " ");
  //   const filteredPost = posts.title((post) => post.title === postTitle);
  //   setSpecificPost(filteredPost || null);
  // };

  return <></>;
}
