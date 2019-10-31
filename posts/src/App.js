import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialPostFormState = {
  title: "",
  contents: "",
}
function App() {
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState(initialPostFormState);
  const [isEditingPost, setEditingPost] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:4000/api/posts').then(response => {
      console.log('get', response.data);
      setPosts(response.data);
    }).catch(err => console.log(err));
  }, []);

  const onPostInputChange = e => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  }

  const onPostSubmit = e => {
    e.preventDefault();
    if (isEditingPost === 0) {
      axios.post('http://localhost:4000/api/posts', postForm).then(response => {
        console.log('post', response.data);
        setPosts([...posts, { ...postForm, id: response.data.id }]);
      }).catch(err => console.log(err));
    } else {
      axios.put('http://localhost:4000/api/posts/' + isEditingPost, postForm).then(response => {
        console.log('put', response.data);
        setPosts(posts.map(post => {
          if (Number(post.id) === isEditingPost) return response.data;
          return post;
        }));
      }).catch(err => console.log(err));
    }
    setPostForm(initialPostFormState);
    setEditingPost(0);
  }

  const removePost = id => e => {
    axios.delete('http://localhost:4000/api/posts/' + id).then(response => {
      console.log('delete', response.data);
      debugger;
      setPosts(posts.filter(post => Number(post.id) !== Number(response.data.id)));
    }).catch(err => console.log(err));
  }

  const editPost = id => e => {
    setEditingPost(id);
    setPostForm(posts.find(post => Number(post.id) === Number(id)))
  }

  return (
    <div className="App">
      {
        posts ? posts.map(post => (
          <div key={post.id} className="post">
            <h2>Post #{post.id}</h2>
            <p><b>Title</b>: {post.title}</p>
            <p><b>Contents</b>: {post.contents}</p>
            <h3>Comments</h3>
            {
              post.comments.length ? post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <p><b>#{comment.id}</b>: {comment.text}</p>
                </div>
              )) : <p>No comments!</p>
            }
            <button className="editPost" onClick={editPost(post.id)}>Edit Post</button>
            <button className="removePost" onClick={removePost(post.id)}>Remove Post</button>
          </div>
        )) : null
      }
      <br />
      <form onSubmit={onPostSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Post title here"
          required
          value={postForm.title}
          onChange={onPostInputChange}
        />
        <input
          type="text"
          name="contents"
          placeholder="Post contents here"
          required
          value={postForm.contents}
          onChange={onPostInputChange}
        />
        <button className="submitPost">Submit</button>
      </form>
    </div>
  );
}

export default App;
