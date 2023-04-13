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

Building form is hard. The Remix Form and Action have already made server validation simplier than ever, but client validation is still a challenge for many of us. In this article, I will show you how to use the browser to validate the form data by utilizing the Constraint Validation APIs.

The Constraint Validation is a specification that spread across HTML, CSS and the DOM. For example, you can validate the value of an input tag with the required attribute:

```tsx
<input required />
```

You can also create a number input with min, max and step attributes that describe the different criteria needed for the number:

```tsx
<input type="number" min={0} max={5} step={0.5} />
```

There is also email input that you can restirct to a certain pattern:

```tsx
<input type="email" pattern="[^@]+@example.com" />
```

This is not limited to the input tag, but also other form control elements. For example, you can setup a textarea with a specific length requriement using the `minLength` and `maxLength` attributes.

```tsx
<textarea minLength={10} maxLength={100} />
```

By specifiying the validation attributes, the browser will start reporting errors through the error bubbles when the users submit the form.

However this is just the superficial part of the Constraint Validation API. The DOMs also provides a way to access the validity of each form controls called the `ValidityState`. The Validity State is an interface that contains a list of boolean values that describe the validity of the element. For example, if the input is required and the value is empty, the `valueMissing` property will be marked as `true`:

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

When the form is submitted, the browser will also fire an `invalid` event on form element that were invalid, and you can check the `validity` property of the form elements to customize its behavior:

```tsx
<input
  onInvalid={event => {
    const input = event.currentTarget;

    if (input.validity.valueMissing) {
        // input is required but the value is empty
    }

    if (input.validity.typeMismatch) {
        // input is not a valid email / url etc.
    }

    // Prevent browser error bubble
    event.preventDefault();
  }}
/>
```

By default, the browser will report any errors through the error bubbles and prevent the form submit event from firing if there are any errors. However, this makes it hard to know if the form has been submitted or not. To solve this problem, you can use the `noValidate` attribute on the form element to disable the default behavior and reimplement it yourself using the `reportValidity` method from the form element:

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

By utilizing the validation attributes, the login form is already checking if the email provided is valid and if the password is not empty. However, we can do better than this. Let's prepare the form to display the error messages when the user submits the form:

```tsx
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

We can then capture the error messages with an `onInvalid` event handler:

```tsx
import { Form } from '@remix-run/react';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState({});

  return (
    <Form
      method="post"
      onInvalidCapture={(event) => {
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

Our form is now able to display the error messages when the user submits the form. However, the error messages will still be displayed even if the user fixes the error. To fix this, we can customize the `onSubmit` event handler to clear the error messages when the form is submitted:

```tsx
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

For sure, we can also customize the error messages by accessing the ValidityState of the input:

```tsx
import { Form } from '@remix-run/react';
import { useState } from 'react';

function formatValidity(input) {
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
      onInvalidCapture={(event) => {
        const input = event.target;

        setError((error) => ({
          ...error,
          [input.name]: formatValidity(input),
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

At this point, we have a form that is able to validate the user input and display the error messages. Let's wrap it up by adding the action.

```tsx
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { login } from "~/auth.server";

function formatValidity(input) {
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
          [input.name]: formatValidity(input),
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

We are done, aren't we?

### Never trust the client

So far we have talked about how to validate the user input on the client side. However, server validation is still needed. We should never trust the client.

But how? There is no Constraint Validation API on the server side. There is no ValidityState object. Are we going to write the validation logic again?

This is where our secret sauce comes in: [@conform-to/validitystate](#).

This is a simple validation library that is able to validate the user input on the server side by polyfilling the ValidityState object. It can validate the form data based on the constraints that we have set on the client side and return the error messages.

Let's start by extracting the schema from the LoginForm component:

```tsx
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

function formatValidity(input) {
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
          [input.name]: formatValidity(input),
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

We will then use the `validate` function from the `@conform-to/validitystate` library to validate the formData on the server and format the error messages using our `formatValidity` function:

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

function formatValidity(input) {
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
    formatValidity,
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
          [input.name]: formatValidity(input.validity),
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

function formatValidity(input) {
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
    formatValidity,
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
          [input.name]: formatValidity(input.validity),
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
