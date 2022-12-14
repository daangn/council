
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.SignupPage.form.validating:invocation[0]": { type: "done.invoke.SignupPage.form.validating:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.SignupPage.submitting:invocation[0]": { type: "done.invoke.SignupPage.submitting:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.SignupPage.submitting:invocation[0]": { type: "error.platform.SignupPage.submitting:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "requestSignup": "done.invoke.SignupPage.submitting:invocation[0]";
"validateSignup": "done.invoke.SignupPage.form.validating:invocation[0]";
        };
        missingImplementations: {
          actions: "cancelValidation" | "clearFieldErrors" | "scheduleValidation" | "setFieldErrors" | "signupRequested";
          delays: never;
          guards: "signupValid?";
          services: "requestSignup" | "validateSignup";
        };
        eventsCausingActions: {
          "cancelValidation": "CHANGE_FORM";
"clearFieldErrors": "VALIDATE" | "error.platform.SignupPage.submitting:invocation[0]" | "xstate.init";
"scheduleValidation": "CHANGE_FORM";
"setFieldErrors": "done.invoke.SignupPage.form.validating:invocation[0]";
"signupRequested": "done.invoke.SignupPage.submitting:invocation[0]";
        };
        eventsCausingDelays: {

        };
        eventsCausingGuards: {
          "signupValid?": "done.invoke.SignupPage.form.validating:invocation[0]";
        };
        eventsCausingServices: {
          "requestSignup": "SUBMIT";
"validateSignup": "VALIDATE" | "error.platform.SignupPage.submitting:invocation[0]" | "xstate.init";
        };
        matchesStates: "form" | "form.invalid" | "form.valid" | "form.validating" | "signupRequested" | "submitting" | { "form"?: "invalid" | "valid" | "validating"; };
        tags: never;
      }
