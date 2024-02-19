import { useGetCurrentUser, userDeleteSavedPost, userLikePost, userSavedPost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite"
import { useEffect, useState } from "react";
import Loader from "./Loader";


type PostStatsprops = {
  post:any;
  userId: string;
}
const PostStats = ({ post, userId }: PostStatsprops) => {
  // const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = userLikePost();
  const { mutate: savePost, isPending: isSavingPost } = userSavedPost();
  const { mutate: deleteSavedPost, isPending: isdeletingSaved } = userDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes })

  }

  const handlesavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();


    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavedPost(savedPostRecord.$id);


    }
    savePost({ userId: userId, postId: post.$id });

    setIsSaved(true)

  }


  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes, userId)
            ? "/assets/icons/liked.svg" :
            "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p>{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isdeletingSaved ? <Loader /> : <img
          src={isSaved ?
            "/assets/icons/saved.svg" :
            "/assets/icons/save.svg"}
          alt="saved"
          width={20}
          height={20}
          onClick={handlesavePost}
          className="cursor-pointer"
        />}

      </div>
    </div>
  )
}

export default PostStats