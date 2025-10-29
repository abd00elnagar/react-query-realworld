import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import apiClient from '@/repositories/apiClient';
import ServerErrorAlert from '@/components/common/ServerErrorAlert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate, faFileLines, faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './RevisionList.css';

// Format date with time
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

type Revision = {
  id: number;
  article_id: number;
  title: string;
  slug: string;
  description: string;
  body: string;
  created_at: string;
  updated_at: string;
};

interface RevisionListProps {
  articleSlug: string;
  onClose?: () => void;
  articleTitle: string;
}

function RevisionList({ articleSlug, articleTitle }: RevisionListProps) {
  const navigate = useNavigate();
  const { revisionId: currentRevisionId } = useParams<{ revisionId?: string }>();
  // onClose()
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [revertingId, setRevertingId] = useState<number | null>(null);

  const fetchUrl = useMemo(() => `/articles/${encodeURIComponent(articleSlug)}/revisions`, [articleSlug]);

  const load = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get(fetchUrl)
      .then((res) => {
        console.log('Revisions response for', articleSlug, res.data);
        const data: any = res.data;
        setRevisions(data.revisions);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUrl]);

  const handleRevisionClick = (revision: Revision) => {
    // Use replace to prevent adding to history stack
    navigate(`/article/${articleSlug}/revisions/${revision.id}`, { replace: true });
  };

  const handleRevert = async (e: React.MouseEvent, revision: Revision) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't do anything if already reverting
    if (revertingId) return;

    setRevertingId(revision.id);
    setError(null);

    try {
      const response = await apiClient.post(`/articles/${articleSlug}/revisions/${revision.id}/revert`);

      if (response.data.article) {
        const newSlug = response.data.article.slug;
        // If the slug hasn't changed, just refresh the page
        if (newSlug === articleSlug) {
          window.location.reload();
          return;
        }
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Failed to revert revision:', err);
      setError(err instanceof Error ? err : new Error('Failed to revert revision'));
      setRevertingId(null);
    }
  };

  return (
    <div className="revision-list-container">
      <div className="revision-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Article
        </button>
        <h1 className="revision-title">{articleTitle}</h1>
        <h2>Article Revisions</h2>
        <p className="revision-subtitle">View and manage all revisions of this article</p>
      </div>

      <div className="revision-content">
        {error ? (
          <div className="error-container">
            <ServerErrorAlert error={error} />
          </div>
        ) : loading && revisions.length === 0 ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading revisions...</p>
          </div>
        ) : revisions.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faFileLines} className="empty-icon" />
            <h3>No revisions found</h3>
            <p>Edit the article to create the first revision</p>
          </div>
        ) : (
          <div className="revision-grid">
            {revisions.map((rev) => (
              <div
                key={rev.id}
                className={`revision-card ${currentRevisionId === rev.id.toString() ? 'revision-card-active' : ''}`}
              >
                <div
                  className="revision-card-content"
                  onClick={() => handleRevisionClick(rev)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRevisionClick(rev)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900" title={rev.title}>
                        {rev.title || 'Untitled Revision'}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500">
                        {rev.created_at && formatDate(rev.created_at)}
                        {currentRevisionId === rev.id.toString() && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="mt-2 sm:mt-0 flex space-x-2"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    role="presentation"
                  >
                    <div className="revision-actions">
                      <Link
                        to={`/article/${articleSlug}/revisions/${rev.id}`}
                        className="view-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleRevert(e, rev)}
                        disabled={revertingId === rev.id}
                        className="revert-btn"
                      >
                        {revertingId === rev.id ? (
                          <>
                            <FontAwesomeIcon icon={faRotate} className="animate-spin" />
                            Reverting...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faRotate} />
                            Revert
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="revision-card-body">
                  <p className="revision-description">
                    {rev.description || 'No description provided for this revision.'}
                  </p>
                  <div className="revision-stats">
                    <span className="revision-stat">
                      <FontAwesomeIcon icon={faFileLines} className="mr-1" />
                      {rev.body.split('\n').length} lines
                    </span>
                    <span className="revision-stat">{new Date(rev.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RevisionList;
