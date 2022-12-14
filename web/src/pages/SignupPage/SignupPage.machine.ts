import { createMachine } from 'xstate';

export const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGUCWUB2BXADgBQEMYA6AMwHsAnAWwGIA1AQQBkBJAEUYBUBRAbQAMAXUSgc5WKgAuqchlEgAHogAcAdgA0IAJ6IAjAJUBWYnqMA2PSpUDDFgCzmAvk61pMuQiQo1iANwIAG1QIAhkMKFoIOTBiVAw-cgBrWPdsfCJYn2p-IJCw+KgEeMSAYwK5QSEqhXFJGTkFZQR7VuIjNQEAJns1LoBOLq6AZnNNHUR+83N20fsBYa7rYft+tRc3dHSvLKocgODQ8MjojFiS5NStz0yyPdzDgojihPJyhowqvj0RJBA66SyeR-ZqteztTo9PqDEZjLS6BB6PRDYj9ASWcz9Ix6LECNTDDYgNI3bz3A75Y60ADCAAlGAA5ADiPAA+gAxADyACUALI1P4Aj5NRA9PTEdHmFZdCzmezqAT2eGTYb9YjTabdHFDNRrQnEjKk3wlPIQal0pmszm8-liCSAxog-QCfrDYgjBb9eaeroKoxKhBrMWrfouiwDXr2PR664G3a+cmm5AAVQAQjzWFwbf87ULHQgumo1MQ1Co0aWunpJQMLP69CtUSHPcZfc7kdGPLG7vGTWaGcz2dy+cJajmgcKEKWBKY5cN8Solo5zF1-YNVY2XSo9H0lx129tbrAsAAjajSSmnc6vFLEfU7YiHk9nwovMoVT7CLOCsd5rpjYuT8tK0WLFzH9ecGxDSx+hsLEtyMPcSViB9TykSkwEoSgqGIHBAjCbIbxjO9kKfZ4LneIEvmHAVRwdUBmgLIsSzLQYgOrUCJkRYxiGDT1JSXAYlxcVwQAwcgIDgBRb0yEd6m-OjEAAWn6f0FJmWxbCMQZJSMYYrCjYSpMNagZPtYF5IQFUwPmCCXWmIZhnRfoEM7fCEyeKATNzcyhjFSdNL0ewfVGSDa3RFRxT6YwhhsSx1Gcu98ONQ5PLkpQnR1bi1FlUsrGMTdFQ4gwQ1RdErA6LdNwJAzCNuVyTRS2i0onARfOxVZ8RWMw5RXTTZklawjF6QMunig9jxQ44GrMprAtrFVuMbYYjBglYspUUaSEkDsuTAABHLA4CkSApvHQt-V6KceMWAbjFWoSnCAA */
  createMachine({
    tsTypes: {} as import('./SignupPage.machine.typegen').Typegen0,
    schema: {},
    predictableActionArguments: true,
    initial: 'form',
    states: {
      form: {
        initial: 'validating',
        states: {
          validating: {
            entry: 'clearFieldErrors',
            invoke: {
              src: 'validateSignup',
              onDone: [
                {
                  target: 'valid',
                  cond: 'signupValid?',
                },
                {
                  target: 'invalid',
                  actions: 'setFieldErrors',
                },
              ],
            },
            on: {
              CHANGE_FORM: {
                actions: ['cancelValidation', 'scheduleValidation'],
              },
            },
          },
          invalid: {
            on: {
              CHANGE_FORM: {
                actions: ['cancelValidation', 'scheduleValidation'],
              },
            },
          },
          valid: {
            on: {
              SUBMIT: {
                target: '#SignupPage.submitting',
              },
              CHANGE_FORM: {
                target: 'invalid',
                actions: ['cancelValidation', 'scheduleValidation'],
              },
            },
          },
        },
        on: {
          VALIDATE: {
            target: '.validating',
          },
        },
      },
      submitting: {
        invoke: {
          src: 'requestSignup',
          onDone: [
            {
              target: 'signupRequested',
            },
          ],
          onError: [
            {
              target: '#SignupPage.form.valid',
            },
          ],
        },
      },
      signupRequested: {
        entry: 'signupRequested',
      },
    },
    id: 'SignupPage',
  });
