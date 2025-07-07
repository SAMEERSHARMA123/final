import React, { useEffect, useRef, useState } from "react";
import Navbar from "../navbar/Navbar";
import StoryBar from "../storyBar/Storybar";
import FooterNav from "../footer/FooterNav";
import SocialPost from "../socialPost/SocialPost";
import CombinedLogin from "../login/CombinedLogin";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/mutations';
import axios from "axios";
import { GetTokenFromCookie } from '../getToken/GetToken';

const Main = () => {
  const storyBarRef = useRef(null);
  const token = sessionStorage.getItem('user');
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [tokens,setTokens] = useState();

  const scrollStories = (direction) => {
    const scrollAmount = 150;
    if (storyBarRef.current) {
      storyBarRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(()=>{
        const decodedUser = GetTokenFromCookie();
      setTokens(decodedUser);
  
    },[])

    const handleCommentPost = async(id,text) => {
         console.log(id,text);
        try {
        const query = ` mutation CommentPost($userId: ID!,$postId: ID!, $text:String!) { CommentPost(userId: $userId,postId: $postId, text:$text){
        text
      commentedAt
      user {
        name
        username
        profileImage
      }

        }}`;
        const variables = {  userId: tokens.id, postId : id,text : text};

        const response = await axios.post("https://final-mpzg.onrender.com/graphql", { query: query, variables: variables }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(response);        
        // Refetch posts to get updated like status
        // refetch();
    }
    catch (err) {
      console.error(err);
    }

       
  }

  const handleLikePost = async(id) => {
    
        try {
        const query = ` mutation LikePost($userId: ID!,$postId: ID!) { LikePost(userId: $userId,postId: $postId)}`;
        const variables = {  userId: tokens.id, postId : id};

        const response = await axios.post("https://final-mpzg.onrender.com/graphql", { query: query, variables: variables }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(response);
        
        // Refetch posts to get updated like status
    }
    catch (err) {
      console.error(err);
    }

       
  }

  const handleDeletePost = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?");

      if (confirmDelete) {
        const query = ` mutation DeletePost($id: ID!) { DeletePost(id: $id) }`;
        const variables = { id: id };

        const response = await axios.post("https://final-mpzg.onrender.com/graphql", { query: query, variables: variables }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response?.data?.data?.DeletePost) {
          alert(response.data.data.DeletePost)
          setAllPosts((prev) => prev.filter((p) => p.id !== id));
          window.dispatchEvent(new Event("postDeleted"));

        }
      }
      else {
        console.log("User cancelled delete");
      }
    }
    catch (err) {
      console.error(err);
    }

  };

  // Fetch posts from backend
  const { data, loading, error, refetch } = useQuery(GET_ALL_POSTS);
  

  useEffect(() => {
    if (data?.getAllPosts) {    
      setAllPosts(data.getAllPosts); // initial set
    }
  }, [data]);

  // Refetch data when tokens are available
  useEffect(() => {
    if (tokens?.id) {
      refetch();
    }
  }, [tokens, refetch]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-16 pb-20 md:ml-64"> {/* Added margin-left for sidebar on desktop */}
        <div className="max-w-4xl mx-auto px-4">
          {/* Story Bar */}
          <div className="bg-white shadow-sm mb-4 rounded-lg">
            <StoryBar storyBarRef={storyBarRef} scrollStories={scrollStories} />
          </div>

          {/* Footer */}
          <div className="mb-4">
            <FooterNav />
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {loading && <div>Loading...</div>}
            {error && <div>Error loading posts</div>}
            {allPosts && allPosts.map((post) => (
              <SocialPost
                key={post.id}
                avatarSrc={post.createdBy?.profileImage || "https://ui-avatars.com/api/?name=User&background=random"}
                username={post.createdBy?.name || "User"}
                handle={post.createdBy?.username ? `@${post.createdBy.username}` : "@user"}
                postImageSrc={post.imageUrl}
                caption={post.caption}
                initialLikes={post.likes?.length || 0}
                initialComments={post.comments?.length || 0}
                onDelete={() => handleDeletePost(post.id)}
                onLike={() => handleLikePost(post.id)}
                isInitiallyLiked={post?.likes?.some(like => like.user?.id === tokens?.id)}
                onComment={(text) => handleCommentPost(post.id, text)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
