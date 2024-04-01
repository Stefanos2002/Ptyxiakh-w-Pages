import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import FetchingUrl from "../FetchingUrl";
import FetchingDescription from "../FetchingDescription";

export const getStaticProps = async () => {
  const res = await fetch("http://localhost:8000/posts");
  const data = await res.json();

  return {
    props: { posts: data },
  };
};

interface Post {
  id: number;
  title: string;
  background: string;
  inlineImage: string;
  inlineFrame: string;
  wikipediaPage: string;
}

const Posts = ({ posts }: { posts: Post[] }) => {
  const [specificPost, setSpecificPost] = useState<Post | null>(null);
  const { descriptions } = FetchingDescription({ posts });
  const { urls } = FetchingUrl({ posts });

  return (
    <>
      <div>
        <ul className="relative flex mt-36 mb-12 w-full flex-col items-center justify-center xl:gap-12 gap-16">
          {specificPost ? (
            <li
              key={specificPost.id}
              className="text-slate-800 my-36 text-balance text-md 2xl:w-1/2 xl:hover:scale-110 xl:w-3/5 w-4/5 lg:hover:scale-105 hover:scale-105  transition-all duration-500 ease-in-out"
            >
              <Link
                href={`/Games/${specificPost.title.replace(/ /g, "_")}`}
                className="relative flex group border-4 md:h-60 h-[29rem] border-white rounded-lg transition-all duration-300"
              >
                <div className="bg-white relative flex flex-col md:flex-row gap-3 transition-all duration-400">
                  <div className="relative overflow-hidden h-96 w-full pr-80">
                    {urls[specificPost.id] && (
                      <Image
                        src={urls[specificPost.id]}
                        alt={specificPost.title}
                        priority={true}
                        fill={true}
                        style={{ objectFit: "contain" }}
                        className="object-cover xl:border-r-8 xl:border-double border-white  transition duration-500 ease-in-out"
                      />
                    )}
                  </div>
                  <div
                    className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 items-center justify-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                    style={{
                      transition:
                        "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                    }}
                  >
                    <span className="text-white">{specificPost.title}</span>
                  </div>
                  <div className="overflow-hidden pl-4 leading-7">
                    <span>{descriptions[specificPost.id]}</span>
                  </div>
                </div>
              </Link>
            </li>
          ) : (
            posts.map((item: Post) => (
              <li
                key={item.id}
                className="text-slate-800 text-balance text-md 2xl:w-1/2 xl:hover:scale-110 xl:w-3/5 w-4/5 lg:hover:scale-105 hover:scale-105  transition-all duration-500 ease-in-out"
              >
                <Link
                  href={`/Games/${item.title.replace(/ /g, "_")}`}
                  className="relative flex group border-4 md:h-60 h-[33rem] border-white rounded-lg transition-all duration-300"
                >
                  <div className="bg-white relative flex flex-col md:flex-row md:gap-0 gap-2 transition-all duration-400">
                    <div className="relative overflow-hidden md:pb-56 pb-72 md:pr-96">
                      {urls[item.id] && (
                        <Image
                          src={urls[item.id]}
                          alt={item.title}
                          priority={true}
                          fill={true}
                          style={{ objectFit: "cover" }}
                          className="xl:border-r-8 xl:border-double border-white transition duration-500 ease-in-out"
                        />
                      )}
                    </div>
                    <div
                      className="h-0 opacity-0 group-hover:opacity-100 absolute flex group-hover:h-10 items-center justify-center border border-black bg-black rounded-b-xl text-md ml-3 p-1"
                      style={{
                        transition:
                          "height 0.5s ease-in-out, opacity 0.5s ease-in-out",
                      }}
                    >
                      <span className="text-white">{item.title}</span>
                    </div>
                    <div className="overflow-hidden pl-4 leading-7">
                      <span>{descriptions[item.id]}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};
export default Posts;
