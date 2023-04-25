import React from "react";
import { Route, Router, Routes } from "react-router-dom";
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
import MessagesPage from "./pages/messagesPage";
import MessagesNewPage from "./pages/messagesNewPage";
import ChatPage from "./pages/chatPage";
import NotificationPage from "./pages/notificationPage";

import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

export default function App(){
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
                <Route path='/messages' element={<MessagesPage />} />
                <Route path='/messages/new' element={<MessagesNewPage />} />
                <Route path='/messages/:chatId' element={<ChatPage />} />
                <Route path='/notifications' element={<NotificationPage />} />
                
            </Routes>
        </QueryClientProvider>
    )
}