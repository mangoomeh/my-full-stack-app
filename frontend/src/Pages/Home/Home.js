import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import styles from "./Home.module.css";
import fetcher from "../../Auth/Axios";
import UserContext from "../../Context/UserContext";
import Post from "./Post/Post";

const Home = () => {
  const [postContent, setPostContent] = useState("");
  const [peopleQuery, setPeopleQuery] = useState("");
  const [postsToBeDisplayed, setPostsToBeDisplayed] = useState([]);
  const [action, setAction] = useState(false)

  const { accessToken, setAccessToken, refreshToken } = useContext(UserContext);

  const newPost = async (accessToken) => {
    await fetcher.post(
      "api/posts/new/",
      accessToken,
      { content: postContent },
      (data) => {
        console.log(data);
      }
    );
    setAction(!action)
  };
  
  const fetchPosts = async () => {
    const verifiedToken = await fetcher.verifyAndRefresh(
      accessToken,
      refreshToken
    );
    const data = await fetcher.get("api/posts/", verifiedToken);
    setPostsToBeDisplayed(data);
    if (accessToken !== verifiedToken) {
      setAccessToken(verifiedToken);
    }
  };
  
  const handleNewPost = async (e) => {
    e.preventDefault();
    const verifiedToken = await fetcher.verifyAndRefresh(
      accessToken,
      refreshToken
    );
    if (verifiedToken !== accessToken) {
      setAccessToken(verifiedToken);
    }
    await newPost(verifiedToken);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div id={styles.page}>
      <form>
        <OutlinedInput
          onChange={(e) => {
            setPeopleQuery(e.target.value);
          }}
          value={peopleQuery}
          size="small"
          placeholder="Find People"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </form>
      <div id={styles.postContainer}>
        <form onSubmit={handleNewPost}>
          <OutlinedInput
            multiline
            rows={4}
            placeholder="What's on your mind?"
            sx={{ width: "100%" }}
            onChange={(e) => {
              setPostContent(e.target.value);
            }}
            value={postContent}
          />
          <div id={styles.postButton}>
            <Button type="submit" variant="contained">
              post
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h1>Posts</h1>
        {postsToBeDisplayed.map((elem) => {
          return <Post {...elem} />
        })}
      </div>
    </div>
  );
};

export default Home;
