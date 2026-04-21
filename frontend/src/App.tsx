import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/features/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CreatePost } from "./pages/CreatePost";
import { NotFound } from "./pages/NotFound";
import { PostsFeedContainer } from "./containers/PostsFeedContainer";
import { PostDetailContainer } from "./containers/PostDetailContainer";
import { ProfileContainer } from "./containers/ProfileContainer";
import { EditPostContainer } from "./containers/EditPostContainer";
import { MyPostsContainer } from "./containers/MyPostsContainer";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Simple mock check for task 4 (proper auth is task 11)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUsername('TestUser'); // Mock username
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100 bg-light">
          <Navbar 
            isAuthenticated={isAuthenticated} 
            username={username} 
            onLogout={handleLogout} 
          />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<PostsFeedContainer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfileContainer />} />
              <Route path="/my-posts" element={<MyPostsContainer />} />
              <Route path="/posts/create" element={<CreatePost />} />
              <Route path="/posts/:id" element={<PostDetailContainer />} />
              <Route path="/posts/:id/edit" element={<EditPostContainer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
