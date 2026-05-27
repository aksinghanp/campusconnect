import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost, generateCaption } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";
const NewPost = () => {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");

  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const Reader = new FileReader();
    Reader.readAsDataURL(file);

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setImage(Reader.result);
      }
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await dispatch(createNewPost(caption, image));
    dispatch(loadUser());
  };

  const generateCaptionHandler = async () => {
    try {
      const suggestedCaption = await dispatch(generateCaption(prompt.trim()));
      if (suggestedCaption) {
        setCaption(suggestedCaption);
      }
    } catch (error) {
      // errors handled by redux
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, alert]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>

        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Enter keywords or tone for AI caption"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Typography variant="body2" style={{ margin: "1rem 0", color: "#555" }}>
          Use the prompt field above to ask AI for a caption. Leave it blank for a general suggestion.
        </Typography>
        <Button disabled={loading} type="button" onClick={generateCaptionHandler}>
          {loading ? "Generating..." : "Generate AI caption"}
        </Button>
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
