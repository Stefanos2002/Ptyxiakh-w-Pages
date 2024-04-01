import { useEffect, useState } from "react";
import axios from "axios";
type DescriptionsData = Record<number, string>;

type Post = {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
};

const FetchingDescription = ({ posts }: { posts: Post[] }) => {
  const [descriptions, setDescriptions] = useState<DescriptionsData>({});
  const [cache, setCache] = useState<Record<number, { description: string }>>(
    {}
  );

  useEffect(() => {
    // Initialize cache when component mounts
    const initializeCache = async () => {
      const newCache: typeof cache = {};
      const newDescriptions: DescriptionsData = {};

      const promises: Promise<void>[] = posts.map(async (post) => {
        try {
          if (!cache[post.id]) {
            // Fetch data from APIs and update cache
            const description = await fetchDescriptions(post);
            newCache[post.id] = { description };
            newDescriptions[post.id] = description;
          } else {
            newCache[post.id] = cache[post.id];
            newDescriptions[post.id] = cache[post.id].description;
          }
        } catch (error) {
          console.error(`Error fetching data for ${post.title}:`, error);
          newCache[post.id] = {
            description: "",
          };
          newDescriptions[post.id] = "";
        }
      });

      await Promise.all(promises);
      // Update cache, descriptions after iterating through all posts
      setDescriptions(newDescriptions);
      setCache(newCache);
    };
    initializeCache();
  }, [posts]); // This useEffect runs only once when the component changes

  //async function for fetching descriptions
  const fetchDescriptions = async (post: Post): Promise<string> => {
    const newDescriptions: DescriptionsData = {};
    // Fetch description from Wikipedia
    const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: "parse",
        page: post.wikipediaPage,
        format: "json",
        origin: "*",
      },
    });

    // Check if the page exists and has content
    if (response.data.parse && response.data.parse.text) {
      const pageHTML = response.data.parse.text["*"];
      const parser = new DOMParser();
      const doc = parser.parseFromString(pageHTML, "text/html");

      // Find the section element by its heading
      const sectionHeadingElement = doc.querySelector(`p`);

      // console.log(sectionHeadingElement);
      if (sectionHeadingElement) {
        // Find the next <p> element after the <h2> element
        let nextHeadingElement = sectionHeadingElement.nextElementSibling;
        newDescriptions[post.id] = "";
        while (
          nextHeadingElement &&
          nextHeadingElement.tagName.toLowerCase() !== "h2"
        ) {
          // Check if the current sibling element is a <p> element
          if (
            nextHeadingElement.tagName.toLowerCase() === "p" &&
            nextHeadingElement.textContent
          ) {
            // Extract the text content from the <p> element
            const paragraphContent = nextHeadingElement.textContent
              .split(".")
              .map((sentence) =>
                sentence.replace(/\[\d+\]/g, "").replace(/\[\w+\]/g, "")
              )
              .filter((sentence) => sentence.trim() !== "");
            newDescriptions[post.id] += paragraphContent.join(".");
            // Stop iterating once we've found the next <h2> element
          }
          nextHeadingElement = nextHeadingElement.nextElementSibling;
        }

        // If no <p> element was found, handle this case
        if (!newDescriptions[post.id]) {
          newDescriptions[post.id] = "No content found in section.";
        }
      } else {
        // Handle the case where the section heading is not found
        newDescriptions[post.id] = "Section heading not found.";
      }
    } //end of outer if
    return newDescriptions[post.id];
  }; //end of async fetch description function

  return { descriptions };
};

export default FetchingDescription;
