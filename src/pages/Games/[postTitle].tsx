import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { posts } from "../../components/Game-components/Posts";

// Define an interface for the structure of a single post
interface Post {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
}
interface DescriptionItem {
  type: "text" | "image" | "iframe";
  content?: string | React.ReactNode;
}
//added this to render string content based on element id
// type DescriptionsData = Record<number, string>;
interface DescriptionsData {
  [postTitle: string]: string[];
  //means that the object takes string key and the values returned are string arrays
}

const Post: React.FC = () => {
  const router = useRouter();
  const { postTitle } = router.query;
  const [post, setPost] = useState<Post | null>(null);
  const [descriptions, setDescriptions] = useState<DescriptionsData>({});
  let decodedPostTitle: string | undefined;

  if (Array.isArray(postTitle)) {
    decodedPostTitle = postTitle[0];
  } else {
    decodedPostTitle = postTitle?.replace(/_/g, " ");
  }

  //this UseEffect is used to return the postID page according to the routing inside api
  useEffect(() => {
    if (!decodedPostTitle) {
      return;
    }

    const fetchPost = async () => {
      const descriptionsData: DescriptionsData = {};
      // if (!postTitle) return; // Exit if postId is not available

      try {
        const response = await fetch(`/api/${decodedPostTitle}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);

        // Fetch description from Wikipedia for the current post only
        const currentPost = posts.find(
          (post) => post.title === decodedPostTitle
        );
        if (currentPost) {
          const response = await axios.get(
            `https://en.wikipedia.org/w/api.php`,
            {
              params: {
                action: "parse",
                page: currentPost.wikipediaPage,
                format: "json",
                origin: "*",
              },
            }
          );
          // Check if the page exists and has content
          if (response.data.parse && response.data.parse.text) {
            const pageHTML = response.data.parse.text["*"];
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageHTML, "text/html");

            // Define the section heading you want to extract

            // Find the section element by its heading
            const sectionHeadingElement = doc.querySelector(`p`);

            // console.log(sectionHeadingElement);
            if (sectionHeadingElement) {
              // Find the next <p> element after the <h2> element
              let nextHeadingElement = sectionHeadingElement.nextElementSibling;
              descriptionsData[currentPost.id] = [];
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
                  // console.log(paragraphContent);

                  // descriptionsData[post.id] += paragraphContent.join(".");
                  descriptionsData[currentPost.id].push(
                    paragraphContent.join(".")
                  );
                  // Stop iterating once we've found the next <h2> element
                }
                nextHeadingElement = nextHeadingElement.nextElementSibling;
              }

              // If no <p> element was found, handle this case
              if (!descriptionsData[currentPost.id]) {
                descriptionsData[currentPost.id].push(
                  "No paragraph content found in section."
                );
              }
            } else {
              // Handle the case where the section heading is not found
              descriptionsData[currentPost.id].push(
                "Section heading not found."
              );
            }
          }
        }
        //this catches errors for post
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null); // Set post to null to indicate not found
      }
      setDescriptions(descriptionsData);
    };

    fetchPost();
  }, [decodedPostTitle]);

  if (!post) {
    return <div>Post Not Found</div>;
  }

  return (
    <div className="relative w-full h-screen">
      <div className="fixed w-full h-screen">
        <Image
          src={post.background}
          alt={post.title + " Background Image"}
          layout="fill"
          objectFit="cover"
        ></Image>
      </div>
      <div className="flex pt-40 pb-5 flex-col items-center justify-center">
        {descriptions[post.id] &&
          splitDescription(
            descriptions[post.id].join(""),
            post.inlineImage,
            post.inlineFrame
          ).map((item, index) => (
            <React.Fragment key={index}>
              {item.type === "text" && (
                <span className="border mt-5 relative 2xl:w-1/2 xl:w-4/6 w-5/6 bg-stone-600/70 p-6 rounded-2xl text-balance text-white text-2xl transition-[width] ease-in-out duration-300">
                  {item.content}
                </span>
              )}
              {item.type === "image" && typeof item.content === "string" && (
                <div className="relative h-[30rem] 2xl:w-1/2 xl:w-4/6 w-5/6 mt-5 overflow-hidden transition-[width] ease-in-out duration-300">
                  <Image
                    src={item.content}
                    alt="inline_image"
                    fill={true}
                    objectFit="cover"
                  ></Image>
                </div>
              )}
              {item.type === "iframe" && typeof item.content === "string" && (
                <div className="relative h-[58.5vh] mt-5 2xl:w-1/2 xl:w-4/6 w-5/6 flex items-center justify-center transition-[width] ease-in-out duration-300">
                  <iframe
                    src={item.content}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

function cutString(str: string): string[] {
  const cutSentence = str
    .split(".")
    .filter((sentence) => sentence.trim() !== "");
  // console.log(cutSentence);
  return cutSentence;
}

function splitDescription(
  description: string,
  inlineImage: string,
  inlineFrame: string
): DescriptionItem[] {
  const maxSentences = 5; // Adjust this value as needed
  const sentences = cutString(description);
  const result: DescriptionItem[] = [];

  // console.log(sentences);

  for (let i = 0; i < sentences.length; i += 5) {
    let section = "";
    for (let j = 0; j < 5; j++) {
      if (i + j < sentences.length) {
        section += sentences[i + j] + ".";
      }
    }
    if (i === maxSentences) {
      result.push({
        type: "image",
        content: inlineImage,
      });
    }
    if (i === maxSentences + 5) {
      result.push({
        type: "iframe",
        content: inlineFrame,
      });
    }
    result.push({ type: "text", content: section });
  }

  return result;
}

export default Post;
