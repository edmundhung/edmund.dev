import React, { useState } from 'react';

export function BaseExample() {
  return (
    <form method="post">
      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
          autoComplete="off"
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
    </form>
  );
}

export function CapturingInvalidMessages() {
  const [error, setError] = useState({});

  return (
    <form
      method="post"
      onInvalidCapture={(event) => {
        const input = event.target;
  
        setError((error) => ({
          ...error,
          [input.name]: input.validationMessage,
        }));

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
          autoComplete="off"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </form>
  );
}

export function EnhancingValidation() {
  const [error, setError] = useState({});

  return (
    <form
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
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
          autoComplete="off"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </form>
  );
}

export function CustomizeMessages() {
  const [error, setError] = useState({});

  function formatValidity(validity) {
    if (validity.valueMissing) {
      return "The field is required";
    }
  
    if (validity.typeMismatch || validity.patternMismatch) {
      return "The value is invalid";
    }
  
    return "";
  }  

  return (
    <form
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
          type="email"
          required
          pattern="[^@]+@[A-Za-z0-9]+.[A-Za-z0-9]+"
          autoComplete="off"
        />
        <div>{error.email}</div>
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          required
        />
        <div>{error.password}</div>
      </div>
      <button>Login</button>
    </form>
  );
}