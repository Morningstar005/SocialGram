import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast"
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const {toast} = useToast();

  const {data:creator,isLoading,isError:isErrorCreator} = useGetUsers();

  if(isErrorCreator){
    toast({
      title:"Something went Wrong."
    })
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All User</h2>
        {isLoading && !creator ?(<Loader/>):(
          <ul className="user-grid">
            {
              creator?.documents.map((creator)=>(
                <li key={creator?.$id} className="flex-1 min-w-[20px] w-full">
                 <UserCard user = {creator}/>
                </li>
              ))
            }
          </ul>
        )}
      </div>
    </div>
  )
}

export default AllUsers