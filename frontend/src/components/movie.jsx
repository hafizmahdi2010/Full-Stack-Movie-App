import React from 'react'
import { useNavigate } from 'react-router-dom'

const Movie = ({movie}) => {
  const navigate = useNavigate();
  return (
    <>
      <div onClick={()=>{navigate("/singleMovie/"+movie._id)}} className="card w-[200px] h-[300px] rounded-lg cursor-pointer">
      <img className='w-[full] h-full object-cover rounded-lg cursor-pointer' src={movie ? "http://localhost:3000/uploads/" + movie.img : ""} alt="" />
      </div>
    </>
  )
}

export default Movie