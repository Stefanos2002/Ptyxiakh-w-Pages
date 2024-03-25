"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
//JS library to handle HTTP requests,enabling the application
//to retrieve data from external sources(API's)
import SearchBar from "./SearchBar";
import {
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
} from "react-icons/ri";
import {
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
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

export const posts = [
  {
    id: 1,
    title: "God Of War (2018)",
    background: "https://images7.alphacoders.com/714/714040.jpg",
    inlineImage: "https://images.alphacoders.com/129/1295494.png",
    inlineFrame:
      "https://www.youtube.com/embed/CJ_GCPaKywg?si=qjwq-xtnyvwx2c1y",
    wikipediaPage: "God_of_War_(2018_video_game)",
  },
  {
    id: 2,
    title: "Marvel's Spider-Man Remastered",
    background: "https://images5.alphacoders.com/132/1324653.jpeg",
    inlineImage: "https://images2.alphacoders.com/131/1316838.png",
    inlineFrame:
      "https://www.youtube.com/embed/K4zm30yeHHE?si=NqnING25GMXv1Yt1",
    wikipediaPage: "Spider-Man_(2018_video_game)",
  },
  {
    id: 3,
    title: "Cyberpunk 2077",
    background: "https://images.alphacoders.com/134/1341767.png",
    inlineImage: "https://picfiles.alphacoders.com/351/351021.jpg",
    inlineFrame:
      "https://www.youtube.com/embed/rViiAA3qs50?si=EOsg2FXExguGXd1Z",
    wikipediaPage: "Cyberpunk_2077",
  },
  {
    id: 4,
    title: "The Last Of Us Part 2",
    background: "https://images7.alphacoders.com/846/846480.png",
    inlineImage: "https://images4.alphacoders.com/131/1313399.png",
    inlineFrame:
      "https://www.youtube.com/embed/btmN-bWwv0A?si=F5QFi40uHShuXpum",
    wikipediaPage: "The_Last_of_Us_Part_II",
  },
  {
    id: 5,
    title: "Elden Ring",
    background: "https://images8.alphacoders.com/134/1347380.png",
    inlineImage: "https://images.alphacoders.com/135/1353166.png",
    inlineFrame:
      "https://www.youtube.com/embed/E3Huy2cdih0?si=z1AzeBm2xkUtZIhd",
    wikipediaPage: "Elden_Ring",
  },
  {
    id: 6,
    title: "Final Fantasy VII Remake",
    background: "https://images5.alphacoders.com/122/1226744.png",
    inlineImage: "https://images3.alphacoders.com/132/1323789.jpeg",
    inlineFrame:
      "https://www.youtube.com/embed/Z3xSGv3Hfio?si=6bw33xfZfwZlszHF",
    wikipediaPage: "Final_Fantasy_VII_Remake",
  },
  {
    id: 7,
    title: "Red Dead Redemption 2",
    background: "https://images7.alphacoders.com/749/749807.png",
    inlineImage: "https://images8.alphacoders.com/127/1278680.png",
    inlineFrame:
      "https://www.youtube.com/embed/Dw_oH5oiUSE?si=1wAbANK-gxToyr5L",
    wikipediaPage: "Red_Dead_Redemption_2",
  },
  {
    id: 8,
    title: "Batman: Arkham Knight",
    background: "https://images6.alphacoders.com/593/593543.jpg",
    inlineImage: "https://images5.alphacoders.com/129/1291887.jpg",
    inlineFrame:
      "https://www.youtube.com/embed/Bm-6kYvPEdM?si=c5im_5byltNvy5IW",
    wikipediaPage: "Batman:_Arkham_Knight",
  },
  {
    id: 9,
    title: "Doom Eternal",
    background: "https://images4.alphacoders.com/106/1068875.jpg",
    inlineImage: "https://images.alphacoders.com/130/1303637.jpeg",
    inlineFrame:
      "https://www.youtube.com/embed/6xPFAWL9nPQ?si=gPKgJaKXIQ-Kp0yo",
    wikipediaPage: "Doom_Eternal",
  },
  {
    id: 10,
    title: "The Legend of Zelda: Breath of the Wild",
    background: "https://images.alphacoders.com/789/789452.jpg",
    inlineImage: "https://images7.alphacoders.com/557/557051.jpg",
    inlineFrame:
      "https://www.youtube.com/embed/Cjw9ZpzVz7o?si=rgOzQskIytOblr4s",
    wikipediaPage: "The_Legend_of_Zelda:_Breath_of_the_Wild",
  },
  {
    id: 11,
    title: "God of War: Ragnarök",
    background: "https://images.alphacoders.com/130/1308951.jpeg",
    inlineImage: "https://images7.alphacoders.com/134/1344715.png",
    inlineFrame:
      "https://www.youtube.com/embed/TXukPnO9IdY?si=xQHa7PSDohzmH_Ys",
    wikipediaPage: "God_of_War_Ragnarök",
  },
  {
    id: 12,
    title: "Marvel's Spider-man 2",
    background: "https://images.alphacoders.com/130/1308951.jpeg",
    inlineImage: "https://images7.alphacoders.com/134/1344715.png",
    inlineFrame:
      "https://www.youtube.com/embed/TXukPnO9IdY?si=xQHa7PSDohzmH_Ys",
    wikipediaPage: "Spider-Man_2_(2023_video_game)",
  },
  {
    id: 13,
    title: "The Legend Of Zelda: Tears Of The Kingdom",
    background: "https://images2.alphacoders.com/130/1301855.jpg",
    inlineImage: "https://images8.alphacoders.com/130/1301900.jpg",
    inlineFrame:
      "https://www.youtube.com/embed/KuZzRjUu8JQ?si=YC0t2J2AzN3s5aeB",
    wikipediaPage: "The_Legend_of_Zelda:_Tears_of_the_Kingdom",
  },
  {
    id: 14,
    title: "The Last Of Us Part 1",
    background: "https://images8.alphacoders.com/532/532407.jpg",
    inlineImage: "https://images6.alphacoders.com/511/511799.jpg",
    inlineFrame:
      "https://www.youtube.com/embed/R2Ebc_OFeug?si=UHf-MeFnPMFYGxCv",
    wikipediaPage: "The_Last_of_Us_Part_I",
  },
];

export const handleClick = (postTitle: string) => {
  const filtered = posts.find((post) => {
    return post.title === postTitle;
  });
  return filtered;
};

const Posts = () => {
  //({}) initializes an empty object
  const [descriptions, setDescriptions] = useState<DescriptionsData>({});
  const [posterUrls, setPosterUrls] = useState<DescriptionsData>({});
  const [specificPost, setSpecificPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const descriptionsData: DescriptionsData = {};
      const urls: DescriptionsData = {};

      for (const post of posts) {
        try {
          // Fetch description from Wikipedia
          const response = await axios.get(
            `https://en.wikipedia.org/w/api.php`,
            {
              params: {
                action: "parse",
                page: post.wikipediaPage,
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
            // const sectionHeading = "Synopsis";

            // Find the section element by its heading
            const sectionHeadingElement = doc.querySelector(`p`);

            // console.log(sectionHeadingElement);
            if (sectionHeadingElement) {
              // Find the next <p> element after the <h2> element
              let nextHeadingElement = sectionHeadingElement.nextElementSibling;
              descriptionsData[post.id] = "";
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
                  descriptionsData[post.id] += paragraphContent.join(".");
                  // Stop iterating once we've found the next <h2> element
                }
                nextHeadingElement = nextHeadingElement.nextElementSibling;
              }

              // If no <p> element was found, handle this case
              if (!descriptionsData[post.id]) {
                descriptionsData[post.id] = "No content found in section.";
              }
            } else {
              // Handle the case where the section heading is not found
              descriptionsData[post.id] = "Section heading not found.";
            }
            // Fetch image from RAWG API
            const rawgResponse = await axios.get(
              `https://api.rawg.io/api/games`,
              {
                params: {
                  search: post.title,
                  key: "f0e283f3b0da46e394e48ae406935d25",
                },
              }
            );

            const imageUrl =
              rawgResponse.data.results.length > 0
                ? rawgResponse.data.results[0].background_image
                : ""; // If no image found, set empty string

            urls[post.id] = imageUrl;
          }
        } catch (error) {
          console.error(`Error fetching data for ${post.title}:`);
          descriptionsData[post.id] = "Description not available.";
          urls[post.id] = ""; // Set empty string if there's an error
        }
      }

      setDescriptions(descriptionsData);
      setPosterUrls(urls);
    };

    fetchData();
  }, []);

  const handleSearch = (postTitle: string) => {
    // postTitle = postTitle.replaceAll(/_/g, " ");
    const filteredPost = posts.find((post) => post.title === postTitle);
    setSpecificPost(filteredPost || null);
  };

  return (
    <>
      <SearchBar posts={posts} onSearch={handleSearch} />
      <ul className="relative flex mt-36 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
        {specificPost ? (
          <li
            key={specificPost.id}
            className="text-slate-800 my-36 text-balance text-md 2xl:w-1/2 xl:hover:scale-110 xl:w-3/5 w-4/5 lg:hover:scale-105 hover:scale-105  transition-all duration-500 ease-in-out"
          >
            <Link
              href={`/Games/${specificPost.title.replace(/ /g, "_")}`}
              className="relative flex group border-4 sm:h-52 h-[29rem] border-white rounded-lg transition-all duration-300"
            >
              <div className="bg-white relative flex flex-col sm:flex-row gap-3 transition-all duration-400">
                {posterUrls[specificPost.id] && (
                  <Image
                    src={posterUrls[specificPost.id]}
                    alt={specificPost.title}
                    width={400}
                    height={300}
                    className="object-cover xl:border-r-8 xl:border-double border-white  transition duration-500 ease-in-out"
                  />
                )}
                <div
                  className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 items-center justify-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                  style={{
                    transition:
                      "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                  }}
                >
                  <span className="text-white">{specificPost.title}</span>
                </div>
                <div className="overflow-hidden text-ellipsis pl-4 leading-7">
                  <span>{descriptions[specificPost.id]}</span>
                </div>
              </div>
            </Link>
          </li>
        ) : (
          posts.map((item) => (
            <li
              key={item.id}
              className="text-slate-800 text-balance text-md 2xl:w-1/2 xl:hover:scale-110 xl:w-3/5 w-4/5 lg:hover:scale-105 hover:scale-105  transition-all duration-500 ease-in-out"
            >
              <Link
                href={`/Games/${item.title.replace(/ /g, "_")}`}
                className="relative flex group border-4 sm:h-52 h-[29rem] border-white rounded-lg transition-all duration-300"
              >
                <div className="bg-white relative flex flex-col sm:flex-row gap-3 transition-all duration-400">
                  {posterUrls[item.id] && (
                    <Image
                      src={posterUrls[item.id]}
                      alt={item.title}
                      // fill={true}
                      // objectFit="contain"
                      width={400}
                      height={300}
                      className="object-cover xl:border-r-8 xl:border-double border-white  transition duration-500 ease-in-out"
                    />
                  )}
                  <div
                    className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 items-center justify-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                    style={{
                      transition:
                        "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                    }}
                  >
                    <span className="text-white">{item.title}</span>
                  </div>
                  <div className="overflow-hidden text-ellipsis pl-4 leading-7">
                    <span>{descriptions[item.id]}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
        <div className="relative text-white mt-5 flex flex-row gap-4 transition-all duration-200">
          <Link href={``}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <MdKeyboardDoubleArrowLeft />
            </button>
          </Link>
          <Link href={``}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <MdKeyboardArrowLeft />
            </button>
          </Link>
          <Link href={`/Games`}>
            <button className="transition-all duration-200 border-2 p-1.5 rounded-md bg-stone-600 border-stone-600 hover:scale-105">
              <RiNumber1 />
            </button>
          </Link>
          <Link href={`/Games/page/[index]`}>
            {/* /Games/${something} */}
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md bg-stone-600 border-stone-600">
              <RiNumber2 />
            </button>
          </Link>
          <Link href={`/Games/page/[index]`}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <RiNumber3 />
            </button>
          </Link>
          <Link href={`/Games/page/[index]`}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <RiNumber4 />
            </button>
          </Link>
          <Link href={`/Games/page/[index]`}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <RiNumber5 />
            </button>
          </Link>
          <Link href={``}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <MdKeyboardArrowRight />
            </button>
          </Link>
          <Link href={``}>
            <button className="hover:scale-105 transition-all duration-200 border-2 p-1.5 rounded-md  bg-stone-600 border-stone-600">
              <MdKeyboardDoubleArrowRight />
            </button>
          </Link>
        </div>
      </ul>
    </>
  );
};

export default Posts;
