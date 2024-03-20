import { NextApiRequest, NextApiResponse } from "next";
import { posts } from "../../components/Game-components/Posts";

// Define the handler function for the API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let { postTitle } = req.query;
  if (Array.isArray(postTitle)) {
    postTitle = postTitle[0];
  }
  if (!postTitle) {
    return res
      .status(404)
      .json({ message: "Post Title is missisng or invalid" });
  }
  // Replace hyphens with spaces
  postTitle = postTitle.replace(/_/g, " ");

  // Ensure that spaces and special characters are encoded properly
  postTitle = decodeURIComponent(postTitle);
  // console.log(postTitle);

  // Find the post with the matching ID
  const post = posts.find((post) => post.title === postTitle);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // If the post is found, return it as JSON response
  return res.status(200).json(post);
}
