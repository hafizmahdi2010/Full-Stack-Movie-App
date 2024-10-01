import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Avatar from 'react-avatar'
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';

const SingleMovie = () => {
  const [comment, setComment] = useState("");
  const { movieId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const getMovie = () => {
    fetch(api_base_url + "/getMovie", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        movieId: movieId,
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.movie[0]); // Access the first movie object
      } else {
        setError(data.msg);
      }
    }).catch(err => {
      console.error("Error fetching movie:", err);
      setError("Failed to fetch movie.");
    });
  };

  const createComment = () => {
    fetch(api_base_url + "/createComment", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        movieId: movieId,
        comment: comment,
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        alert("Comment created successfully");
        setComment("");
      } else {
        alert(data.msg);
      }
    });
  };

  useEffect(() => {
    getMovie();
  }, []);

  return (
    <>
      <Navbar />
      <div className='px-[100px]'>
        <iframe width="100%" className='rounded-[10px]' height="550" src={data ? data.video : ""} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        <h3 className='text-2xl mt-4 mb-2'>{data ? data.title : "Movie Title"}</h3>
        <p className='text-[gray]'>{data ? data.desc : "Movie Description"}</p>

        <h3 className='text-2xl mt-5 mb-3'>Comments</h3>

        <input
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              createComment();
            }
          }}
          onChange={(e) => { setComment(e.target.value) }}
          value={comment}
          type="text"
          className='mb-4 border-0 w-[70%] p-[5px] pl-0 border-b-[1px] border-b-[#fff] bg-transparent outline-0'
          placeholder='Write your comment here'
        />

        <div className="comments w-[70%] mb-7">
          {data && data.comments.map((comment, index) => (
            <div key={index} className="comment mb-2 w-full flex items-center p-[10px] bg-[#27272A] rounded-lg cursor-pointer">
              <Avatar name={comment.username ? comment.username : "User"} size='50' round="50%" className='cursor-pointer mr-3' />
              <div>
                <p className='text-[gray] text-[14px]'>@{comment.username && comment.username.trim() !== '' ? comment.username.trim() : "User"}</p>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SingleMovie;
