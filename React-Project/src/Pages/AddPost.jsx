import React from "react";
import { Container } from "../component/Container/Container";
import { PostForm } from "../component/PostForm";

function AddPost() {
  return (
    <div className="py-8">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
