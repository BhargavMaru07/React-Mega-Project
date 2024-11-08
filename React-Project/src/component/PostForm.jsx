import React, { useCallback } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import RTE from "./RTE";
import appwriteService from "../appwrite/Config_Appwrite";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    console.log("submit data", data);
      console.log("userData:", userData); // Log to check if userData is defined

      if (!userData) {
        console.log("User is not logged in or userData is missing.");
        return; // Stop execution if userData is not available
      }
      
    try {
      let file;
      if (data.image && data.image[0]) {
        file = await appwriteService.uploadFile(data.image[0]);
      }

      if (post) {
        if (file) {
          await appwriteService.deleteFile(post.featuredImage);
          data.featuredImage = file.$id;
        }

        const dbPost = await appwriteService.updatePost(post.$id, data);
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        if (file) data.featuredImage = file.$id;
        data.userId = userData.$id;

        const dbPost = await appwriteService.createPost(data);
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (error) {
      console.log("Error submitting post", error);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value.trim().toLowerCase().replace(/ /g, "-");
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title:"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        {errors.title && <span>Title is required</span>}

        <Input
          label="Slug:"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />
        {errors.slug && <span>Slug is required</span>}

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {errors.image && <span>Image is required</span>}

        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        {errors.status && <span>Status is required</span>}

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : "bg-blue-600"}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
