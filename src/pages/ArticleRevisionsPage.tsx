import { useParams, useNavigate } from 'react-router-dom';
import RevisionList from '@/components/revision/RevisionList';
import { useEffect, useState } from 'react';
import apiClient from '@/repositories/apiClient';

export default function ArticleRevisionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [articleTitle, setArticleTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiClient.get(`/articles/${slug}`);
        setArticleTitle(response.data.article.title);
      } catch (err) {
        console.error('Error fetching article:', err);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, navigate]);

  if (isLoading) {
    return <div className="py-4">Loading article...</div>;
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <RevisionList articleSlug={slug!} articleTitle={articleTitle!} onClose={() => window.history.back()} />
    </div>
  );
}
