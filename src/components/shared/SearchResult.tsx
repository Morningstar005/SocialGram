import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultProps ={
  inSearchfetching:boolean;
  searchPost:Models.Document
}
const SearchResult = ({inSearchfetching,searchPost}:SearchResultProps) => {
  if(inSearchfetching) return <Loader/>
  if(searchPost && searchPost.documents.length>0){
    return( 
      <GridPostList posts={searchPost.documents}/>
      )
  }
 
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Result Found</p>
  )
}

export default SearchResult