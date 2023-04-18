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

> emphasize constraint validation provides basic client validation experience, in such case no additional dependenicies are needed; the following HTML validation attributes are relatively common/familiar

The [Constraint Validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraint-validation) is a browser built-in mechanism for client validation. It introudced a set of HTML validation attributes to enforce common constraint which could be checked without JavaScript. For example, you can enforce an input to be filled with the `required` attribute:

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

With all these attributes, the browser will validate form controls as you types and report any errors found on submission, like this: [Example](#https://remix-conf-2023.edmund.dev/examples/basic).

This looks cool, but it feels a bit limited: The error bubbles are not customizable. It happens only on form submit. The error messages are also generic and not informative. I think this is how most of the developers feel about this browser mechanism. It sounds good, but it's far from what a modrern form experience should be. But, that's just the HTML part of the specification. There are also DOM APIs to customize the validation experience. Let's take a look at them.

## DOM APIs

The DOM APIs can be split into two parts: What is the error and when to report it.

### What is the error

The [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) is an interface that contains a list of boolean values which describe the validity of the element and can be accessed from the `validity` property of the form element. For example, if an required input is empty, the `valueMissing` property will be marked as `true`:

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

The ValidityState gives us an idea of what the error is and enables us to further customize the message using the `setCustomValidity` API. You can then access the error message from the `validationMessage` property anytime.

```tsx
<input
  onChange={event => {
    // The input element
    const input = event.currentTarget;

    if (input.validity.valueMissing) {
      input.setCustomValidity('This field is required');
    } else if (input.validity.typeMismatch) {
      input.setCustomValidity('This field is invalid');
    } else {
      // Reset the error message
      input.setCustomValidity('');
    }

    // To access the error message
    console.log(input.validationMessage);
  }}
/>
```

### When to report it

> through ValidityState we can know the reason of invalid, and then we can show the corresponding error message to user. it also provides a way to customize the error message, (e.g. by using `setCustomValidity` API)

Now we know how to customize the error message, but when should we show it? This is where the `invalid` event comes in.

By default, when you submit a form, the browser will report the validity of each form controls and fire an `invalid` event on the corresponding invalid form elements. This gives us the opportunity to react to the invalid state and display the error message to the user. You can also cancel the error bubble by calling `event.preventDefault()`.

```tsx
<input
  onInvalid={event => {
    // The invalid form element
    const input = event.currentTarget;

    // The error message:
    console.log(input.validationMessage)

    // Prevent browser error bubble
    event.preventDefault();
  }}
/>
```

You can also customize the time when it should fire the invalid event. For example, you can disable the browser checks with the `noValidte` attribute and reimplement the check yourself using the `reportValidity` API. It will fire the `invalid` event on all invalid form elements and return a boolean value indicating whether the form is valid or not.

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

To begin, let's create a simple login form utilizing the validation attributes which sets the basic validation experience:

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

Now, it's time to improve it using the DOM APIs.

### Customizing the error message

The first thing we can do is to customize the error message by listening to the `change` event on the form element and use the `setCustomValidity` API to set the error message. Now, the error bubble will displayed the custom message instead of the generic one.

```tsx
import { Form } from '@remix-run/react';

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
  return (
    <Form
      method="post"
      onChange={event => {
        const input = event.target;

        input.setCustomValidity(formatError(input));
      }}
    >
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

### Displaying error messages manually

The error bubble is a nice feature, but it's more common to have the error message displayed next to the input field. Let's capture the error message by listening to the `invalid` event and display it by ourselves.

```tsx +[2,5,12,18,23,28]
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
      onChange={event => {
        const input = event.target;

        input.setCustomValidity(formatError(input));
      }}
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
      onChange={event => {
        const input = event.target;

        input.setCustomValidity(formatError(input));
      }}
      onInvalid={(event) => {
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

Now it is working. We started with a basic validation experience and progressively enhanced it with the Constraint Validation API. The form is still usable without JavaScript. A progressively enhanced form validation!

## How about the server?

> Never trust the client. Always validate on the server too. Constraint Validation API does do a great work in client-side validation, but it is not enough. You will always have to validate on the server too.

It's great that we have a good client validation experience. But this doesn't mean we can trust the client. We still need to validate on the server. But there is no Constraint Validation APIs on the server side and we have no access to the ValidityState. Are we going to rewrite the validation logic again?

This is where our secret sauce comes in: [@conform-to/validitystate](https://www.npmjs.com/package/@conform-to/validitystate).

This is a simple validation library that let you validate on the server using the same rules as the browser. It takes a schema that represent the constraint of each form control and allows customizing the validation message by polyfilling the ValidityState.

Let's start by extracting the form validation attributes as a schema of our login form:

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

We can then parse the formData with the `schema` and the `formatError` helper:

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

## Summary

The Constraint Validation APIs are [supported by most modern browsers](https://caniuse.com/constraint-validation) and provide a great way to validate forms on the client. It offers a basic validation experience to your user and can be progressively enhanced with custom validation logic as well.
