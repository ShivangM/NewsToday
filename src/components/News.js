import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import NewsItem from './NewsItem';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {
        props.setProgress(10)
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=00c4b31f9b8f4c81933843e1a05a6500&page=${page}&pagesize=${props.pagesize}`;
        setLoading(true);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100)
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - News Today`
        updateNews();
    }, [])

    // const handelPrevClick = async () => {
    //     setPage({ page: page - 1 });
    //     updateNews();
    //     document.getElementById("next").disabled = false;
    // }

    // const handelNextClick = async () => {
    //     if (page + 1 > Math.ceil(totalResults / props.pagesize)) { document.getElementById("next").disabled = true }
    //     else {
    //         setPage({ page: page + 1 });
    //         updateNews();
    //     }
    // }

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=00c4b31f9b8f4c81933843e1a05a6500&page=${page + 1}&pagesize=${props.pagesize}`;
        setPage(page + 1);
        setLoading(true);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults);
        setLoading(false);
    };

    return (
        <>
                <h1 className="text-center mt-5 pt-4">Top Headlines - {capitalizeFirstLetter(props.category)}</h1>
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Loader />}
                >
                    <div className="cont w-75 m-auto my-2">
                        <div className="row">
                            {articles.map((element) => {
                                return <div className="col-md-4" key={element.url}>
                                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
        </>
    )
}


News.defaultProps = {
    country: "in",
    pagesize: 1,
    category: "general"
}

export default News
