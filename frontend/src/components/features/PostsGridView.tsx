import React from 'react';
import { Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '@travel-together/shared/types/post.types';
import { PostCard } from './PostCard';
import { useSearch } from '@/hooks/useSearch';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface PostsGridViewProps {
  currentUserId?: string;
  onLikeToggle?: (postId: string) => void;
  ctaLabel?: string;
  ctaTo?: string;
  emptyActionLabel?: string;
  emptyActionTo?: string;
  emptyMessage: string;
  posts: Post[];
  searchPlaceholder?: string;
  title: string;
  subtitle?: string;
  isLoadingPosts?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  showSearch?: boolean;
}

export const PostsGridView: React.FC<PostsGridViewProps> = ({
  currentUserId,
  onLikeToggle,
  ctaLabel,
  ctaTo,
  emptyActionLabel,
  emptyActionTo,
  emptyMessage,
  posts,
  searchPlaceholder = 'Search destinations, stories...',
  title,
  subtitle,
  isLoadingPosts = false,
  onLoadMore,
  hasMore = false,
  isFetchingNextPage = false,
  showSearch = true
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

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    hasNextPage: hasNextSearchPage,
    fetchNextPage: fetchNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage
  } = useSearch(debouncedSearchValue);

  const isLoading = (showSearch && debouncedSearchValue) ? isSearchLoading : isLoadingPosts;
  const showLoadMore = (showSearch && debouncedSearchValue) ? hasNextSearchPage : hasMore;
  const isFetchingNext = (showSearch && debouncedSearchValue) ? isFetchingNextSearchPage : isFetchingNextPage;

  const handleLoadMore = React.useCallback(() => {
    if (showSearch && debouncedSearchValue) {
      if (hasNextSearchPage && !isFetchingNextSearchPage) {
        fetchNextSearchPage();
      }
    } else {
      if (hasMore && !isLoadingPosts && !isFetchingNextPage) {
        onLoadMore?.();
      }
    }
  }, [
    showSearch,
    debouncedSearchValue,
    hasNextSearchPage,
    isFetchingNextSearchPage,
    fetchNextSearchPage,
    hasMore,
    isLoadingPosts,
    isFetchingNextPage,
    onLoadMore
  ]);

  const loadMoreRef = useIntersectionObserver({
    onIntersect: handleLoadMore,
    enabled: showLoadMore && !isLoading && !isFetchingNext
  });

  const displayPosts = React.useMemo(() => {
    if (!showSearch || !debouncedSearchValue) {
      return posts;
    }

    if (!searchResults?.pages) {
      return [];
    }

    return (searchResults.pages.flatMap((page) => page.data) as Post[]) || [];
  }, [posts, showSearch, debouncedSearchValue, searchResults]);



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

          {showSearch && (
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
          )}
        </Container>
      </section>

      <Container as="main" className="py-4 py-md-5">
        {ctaLabel && ctaTo && !debouncedSearchValue ? (
          <div className="d-flex justify-content-end mb-4">
            <Link to={ctaTo} className="btn btn-primary">
              {ctaLabel}
            </Link>
          </div>
        ) : null}

        {displayPosts.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted fs-5 mb-4">{isLoading ? 'Searching...' : emptyMessage}</p>
            {!isLoading && emptyActionLabel && emptyActionTo ? (
              <Link to={emptyActionTo} className="btn btn-outline-primary">
                {emptyActionLabel}
              </Link>
            ) : null}
          </div>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {displayPosts.map((post) => (
                <Col key={post._id}>
                  <PostCard post={post} currentUserId={currentUserId} onLikeToggle={onLikeToggle} />
                </Col>
              ))}
            </Row>

            <div ref={loadMoreRef} className="d-flex justify-content-center mt-5 py-4">
              {isFetchingNext && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-2">Loading more...</p>
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
};
