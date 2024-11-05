import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/Config_Appwrite";
import { Container } from "../component/Container/Container";
import { PostCard } from "../component/PostCard";

function AllPost() {
  const [post, setPost] = useState([]);
  useEffect(() => {
    appwriteService.getPosts([]).then((post) => {
      if (post) {
        setPost(post.documents);
      }
    });
  }, []);
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {post.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPost;
