import { Button, Center, Container } from '@mantine/core';
import { IconLogin } from '@tabler/icons';

import { useAuth } from '@redwoodjs/auth';
import { navigate } from '@redwoodjs/router';
import { MetaTags } from '@redwoodjs/web';

const LoginPage = () => {
  const { isAuthenticated, logIn, loading } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/signup');
    }
  }, [isAuthenticated]);

  return (
    <Container>
      <MetaTags robots="none" title="Login to Council" />
      <Center style={{ height: 800 }}>
        <Button
          leftIcon={<IconLogin size={16} />}
          loaderPosition="center"
          loading={loading}
          onClick={() => {
            void logIn();
          }}
        >
          Login to Council
        </Button>
      </Center>
    </Container>
  );
};

export default LoginPage;
