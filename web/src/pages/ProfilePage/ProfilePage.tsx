import { useAuth } from '@redwoodjs/auth';
import { MetaTags } from '@redwoodjs/web';

const ProfilePage = () => {
  const { isAuthenticated, logIn, logOut, currentUser } = useAuth();
  console.log(currentUser);

  return (
    <>
      <MetaTags title="Profile" description="Profile page" />

      {isAuthenticated ? (
        <div>
          {currentUser?.roles?.toString()}
          <button
            onClick={() => {
              logOut();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            logIn();
          }}
        >
          Login
        </button>
      )}
    </>
  );
};

export default ProfilePage;
