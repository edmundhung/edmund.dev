---
title: Remixing Constraint Validation
description: >
  The Remix Form and Action have drastically simplified our forms. While it's easy to validate form data on the server, people have always been searching for a good client-side form validation solution. What if we could use the platform to implement simple client-side validation without adding another dependency? Let's explore how to utilize the Constraint Validation API to provide a modern form validation experience in Remix.
date: 2023-04-16
tags:
- Remix
- React
- Constraint Validation
---

# Remixing Constraint Validation

Building form is hard. There are different states you need to maintain and also events to react as user interacting with your form. It is always tempting for us to just go with a form validation solution which, however, might brings a lot more than what we needed. What if we could use the platform to implement simple form validation without adding another dependency on the client?

## What is Constraint Validation?

The [Constraint Validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraint-validation) is a specification that spread across HTML, CSS and the DOM. For example, you can validate the value on an input field with the `required` attribute:

```tsx
<input required />
```

You can also configure a number input with `min`, `max` and `step` attributes that describes different criterias needed for the number:

```tsx
<input type="number" min={0} max={5} step={0.5} />
```

There is also email input which you can restirct to a certain `pattern`:

```tsx
<input type="email" pattern="[^@]+@example.com" />
```

This is not limited to the input element, but also other form controls. For example, you can setup a textarea with a specific length requriement using the `minLength` and `maxLength` attributes.

```tsx
<textarea minLength={10} maxLength={100} />
```

After specifiying the validation attributes, the browser will validate form controls as user types and report errors in the form of error bubbles, which come with a generic message (**Why**), populate only on the first invalid control (**Where**) and are shown only on form submission (**When**). This is where people stop and turn to its own form validation solution.

However, this is just the superficial part of the Constraint Validation. The DOM APIs is where its true power lies.

### Why: ValidityState

The [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) is an interface that contains a list of boolean values which describe the validity of the element and can be accessed from the `validity` property of the form element. For example, if an input is required and its value is empty, the `valueMissing` property will be marked as `true`:

```json
{
  "badInput": false,
  "customError": false,
  "patternMismatch": false,
  "rangeOverflow": false,
  "rangeUnderflow": false,
  "stepMismatch": false,
  "tooLong": false,
  "tooShort": false,
  "typeMismatch": false,
  "valid": false,
  "valueMissing": true
}
```

### Where: Invalid event

When user submits a form, the browser will check the validity of each form controls and fire an `invalid` event on the corresponding element if it is considered invalid. This gives us the opportunity to react to the invalid state and display the error message to the user.

```tsx
<input
  onInvalid={event => {
    const { name, validity } = event.currentTarget;

    if (validity.valueMissing) {
        // input is required but the value is empty
    }

    if (validity.typeMismatch) {
        // input is not a valid email / url etc.
    }

    // Prevent browser error bubble
    event.preventDefault();
  }}
/>
```

### When: reportValidity

By default, the browser will report form error on submission and prevent the form submit event from firing if there are any errors. But this is completely customizable. All you need is to disable the browser checks with the `noValidte` attribute and reimplement it yourself using the `reportValidity` API:

```tsx
<form
  onSubmit={event => {
    const form = event.currentTarget;

    // By calling reportValidity, the browser will fire
    // the invalid event on all invalid form elements
    if (!form.reportValidity()) {
      // Prevent form submit if there are any errors
      event.preventDefault();
    }
  }}
  noValidate
/>
```

Now that we have a basic understanding of the Constraint Validation API, let's see how we can use it to build a simple form validation experience in Remix.

## The recipe

To begin, let's create a simple login form:

```tsx
import { Form } from '@remix-run/react';

export default function LoginForm() {
  return (
    <Form method="post">
      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
        />
      </div>
      <button>Login</button>
    </Form>
  );
}
```

By utilizing the validation attributes, the login form is already checking if the email provided is valid and if the password is not empty. Now, it's time to improve it using the Constraint Validation APIs.

### Prepartion

First, it is common to have the error message displayed next to the input field. Let's setup an error state that will be used to keep track of the error message for each form control:

```tsx +[2,5,12,18,23,28]
import { Form } from '@remix-run/react';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form method="post">
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

### Capturing error messages

Then, we can capture the error messages with an `onInvalid` event handler. You can set it up on each form control or on the form element itself. In this example, we will use the form element to capture the error messages:

> It is technically better to use `onInvalidCapture` as native invalid event does not bubble. This works fine only because React bubbles the event regardsless.

```tsx +[10-21]
import { Form } from '@remix-run/react';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalid={(event) => {
        const input = event.target;

        // Update message based on the input name
        setError((error) => ({
          ...error,
          [input.name]: input.validationMessage,
        }));

        // Prevent default error bubble
        event.preventDefault();
      }}
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

### Clearing error messages on valid

Our form is now able to display the error messages when the user submits the form. But there is a problem. The error messages persists even if the user fixes the error as the message is updated only on invalid. To fix this, we can customize the `onSubmit` event handler to clear the error messages before reporting errors:

