import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import UserInfo from "./UserInfo";
import Tabs from "./Tabs";
import PhotoGrid from "./PhotoGrid";
import ShortsGrid from "./ShortsGrid";
import { MdVideoLibrary } from 'react-icons/md';
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS } from '../../graphql/mutations';
import { all } from "axios";
import { GetTokenFromCookie } from '../getToken/GetToken';

const shortsVideos = [
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b5e00f447af?auto=format&fit=crop&w=800&q=80",
];

export default function Main() {
  const [activeTab, setActiveTab] = useState(0); // 0: Feeds, 1: Shorts, 2: Tag
  const tabRefs = [useRef(null), useRef(null), useRef(null)];
  const [underline, setUnderline] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
    const [allPosts, setAllPosts] = useState([]);

  // Convert profile to state for dynamic updates
  const [profile, setProfile] = useState({
    
      id: "122221112",
      name:  "Katty Abrohams",
      avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=800&q=80",
      bio: "Embracing the mountain air \uD83C\uDFD4\uFE0F\nContent creator \uD83D\uDCF8",
      stats: {
        followers: 0,
        following: 0,
        posts: 0,
      }
  })
  

//   useEffect(() => {
//   const decodedUser = GetTokenFromCookie();
//   console.log("User Info:", decodedUser);

//   if (decodedUser) {
//     setProfile(prev => ({
//       ...prev,
//       id: decodedUser.id || prev.id,
//       name: decodedUser.name || prev.name,
//       avatar: decodedUser.avatar || prev.avatar,
//       cover: decodedUser.cover || prev.cover,
//       bio: decodedUser.bio || prev.bio,
//       stats: decodedUser.stats || prev.stats
//     }));
//   }
// }, []);


  useEffect(() => {
  const decodedUser = GetTokenFromCookie();

  if (decodedUser) {
    setProfile({
      id:  "122221112",
      name: decodedUser.name || "Katty Abrohams",
      avatar: decodedUser.profileImage || "https://randomuser.me/api/portraits/women/8.jpg",
      cover: decodedUser.profileImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=cover&w=800&q=80",
      bio: decodedUser.bio || "Embracing the mountain air 🗻\nContent creator 📸",
      stats: {
        followers: decodedUser.followers.length || 0,
        following: decodedUser.following.length || 0,
        posts: decodedUser.posts.length || 0,
      },
    });
  }
}, []);

  // Function to update profile data
  const updateProfile = (updates) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      // Save to localStorage
      // localStorage.setItem('userProfile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  useLayoutEffect(() => {
    const node = tabRefs[activeTab].current;
    if (node) {
      setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
    }
  }, [activeTab]);

  // Set initial underline position for Feeds tab
  useLayoutEffect(() => {
    const node = tabRefs[0].current;
    if (node && !underline) {
      setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
    }
  }, [underline]);

  // Fetch posts from backend
  const { data, loading, error,refetch } = useQuery(GET_ALL_POSTS);
 console.log(data);
 
   useEffect(() => {
    if (data?.getAllPosts) {      
      setAllPosts(data.getAllPosts); // initial set
    }
  }, [data]);

  useEffect(()=>{
     window.addEventListener("postDeleted", () => {
    refetch(); // ya state update
  });
  },[])

  const photos = allPosts? allPosts.map(post => post.imageUrl) : [];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center w-full text-xs sm:text-sm md:text-base overflow-x-hidden">
      <ProfileHeader profile={profile} updateProfile={updateProfile} />
      <div className="h-8 xs:h-10 sm:h-14" />
      <UserInfo profile={profile} setProfile={setProfile} isFollowed={isFollowed} setIsFollowed={setIsFollowed} />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabRefs={tabRefs} />
      <div className="w-full max-w-md px-1 xs:px-2 sm:px-4 py-2 xs:py-4 sm:py-6">
        {loading && <div>Loading...</div>}
        {error && <div>Error loading posts</div>}
        {activeTab === 0 ? (
          <PhotoGrid photos={photos} />
        ) : activeTab === 1 ? (
          <ShortsGrid shortsVideos={shortsVideos} />
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>
    </div>
  );
}

