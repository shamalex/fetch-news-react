
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Article from './Article';
import Input from './Input';

export default function App() {
  const searchCount = 10;
  const url = 'https://newsapi.org/v2/everything';
  const API_KEY = 'cdb24da8ba824004a326724f15f392e2';
  const [maxRange, setMaxRange] = useState(searchCount);
  const [data, setData] = useState({
    users:[],
    isLoading: false,
    isError: false,
    query: 'react',
  });

  const loadMore = useCallback(() => {
    setMaxRange(prevRange => prevRange + searchCount);
  },[])

  const handleChange = useCallback((inputValue) => {
    setData( prevState  => ({ ...prevState, query: inputValue }))
  }, []);

  useEffect(() => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const findNews = setTimeout(() => { //made a request after user stop typing
      const fetchDataNews = async () => {
        setData( prevState  => ({ ...prevState, isError : false }));
        setData( prevState  => ({ ...prevState, isLoading : true }));
        setMaxRange(searchCount)
        try {
          const result = await axios(url, {
            params: {
              q: data.query,
              from: date,
              sortBy: 'popularity',
              apiKey: API_KEY
            }
          });
          setData( prevState  => ({ ...prevState, users : result.data.articles }));
        } catch (error) {
          if (data.query.length) setData( prevState  => ({ ...prevState, isError : true }));
        }
        setData( prevState  => ({ ...prevState, isLoading : false }));
      };
      if (data.query.length > 0) fetchDataNews(); //start search, if input is not empty
    }, 500);

    return () => clearTimeout(findNews); //unmount timer to prevent memory leak

  }, [data.query]);

  return (
    <>
      <div className="container">

        <h1>Test task</h1>

        <Input
          type="search"
          value={data.query}
          placeholder="Enter something here..."
          label="Search"
          onChange={handleChange}
        />

        {data.users && !data.isError && !data.isLoading && (
          <ul>
            {data.users.slice(0, maxRange).map(article => (
              <Article key={article.title} data={article} />
            ))}
          </ul>
        )}

        {!data.isLoading && !data.users.length && (
          <div>
            <p>Sorry, no news</p>
          </div>
        )}

        {data.isError && <div>Something went wrong ...</div>}

        {data.isLoading && (
          <div className="section">
            <div className="loader-flip"></div>
          </div>
        )}

        {data.users.length > maxRange &&
          <button type="button" onClick={loadMore}>Load More</button>
        }
      </div>
    </>
  );
}