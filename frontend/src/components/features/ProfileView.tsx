import { uploadImage } from '@/api';
import { AvatarSize, CustomAvatar } from '@/components/ui/CustomAvatar';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@travel-together/shared/types/post.types';
import { User } from '@travel-together/shared/types/user.types';
import { MapPin, Pencil, X } from 'lucide-react';
import React from 'react';
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { PostCard } from './PostCard';
import styles from './ProfileView.module.css';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ProfileViewProps {
  currentUserId?: string;
  isEditable?: boolean;
  onLikeToggle?: (postId: string) => void;
  postCount: number;
  posts: Post[];
  user: User;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUserId,
  isEditable = false,
  onLikeToggle,
  postCount,
  posts,
  user,
  onLoadMore,
  hasMore = false,
  isFetchingNextPage = false
}) => {
  const maxProfilePhotoSizeBytes = 2 * 1024 * 1024;
  const { updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [username, setUsername] = React.useState(user.username);
  const [avatarPreview, setAvatarPreview] = React.useState(user.avatarUrl || '');
  const [selectedAvatar, setSelectedAvatar] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setUsername(user.username);
    setAvatarPreview(user.avatarUrl || '');
    setSelectedAvatar(null);
  }, [user.avatarUrl, user.username]);

  React.useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    if (file.size > maxProfilePhotoSizeBytes) {
      setError('Profile photo is too large. Please choose an image smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    setSelectedAvatar(file);
    setError(null);

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview((currentPreview) => {
      if (currentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(currentPreview);
      }

      return previewUrl;
    });
  };

  const handleSave = async () => {
    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 2) {
      setError('Username must be at least 2 characters long.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      let avatarUrl = avatarPreview || undefined;
      if (selectedAvatar) {
        avatarUrl = await uploadImage(selectedAvatar);
      }

      await updateProfile({
        avatarUrl,
        username: trimmedUsername
      });
      setSelectedAvatar(null);
      setIsEditOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadMoreRef = useIntersectionObserver({
    onIntersect: () => {
      if (hasMore && !isFetchingNextPage) {
        onLoadMore?.();
      }
    },
    enabled: hasMore && !isFetchingNextPage
  });

  return (
    <>
      <section className={`bg-hero py-5 ${styles.hero}`}>
        <Container className="d-flex flex-column align-items-center text-center gap-3">
          <CustomAvatar
            imageUrl={user.avatarUrl}
            altText={user.username}
            size={AvatarSize.EXTRA_LARGE}
            fallback={user.username}
            className={styles.heroAvatar}
          />

          <div>
            <h1 className={`${styles.heroTitle} mb-1`}>{user.username}</h1>
            <p className="small text-muted-fg mb-1">{user.bio || user.email}</p>
            <div className="d-flex align-items-center justify-content-center gap-1 small text-muted-fg">
              <MapPin size={12} />
              <span>{postCount} posts</span>
            </div>
          </div>

          {isEditable ? (
            <Button
              variant="outline-secondary"
              size="sm"
              className="d-flex align-items-center gap-1"
              onClick={() => {
                setUsername(user.username);
                setAvatarPreview(user.avatarUrl || '');
                setSelectedAvatar(null);
                setError(null);
                setIsEditOpen(true);
              }}
            >
              <Pencil size={12} />
              Edit Profile
            </Button>
          ) : null}
        </Container>
      </section>

      <Container className="py-4 py-md-5">
        {posts.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted mb-0">No posts yet.</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {posts.map((post) => (
              <Col key={post._id}>
                <PostCard post={post} currentUserId={currentUserId} onLikeToggle={onLikeToggle} />
              </Col>
            ))}
          </Row>
        )}

        <div ref={loadMoreRef} className="d-flex justify-content-center mt-5 py-4">
          {isFetchingNextPage && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Loading more...</p>
            </div>
          )}
        </div>
      </Container>

      {isEditable ? (
        <Modal
          show={isEditOpen}
          onHide={() => setIsEditOpen(false)}
          centered
          dialogClassName={styles.editModal}
        >
          <Modal.Header className="border-bottom-0 pb-0">
            <Modal.Title className="fs-1 fw-semibold" style={{ fontSize: '1.2rem' }}>
              Edit Profile
            </Modal.Title>
            <button
              type="button"
              className="btn btn-link text-muted p-0 border-0 ms-auto"
              onClick={() => {
                setAvatarPreview(user.avatarUrl || '');
                setSelectedAvatar(null);
                setError(null);
                setIsEditOpen(false);
              }}
              aria-label="Close"
            >
              <X size={28} />
            </button>
          </Modal.Header>
          <Modal.Body className="pt-3">
            {error ? <Alert variant="danger">{error}</Alert> : null}

            <div className="text-center mb-4">
              <CustomAvatar
                imageUrl={avatarPreview}
                altText={username || user.username}
                size={AvatarSize.LARGE}
                fallback={username || user.username}
                className={styles.modalAvatar}
              />
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button className="btn-primary w-100" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}
    </>
  );
};
