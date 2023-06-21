import React from 'react'

import './App.css'
import axios from 'axios'

type Posts = {
  comments: Comments[]
  limit: number
  skip: number
  total: number
}

type Comments = {
  body: string
  id: number
  postId: number
  user: User
}

type User = {
  id: number
  username: string
}

function App() {
  const [posts, setPosts] = React.useState<Posts>({
    comments: [],
    limit: 30,
    skip: 0,
    total: 340,
  })

  const [newPostBody, setNewPostBody] = React.useState(() => {
    const savedPostBody = localStorage.getItem('newPostBody')
    return savedPostBody || ''
  })

  React.useEffect(() => {
    axios
      .get('https://dummyjson.com/comments')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err))
  }, [])

  const deletePost = (postId: number) => {
    setPosts((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.filter((post) => post.id !== postId),
    }))
  }

  const addPost = () => {
    const newPost = {
      body: newPostBody,
      id: Date.now(),
      postId: Date.now(),
      user: {
        id: Date.now(),
        username: 'John Doe',
      },
    }

    if (newPostBody) {
      setPosts((prevPosts) => ({
        ...prevPosts,
        comments: [...prevPosts.comments, newPost],
      }))

      setNewPostBody('')
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target
    setNewPostBody(value)
    localStorage.setItem('newPostBody', value)
  }

  return (
    <div className='App'>
      {posts.comments.slice(-3).map((post) => (
        <div key={post.id} className='message'>
          <div className='message__logo'>
            <h3>{post.user.username}</h3>
          </div>

          <div className='message__text'>{post.body}</div>

          <button
            onClick={() => deletePost(post.id)}
            className='message__button'
          >
            X
          </button>
        </div>
      ))}

      <div className='form'>
        <textarea
          className='form__text'
          placeholder='Lorem ipsum'
          value={newPostBody}
          onChange={handleChange}
        ></textarea>
        <button type='submit' className='form__button' onClick={addPost}>
          Send
        </button>
      </div>
    </div>
  )
}

export default App
