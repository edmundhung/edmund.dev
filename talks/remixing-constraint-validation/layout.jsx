import React from 'react';

export function Layout({ children }) {
  return (
    <div style={{ padding: '2rem' }}>
      {children}
    </div>
  );
}

export function Centered({ children }) {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>{children}</div>
    </div>
  );
}