```tsx +[20-31]
import { Form } from '@remix-run/react';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalidCapture={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: input.validationMessage,
        }));

        event.preventDefault();
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;

        // Reset errors
        setError({});

        // Check validity of each field
        if (!form.reportValidity()) {
          // Prevent default form submission
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

### Customizing messages

By far we are only displaying the default error messages provided by the browser. Let's customize the error messages by accessing the ValidityState of the input:

```tsx +[4-14,27]
import { Form } from '@remix-run/react';
import { useState } from 'react';

function formatError(input) {
  if (input.validity.valueMissing) {
    return "The field is required";
  }

  if (input.validity.typeMismatch || input.validity.patternMismatch) {
    return "The value is invalid";
  }

  return "";
}

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalid={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: formatError(input),
        }));

        event.preventDefault();
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;

        setError({});

        if (!form.reportValidity()) {
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

### Finishing up

Now, it's time to wrap it up with an action. We will parse the form data and login with the credentials. We are done, aren't we? No. We should never trust the client.

```tsx
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { login } from "~/auth.server";

function formatError(input) {
  if (input.validity.valueMissing) {
    return "The field is required";
  }

  if (input.validity.typeMismatch || input.validity.patternMismatch) {
    return "The value is invalid";
  }

  return "";
}

export async function action({ request }) {
  const formData = await request.formData();
  const value = Object.fromEntries(formData);

  return await login(value);
}

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalidCapture={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: formatError(input),
        }));

        event.preventDefault();
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;

        setError({});

        if (!form.reportValidity()) {
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

### Never trust the client

Trusting the client is a bad idea. But there is no Constraint Validation API on the server side and we have no access to the ValidityState. Are we going to rewrite the validation logic again?

This is where our secret sauce comes in: [@conform-to/validitystate](https://www.npmjs.com/package/@conform-to/validitystate).

This is a simple validation library that let you Validate on the server using the same rules as the browser: it takes a schema that represent the constraint of each form control and allows customizing the validation message by polyfilling the ValidityState.

Let's start by extracting the schema from the LoginForm component:

```tsx +[5-15,68,77]
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { login } from "~/auth.server";

const schema = {
    email: {
        type: "email",
        required: true,
        pattern: "[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+",
    },
    password: {
        type: "password",
        required: true,
    },
};

function formatError(input) {
  if (input.validity.valueMissing) {
    return "The field is required";
  }

  if (input.validity.typeMismatch || input.validity.patternMismatch) {
    return "The value is invalid";
  }

  return "";
}

export async function action({ request }) {
  const formData = await request.formData();
  const value = Object.fromEntries(formData);

  return await login(value);
}

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalidCapture={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: formatError(input),
        }));

        event.preventDefault();
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;

        setError({});

        if (!form.reportValidity()) {
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          {...schema.email}
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          {...schema.password}
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

We will then replace `Object.fromEntries` with the `validate` together with the schema and the `formatError` helper:

```tsx
import { parse } from "@conform-to/validitystate"
import { json } from "@remix-run/node";
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { login } from "~/auth.server";

const schema = {
    email: {
        type: "email",
        required: true,
        pattern: "[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+",
    },
    password: {
        type: "password",
        required: true,
    },
};

function formatError(input) {
  if (input.validity.valueMissing) {
    return "The field is required";
  }

  if (input.validity.typeMismatch || input.validity.patternMismatch) {
    return "The value is invalid";
  }

  return "";
}

export async function action({ request }) {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
    formatError,
  });

  if (submission.error) {
    return json(submission, { status: 400 })
  }

  return await login(submission.value);
}

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalidCapture={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: formatError(input.validity),
        }));

        event.preventDefault();
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;

        setError({});

        if (!form.reportValidity()) {
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          {...schema.email}
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          {...schema.password}
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

Last but not least, we need to sync the error messages from the server with the client:

```tsx
import { parse } from "@conform-to/validitystate"
import { json } from "@remix-run/node";
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { login } from "~/auth.server";

const schema = {
    email: {
        type: "email",
        required: true,
        pattern: "[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+",
    },
    password: {
        type: "password",
        required: true,
    },
};

function formatError(input) {
  if (input.validity.valueMissing) {
    return "The field is required";
  }

  if (input.validity.typeMismatch || input.validity.patternMismatch) {
    return "The value is invalid";
  }

  return "";
}

export async function action({ request }) {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
    formatError,
  });

  if (submission.error) {
    return json(submission, { status: 400 })
  }

  return await login(submission.value);
}

export default function LoginForm() {
  const lastSubmission = useActionData();
  const [error, setError] = useState(lastSubmission?.error ?? {});

  useEffect(() => {
    if (lastSubmission) {
      setError(lastSubmission?.error ?? {});
    }
  }, [lastSubmission]);

  return (
    <Form
      method="post"
      onInvalidCapture={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: formatError(input.validity),
        }));

        event.preventDefault();
      }}
      onSubmit={(event) => {
        const form = event.currentTarget;

        setError({});

        if (!form.reportValidity()) {
          event.preventDefault();
        }
      }}
      noValidate
    >
      <div>
        <label>Email</label>
        <input
          className={error.email ? 'error' : ''}
          name="email"
          {...schema.email}
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          className={error.password ? 'error' : ''}
          name="password"
          {...schema.password}
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </Form>
  );
}
```

Note that the package is not used on the client, but only on the server.
