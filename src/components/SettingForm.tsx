import { QUERY_USER_KEY } from '@/constants/query.constant';
import useInputs from '@/lib/hooks/useInputs';
import queryClient from '@/queries/queryClient';
import { usePutUserMutation } from '@/queries/user.query';
import { useNavigate } from 'react-router-dom';
import ServerErrorAlert from '@/components/common/ServerErrorAlert';

interface ISettingFormProps {
  data: { [key: string]: string | number };
}

const SettingForm = ({ data }: ISettingFormProps) => {
  const navigate = useNavigate();
  const [userData, onChangeUserData] = useInputs({
    email: data.email,
    username: data.username,
    bio: data.bio,
    image: data.image,
    password: '',
  });

  const putUserMutation = usePutUserMutation();

  const onUpdateSetting = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filteredUser: Record<string, string> = {};

    // Only send email/username if changed to avoid unique validation on same values
    if (userData.email && userData.email !== String(data.email)) {
      filteredUser.email = userData.email as string;
    }
    if (userData.username && userData.username !== String(data.username)) {
      filteredUser.username = userData.username as string;
    }

    // Send bio even if empty to allow clearing it (passes string rule)
    if (userData.bio !== undefined && userData.bio !== null) {
      filteredUser.bio = String(userData.bio);
    }

    // Only send image if non-empty to satisfy url rule
    if (userData.image) {
      filteredUser.image = userData.image as string;
    }

    // Only send password if provided
    if (userData.password) {
      filteredUser.password = userData.password as string;
    }

    putUserMutation.mutate(
      { user: filteredUser },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [QUERY_USER_KEY] });
          navigate('/');
        },
      },
    );
  };

  return (
    <>
      {putUserMutation.isError && <ServerErrorAlert error={putUserMutation.error} />}
      <form onSubmit={onUpdateSetting}>
        <fieldset>
          <fieldset className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              name="image"
              value={userData.image}
              onChange={onChangeUserData}
            />
          </fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Your Name"
              name="username"
              value={userData.username}
              onChange={onChangeUserData}
            />
          </fieldset>
          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows={8}
              placeholder="Short bio about you"
              name="bio"
              value={userData.bio || ''}
              onChange={onChangeUserData}
            ></textarea>
          </fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={onChangeUserData}
            />
          </fieldset>
          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="Password"
              autoComplete="off"
              name="password"
              value={userData.password}
              onChange={onChangeUserData}
            />
          </fieldset>
          <button type="submit" className="btn btn-lg btn-primary pull-xs-right">
            Update Settings
          </button>
        </fieldset>
      </form>
    </>
  );
};

export default SettingForm;
