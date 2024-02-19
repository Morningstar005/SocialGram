import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetUserPosts, usegetPostbyId } from "@/lib/react-query/queriesAndMutations"
import { formatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: post, isPending } = usegetPostbyId(id || "");
  const {data: userPosts, isLoading: isUserPostLoading}= useGetUserPosts( post?.creator.$id)

  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );
  const handleDeltePost =()=>{
    deletePost({ postId: id, imageId: post?.imageId });
    navigate("/");

  }

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar items-center">
      <div className="hidden md:flex max-w-5xl w-full">
      <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
          </Button>
      </div>
      {
        isPending ? <Loader /> : (
          <div className="post_details-card">
            <img src={post?.imageUrl}
              alt="post Image"
              className="h-80 lg:h-[480px] xl:w-[48%] object-cover p-5 bg-dark-1 rounded-t-[30px] xl:rounded-l-[24px] xl:rounded-tr-none" />

            <div className="post_details-info">
              <div className="flex-between w-full">
                <Link
                  to={`/profile/${post?.creator.$id}`}
                  className="flex items-center gap-3 ">

                  <img
                    src={
                      post?.creator.imageUrl ||
                      '/assets/icons/profile-placeholder.svg'}
                    alt="creator"
                    className="rounded-full w-12 lg:h-12"
                  />

                  <div className="flex gap-1 flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator.name}
                      {/* kal se yaha se krna hai  */}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                      <p className="subtle-semibold lg:small-regular">
                        {formatDateString(post?.$createdAt)}
                      </p>
                      -
                      <p className="subtle-semibold lg:small-regular">{post?.location}
                      </p>
                    </div>
                  </div>
                </Link>


                <div className="flex-center gap-4">
                  <Link
                    to={`/update-post/${post?.$id}`}
                    className={`${user.id !== post?.creator.$id && "hidden"}`}>
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>

                  <Button
                  onClick={handleDeltePost}
                  variant="ghost"
                  className={`post_details-delete_btn ${
                    user.id !== post?. post?.creator.$id && "hidden"
                  }`}
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </div>

              <hr className="border w-full border-dark-4/80" />

              <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {
                  post?.tags.map((tag:string,index:string) => (
                    <li key={index} 
                    className="text-light-3 small-regular">
                      #{tag}
                    </li>
                  ))
                }
              </ul>
              </div>

              <div className="w-full">
              <PostStats post={post} userId={user.id} />
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-5xl">
          <hr className="border w-full border-dark-4/80" />
          <h3>
            More Related Post
          </h3>
          {
            isUserPostLoading || !relatedPosts?(<Loader/>):(
              <GridPostList posts={post}/>
            )
          }
        </div>
    </div>
  )
}

export default PostDetail