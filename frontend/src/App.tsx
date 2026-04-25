import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { EditPostContainer } from './containers/EditPostContainer';
import { MyPostsContainer } from './containers/MyPostsContainer';
import { PostDetailContainer } from './containers/PostDetailContainer';
import { PostsFeedContainer } from './containers/PostsFeedContainer';
import { ProfileContainer } from './containers/ProfileContainer';
import { Navbar } from './components/features/Navbar';
import { PageLoader } from './components/ui/PageLoader';
import { CreatePost } from './pages/CreatePost';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';

const queryClient = new QueryClient();

const AppShell = () => {
  const { currentUser, isAuthenticated, isInitializing, logout } = useAuth();

  if (isInitializing) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar isAuthenticated={isAuthenticated} onLogout={logout} currentUser={currentUser} />
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
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
