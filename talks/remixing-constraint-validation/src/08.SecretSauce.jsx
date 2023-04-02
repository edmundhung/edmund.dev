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

function formatValidity(validity) {
  if (validity.valueMissing) {
    return "The field is required";
  }

  if (validity.typeMismatch || validity.patternMismatch) {
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
    return json(submission.error, { status: 400 })
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
        setError({});

        if (!event.currentTarget.reportValidity()) {
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
