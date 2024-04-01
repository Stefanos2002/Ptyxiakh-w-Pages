import axios from "axios";
import { useEffect, useState } from "react";
type DescriptionsData = Record<number, string>;
type Post = {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
};

const FetchingUrl = ({ posts }: { posts: Post[] }) => {
  const [urls, setUrls] = useState<DescriptionsData>({});
  const [cache, setCache] = useState<Record<number, { url: string }>>({});

  useEffect(() => {
    // Initialize cache when component mounts
    const initializeCache = async () => {
      const newCache: typeof cache = {};
      const newUrls: DescriptionsData = {};

      const promises: Promise<void>[] = posts.map(async (post) => {
        try {
          if (!cache[post.id]) {
            // Fetch data from APIs and update cache
            const url = await fetchUrls(post);
            newCache[post.id] = { url };
            newUrls[post.id] = url;
          } else {
            newCache[post.id] = cache[post.id];
            newUrls[post.id] = cache[post.id].url;
          }
        } catch (error) {
          console.error(`Error fetching data for ${post.title}:`, error);
          newCache[post.id] = {
            url: "",
          };
          newUrls[post.id] = "";
        }
      });

      await Promise.all(promises);
      // Update cache and urls after iterating through all posts
      setUrls(newUrls);
      setCache(newCache);
    };
    initializeCache();
  }, [posts]);

  //async function for fetching urls
  const fetchUrls = async (post: Post): Promise<string> => {
    const newUrls: DescriptionsData = {};
    // Fetch image from RAWG API
    const rawgResponse = await axios.get(`https://api.rawg.io/api/games`, {
      params: {
        search: post.title,
        key: "f0e283f3b0da46e394e48ae406935d25",
      },
    });

    const imageUrl =
      rawgResponse.data.results.length > 0
        ? rawgResponse.data.results[0].background_image
        : ""; // If no image found, set empty string

    // newUrls[post.id] = imageUrl;
    return imageUrl;
  }; //end of async function for urls

  return { urls };
};

export default FetchingUrl;
