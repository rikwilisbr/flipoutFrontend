import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import SucessRegister from "./pages/sucessRegister";
import Home from "./pages/home";
import Post from "./pages/post";
import Profile from "./pages/profile";
import ProfileAuth from "./pages/profileAuth";
import FollowingPage from "./pages/followingPage";
import FollowersPage from "./pages/followersPage";
import SearchUsers from "./pages/searchUsers";
import SearchPosts from "./pages/searchPosts";
import SearchAuth from "./pages/searchAuth";
import PageNotFound from "./pages/pageNotFound";
import InboxPage from "./pages/inboxPage";
import InboxNewPage from "./pages/inboxNewPage";
import ChatPage from "./pages/chatPage";
import NotificationPage from "./pages/notificationPage";

import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

export default function App(){
    const resizeOps = () => {
        document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
      };
    
      resizeOps();
      window.addEventListener("resize", resizeOps);
    return(
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path='*' element={<PageNotFound />} />
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path="/search" element={<SearchAuth />}/>
                <Route path="/search/users" element={<SearchUsers />}/>
                <Route path="/search/posts" element={<SearchPosts />}/>
                <Route path='/sucessRegister' element={<SucessRegister />}/>
                <Route path='/posts/:postid' element={<Post />} />
                <Route path='/profile' element={<ProfileAuth />} />
                <Route path='/profile/:username' element={<Profile />} />
                <Route path='/profile/:username/following' element={<FollowingPage />} />
                <Route path='/profile/:username/followers' element={<FollowersPage />} />
                <Route path='/inbox' element={<InboxPage />} />
                <Route path='/inbox/new' element={<InboxNewPage />} />
                <Route path='/messages/:chatId' element={<ChatPage />} />
                <Route path='/notifications' element={<NotificationPage />} />
                
            </Routes>
        </QueryClientProvider>
    )
}