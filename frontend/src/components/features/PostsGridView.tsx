import React from 'react';
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '@travel-together/shared/types/post.types';
import { PostCard } from './PostCard';
import { useSearch } from '@/hooks/useSearch';

interface PostsGridViewProps {
  currentUserId?: string;
  ctaLabel?: string;
  ctaTo?: string;
  emptyActionLabel?: string;
  emptyActionTo?: string;
  emptyMessage: string;
  posts: Post[];
  searchPlaceholder?: string;
  title: string;
  subtitle?: string;
}

export const PostsGridView: React.FC<PostsGridViewProps> = ({
  currentUserId,
  ctaLabel,
  ctaTo,
  emptyActionLabel,
  emptyActionTo,
  emptyMessage,
  posts,
  searchPlaceholder = 'Search destinations, stories...',
  title,
  subtitle,
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const { data: searchResults, isLoading: isSearchLoading } = useSearch(debouncedSearchValue);

  const displayPosts = React.useMemo(() => {
    if (!debouncedSearchValue) {
      return posts;
    }

    if (!searchResults) {
      return [];
    }

    return searchResults
      .map((result) => posts.find((p) => p._id === result.contentId))
      .filter((post): post is Post => !!post);
  }, [posts, debouncedSearchValue, searchResults]);

  return (
    <div className="min-vh-100">
      <section className="bg-hero py-5 py-md-6">
        <Container className="text-center">
          <div className="mx-auto" style={{ maxWidth: 720 }}>
            <h1
              className="fw-bold mb-3"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)' }}
            >
              {title}
            </h1>
            {subtitle ? (
              <p className="text-muted-fg mt-2 mx-auto mb-0 fs-5" style={{ maxWidth: 560 }}>
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="mx-auto mt-4" style={{ maxWidth: 420 }}>
            <InputGroup>
              <InputGroup.Text style={{ background: 'hsl(var(--card))' }}>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={searchPlaceholder}
              />
            </InputGroup>
          </div>
        </Container>
      </section>

      <Container as="main" className="py-4 py-md-5">
        {ctaLabel && ctaTo ? (
          <div className="d-flex justify-content-end mb-4">
            <Link to={ctaTo} className="btn btn-primary">
              {ctaLabel}
            </Link>
          </div>
        ) : null}

        {displayPosts.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5 mb-4">
              {isSearchLoading ? 'Searching...' : emptyMessage}
            </p>
            {!isSearchLoading && emptyActionLabel && emptyActionTo ? (
              <Link to={emptyActionTo} className="btn btn-outline-primary">
                {emptyActionLabel}
              </Link>
            ) : null}
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {displayPosts.map((post) => (
              <Col key={post._id}>
                <PostCard post={post} currentUserId={currentUserId} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};
