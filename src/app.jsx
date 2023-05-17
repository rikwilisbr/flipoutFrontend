import React from "react";
import { useEffect } from "react";
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
import RecoveryPassPage from "./pages/recoveryPass";
import RecoveryPassPage_Auth from "./pages/recoveryPass_Auth";
import RecoveryPassPage_ChangePass from "./pages/recoveryPass_ChangePass";
import { MyRecoveryDataProvider } from "./contexts/recoveryPassContext";

import {QueryClient, QueryClientProvider} from 'react-query';


const queryClient = new QueryClient();

export default function App(){
    return(
        <QueryClientProvider client={queryClient}>
        <MyRecoveryDataProvider>
            <Routes>
                <Route path='*' element={<PageNotFound />} />
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/recovery' element={<RecoveryPassPage />} /> 
                <Route path='/recovery/auth' element={<RecoveryPassPage_Auth/>} />
                <Route path='/recovery/change_password' element={<RecoveryPassPage_ChangePass/>} />
                <Route path="/search" element={<SearchAuth />}/>
                <Route path="/search/users" element={<SearchUsers />}/>
                <Route path="/search/posts" element={<SearchPosts />}/>
                <Route path='/success' element={<SucessRegister />}/>
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
        </MyRecoveryDataProvider>
        </QueryClientProvider>
    )
}