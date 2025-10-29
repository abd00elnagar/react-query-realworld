import { QUERY_ARTICLES_KEY } from '@/constants/query.constant';
import queryClient from '@/queries/queryClient';
import { useDeleteArticleMutation } from '@/queries/articles.query';
import { Link, useNavigate } from 'react-router-dom';
import { IArticle } from '@/interfaces/main';
import ServerErrorAlert from '@/components/common/ServerErrorAlert';
import { useState } from 'react';

interface IButtonsWIthAccessProps {
  articleInfo: IArticle;
}

const ButtonsWIthAccess = ({ articleInfo }: IButtonsWIthAccessProps) => {
  const navigate = useNavigate();
  const deleteArticleMutation = useDeleteArticleMutation();
  const onDelete = (slug: string) => {
    deleteArticleMutation.mutate(
      { slug },
      {
        onSuccess: (_) => {
          queryClient.invalidateQueries({ queryKey: [QUERY_ARTICLES_KEY] });
          navigate(`/`);
        },
      },
    );
  };

  return (
    <>
      {deleteArticleMutation.isError ? <ServerErrorAlert error={deleteArticleMutation.error} /> : null}
      <button
        className="btn btn-sm btn-outline-secondary"
        type="button"
        onClick={() => navigate(`/editor/${articleInfo.slug}`, { state: articleInfo })}
      >
        <i className="ion-edit"></i>&nbsp; Edit Article
      </button>
      &nbsp;&nbsp;
      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(articleInfo.slug)}>
        <i className="ion-trash-a"></i>&nbsp; Delete Article
      </button>
      &nbsp;&nbsp;
      <Link to={`/article/${articleInfo.slug}/revisions`} className="btn btn-sm btn-outline-secondary">
        View Revisions
      </Link>
    </>
  );
};

export default ButtonsWIthAccess;
