import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/repositories/apiClient';
import ServerErrorAlert from '@/components/common/ServerErrorAlert';
import './RevisionDetailPage.css';

// Simple date formatter
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

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Back arrow icon component
const BackArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-2"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// File text icon component with className prop
const FileTextIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-gray-400 mb-4 ${className}`}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 8 9 8 7" />
  </svg>
);

// Code icon component
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-2"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// Calendar icon component
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-1"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Rotate icon component
const RotateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-2"
  >
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const RevisionDetailPage = () => {
  const { slug, revisionId } = useParams<{ slug: string; revisionId: string }>();
  const navigate = useNavigate();

  const {
    data: revision,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['revision', slug, revisionId],
    queryFn: async () => {
      try {
        // Try to get the revision directly first
        const revisionRes = await apiClient.get(`/articles/${slug}/revisions/${revisionId}`);
        return revisionRes.data.revision;
      } catch (error: any) {
        // If direct fetch fails, try getting the article ID first
        if (error.response?.status === 404) {
          const articleRes = await apiClient.get(`/articles/${slug}`);
          const articleId = articleRes.data.article.id;
          const revisionRes = await apiClient.get(`/articles/${articleId}/revisions/${revisionId}`);
          return revisionRes.data.revision;
        }
        throw error; // Re-throw other errors
      }
    },
    retry: 1, // Retry once if the first attempt fails
  });

  const handleRevert = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!revision) return;

    try {
      const response = await apiClient.post(`/articles/${slug}/revisions/${revision.id}/revert`);
      if (response.data.article) {
        const newSlug = response.data.article.slug;
        // Navigate to the article page with the new slug
        navigate(`/article/${newSlug}`, { replace: true });
      }
    } catch (err) {
      console.error('Failed to revert revision:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="revision-detail-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="revision-detail-container">
        <ServerErrorAlert error={error} />
      </div>
    );
  }

  if (!revision) {
    return (
      <div className="revision-detail-container">
        <div className="not-found-container text-center py-12">
          <FileTextIcon className="mx-auto" />
          <h2 className="mt-4 text-xl font-medium text-gray-900">Revision not found</h2>
          <p className="mt-2 text-gray-500">The requested revision could not be found.</p>
          <button onClick={() => navigate(`/article/${slug}`)} className="back-button">
            <BackArrow />
            Back to Article
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="revision-detail-container">
      <button onClick={() => navigate(`/article/${slug}/revisions`)} className="back-button">
        <BackArrow /> Back to revisions
      </button>
      <div className="revision-header">
        <h1 className="revision-title">{revision.title || 'Untitled Revision'}</h1>
        <div className="revision-meta">
          <span className="meta-item">
            <CalendarIcon />
            {formatDate(revision.created_at)}
          </span>
          <button onClick={handleRevert} className="revert-button">
            <RotateIcon /> Revert to this version
          </button>
        </div>
      </div>

      {revision.description && (
        <div className="section">
          <h2 className="section-title">
            <FileTextIcon className="inline-block" />
            Description
          </h2>
          <div className="section-content">{revision.description}</div>
        </div>
      )}

      <div className="section">
        <h2 className="section-title">
          <CodeIcon />
          Content
        </h2>
        <div className="code-block">
          <pre>{revision.body || 'No content available'}</pre>
        </div>
      </div>
    </div>
  );
};

export default RevisionDetailPage;
