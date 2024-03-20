"use client"; //because we use UseState
import Link from "next/link";
import React, { useState, useRef } from "react";
import Image from "next/image";

const batManImagePath = "/images/batman.jpg";

const Movies = () => {
  const [isPlaying, setisPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); //to videoRef Kanei anafora se HTML video
  let timer: ReturnType<typeof setTimeout>;

  //function gia na paizoun ta video mono otan ginontai hovered
  const handleMouseEnter = () => {
    //timeout gia na eimaste sigouroi oti to hover tha ginei swsta
    timer = setTimeout(() => {
      if (!isPlaying && videoRef.current) {
        //Xekinaei to video na paizei kai kanoume update to state se true
        videoRef.current.play();
        setisPlaying(true);
      }
    }, 400);
  };

  //function gia na stamatane ta video na paizoun otan den einai hovered
  const handleMouseLeave = () => {
    clearTimeout(timer);
    if (isPlaying && videoRef.current) {
      //Stamataei to video kai kanoume update to state se false
      videoRef.current.pause();
      setisPlaying(false);
    }
  };

  return (
    //Link einai to a href ths next js 14
    <Link
      href={"/Movies"}
      className="relative clip-container group text-6xl justify-center flex w-2/4 h-screen overflow-hidden grayscale hover:grayscale-0 transition duration-500 ease-in-out cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={batManImagePath}
        alt="Senua image placeholder"
        layout="fill"
        objectFit="cover"
        className="absolute hover:opacity-0 transition duration-1000  "
        priority
      ></Image>
      <h1 className="clip-text flex absolute top-2/4 text-white z-10 opacity-0 group-hover:opacity-100 transition duration-1000 ease-in-out">
        Movies
      </h1>
      <video
        className="w-full h-screen absolute object-cover -z-10"
        src="/videos/Sequence5.mp4"
        controls={false}
        ref={videoRef}
        loop
        muted
      />
    </Link>
  );
};
export default Movies;
