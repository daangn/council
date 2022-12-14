import * as React from 'react';

import {
  Box,
  Button,
  Center,
  Container,
  Group,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMachine } from '@xstate/react';
import {
  RequestSignup,
  RequestSignupVariables,
  ValidateSignup,
  ValidateSignupVariables,
} from 'types/graphql';
import { actions } from 'xstate';

import { MetaTags, useMutation } from '@redwoodjs/web';

import { useAuth0User } from 'src/utils/useAuth0User';

import { machine } from './SignupPage.machine';

const REQUEST_SIGNUP = gql`
  mutation RequestSignup($input: SignupInput!) {
    requestSignup(input: $input) {
      sessionId
    }
  }
`;

const VALIDATE_SIGNUP = gql`
  mutation ValidateSignup($input: SignupInput!) {
    validateSignup(input: $input) {
      username
      name
      email
    }
  }
`;

const SignupPage = () => {
  const title = 'Sign-up Administrator';

  const user = useAuth0User();

  const form = useForm({
    initialValues: {
      username: user.nickname || '',
      name: user.name || '',
      email: user.email || '',
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  const [validateSignup] = useMutation<ValidateSignup, ValidateSignupVariables>(
    VALIDATE_SIGNUP,
  );

  const [requestSignup] = useMutation<RequestSignup, RequestSignupVariables>(
    REQUEST_SIGNUP,
  );

  const [current, send] = useMachine(machine, {
    guards: {
      'signupValid?': (ctx, event) => {
        const {
          validateSignup: { username, name, email },
        } = event.data as ValidateSignup;
        return username && name && email;
      },
    },
    services: {
      requestSignup: () => {
        return requestSignup({ variables: { input: form.values } }).then(
          response => response.data,
        );
      },
      validateSignup: () => {
        return validateSignup({ variables: { input: form.values } }).then(
          response => response.data,
        );
      },
    },
    actions: {
      cancelValidation: actions.cancel('validation'),
      scheduleValidation: actions.send('VALIDATE', {
        id: 'validation',
        delay: 500,
      }),
      setFieldErrors: (ctx, event) => {
        const { validateSignup } = event.data as ValidateSignup;
        if (!validateSignup.username) {
          form.setFieldError('username', 'invalid username');
        }
        if (!validateSignup.name) {
          form.setFieldError('name', 'invalid name');
        }
        if (!validateSignup.email) {
          form.setFieldError('email', 'invalid email');
        }
      },
      clearFieldErrors: () => {
        form.clearErrors();
      },
      signupRequested: () => {
        console.log('test');
      },
    },
  });

  React.useEffect(() => {
    send('CHANGE_FORM');
  }, [form.values, send]);

  return (
    <Container>
      <MetaTags title={title} robots="none" />
      <Center>
        <h1>{title}</h1>
      </Center>
      <Box sx={{ maxWidth: 320 }} mx="auto">
        <form
          onSubmit={form.onSubmit(input => {
            requestSignup({ variables: { input } });
          })}
        >
          <TextInput
            type="text"
            label="Username"
            placeholder="Your username"
            withAsterisk
            {...form.getInputProps('username')}
          />
          <TextInput
            type="text"
            label="Name"
            placeholder="Your name"
            withAsterisk
            {...form.getInputProps('name')}
          />

          <TextInput
            type="email"
            label="Email"
            placeholder="your@email.com"
            withAsterisk
            {...form.getInputProps('email')}
          />

          <Group position="right" mt="md">
            <Button type="submit" disabled={!current.matches('form.valid')}>
              Sign-up
            </Button>
          </Group>
        </form>
      </Box>
    </Container>
  );
};

export default SignupPage;
