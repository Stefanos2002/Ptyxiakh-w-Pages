import MainPage from "@/components/Game-components/MainPage";
import NavBar from "@/components/Game-components/NavBar";
import Posts from "../Posts";

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

interface Props {
  posts: Post[];
}

const GamesHomePage: React.FC<Props> = ({ posts }) => {
  return (
    <>
      <MainPage>
        <NavBar />
        <Posts posts={posts} />
      </MainPage>
    </>
  );
};
export default GamesHomePage;
