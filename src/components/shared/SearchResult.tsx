import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultProps ={
  inSearchfetching:boolean;
  searchPosts:any;
}
const SearchResult = ({inSearchfetching,searchPosts}:SearchResultProps) => {
  if(inSearchfetching) return <Loader/>
  if(searchPosts && searchPosts.documents.length>0){
    return( 
      <GridPostList posts={searchPosts.documents}/>
      )
  }
 
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Result Found</p>
  )
}

export default SearchResult