import { useUserContext } from "@/context/AuthContext";
import { formatDateString } from "@/lib/utils";
import { Models } from "appwrite"
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
    post:Models.Document;
}
const PostCard = ({post}:PostCardProps) => {

    const {user} = useUserContext()
    if(!post.creator)return;
    console.log(post)
  return (
    <div className="bg-dark-2 rounded-3xl border border-dark-4 p-5 lg-p-7 w-full max-w-screen-sm">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                    <img src={post?.creator.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="creator" className="rounded-full w-12 lg:h-12" />
                </Link>
                <div className="flex flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                        {post?.creator.name}
                        {/* kal se yaha se krna hai  */}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                        <p className="subtle-semibold lg:small-regular">{ formatDateString(post.$createdAt)}
                        </p>
                        -
                        <p className="subtle-semibold lg:small-regular">{post.location}</p>
                    </div>
                </div>
            </div>
            <Link to={`/update-post/${post.$id}`} 
            className={`${user.id !== post.creator.$id && "hidden"} `}>
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20}/>
            </Link>
        </div>
        <Link to={`/post/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                <p >{post.caption}</p>
                <ul className="flex gap-1 mt-2"> 
                    {
                        post.tags.map((tag:string)=>(
                            <li className="text-light-3" key={tag}>
                                #{tag}
                            </li>
                        ))
                    }
                </ul>
            </div>
            <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} 
            alt="post image"
            className="h-64 xs:h-[400px] lg:[450px] w-full object-cover mb-5 rounded-[24px]"
             />
        </Link>
        <PostStats post={post} userId = {user.id}/>

    </div>
  )
}

export default PostCard