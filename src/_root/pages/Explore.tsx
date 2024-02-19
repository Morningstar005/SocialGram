import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebouse";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";
const Explore = () => {
  const {ref,inView} = useInView()

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()
  const [searchValue, setSearchValue] = useState('');
  const debounseValue = useDebounce(searchValue, 500);
  const { data: searchPosts, isFetching: isSearchFetching } = useSearchPosts(debounseValue);
  useEffect(()=>{
        if(inView&& hasNextPage &&!searchValue){
          fetchNextPage();
        }


  },[inView,searchValue])
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }
  // console.log(posts);
  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPost = !shouldShowSearchResults && posts.pages.every((item) => item.documents.length === 0)
  return (
    <div className="flex flex-col flex-1 items-center overflow-scroll custom-scrollbar py-10 px-5 md:p-14 ">
      <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Posts
        </h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg" alt="search"
          />
          <Input
            type="text"
            placeholder="Search By Caption"
            className="h-12 border-none bg-dark-4 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}

          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-hold">Popular Today</h3>


        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2 ">All</p>
          <img src="/assets/icons/filter.svg" alt="filter"
            width={20}
            height={20}
          />

        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResult inSearchfetching={isSearchFetching}
            searchPost={searchPosts}
          />
        ) : shouldShowPost ? (
          <p className="text-light-4 mt-10 text-center w-full">end of posts</p>
        )
          :
          posts.pages.map((item, index) => (
            <GridPostList key={index} posts={item.documents} />
          ))
        }
      </div>

      {
        hasNextPage && !searchValue && (
          <div ref={ref} className="">
            <Loader />
          </div>
        )
      }
    </div>
  )
}

export default Explore