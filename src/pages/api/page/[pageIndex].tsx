import { NextApiRequest, NextApiResponse } from "next";
import { posts } from "../../../components/Game-components/Posts";
// Define the handler function for the API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //the req.query returns all parameters as strings by default
  let { page } = req.query;
  if (!page) {
    page = "1"; // Default to page 1 if page number is missing
  }

  const pageNumber = parseInt(page as string, 10);

  // Calculate the index range of posts for the requested page
  //number 10 means posts per page
  const startIndex = (pageNumber - 1) * 10;
  const endIndex = startIndex + 10;

  const pagePosts = posts.filter(
    (post) => post.id >= startIndex + 1 && post.id <= endIndex
  );
  // Extract posts for the requested page
  // const pagePosts = posts.slice(startIndex, endIndex);

  // Return the posts for the requested page
  return res.status(200).json(pagePosts);
}
