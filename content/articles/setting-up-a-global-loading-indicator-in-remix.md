---
title: Setting up a global loading indicator in Remix
description: Tutorial for making you own loading progress bar with tailwindcss
layout: md:col-span-2
tags:
- React
- Remix
---

# Setting up a global loading indicator in Remix

Global loading indicator is a common UX pattern notifying your users something is still going on. It might not be the [best approach](https://www.lukew.com/ff/entry.asp?1797) these days but serves its purpose at a much lower cost.

In this tutorial, we will go through how to make a top loading progress bar using `tailwindcss`. Let's start by creating a dummy `<Progress />` component:

```tsx Progress.tsx
import type { ReactElement } from 'react';

function Progress(): ReactElement {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 flex">
      <div
        style={{ width: '30%' }}
        className="bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
      />
    </div>
  );
}

export default Progress;
```

In this component, we have only two elements with one being the container which is fixed at the top and the inner div presenting the progress with a static 30% width. Next, we need to hook up some logic and make it move:

```diff Progress.tsx
@@ -1,10 +1,19 @@
-import type { ReactElement } from 'react';
+import type { ReactElement, MutableRefObject } from 'react';
+import { useRef } from 'react';
+
+export function useProgress(): MutableRefObject<HTMLElement> {
+  const el = useRef<HTMLElement>();
+
+  return el;
+}

 function Progress(): ReactElement {
+  const progress = useProgress();
+
   return (
     <div className="fixed top-0 left-0 right-0 h-1 flex">
       <div
-        style={{ width: '30%' }}
+        ref={progress}
         className="bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
       />
     </div>
```

It might be tempting to make the width a variable. But this is probably not an ideal solution as it adds unnecessary load to React which could block the other part of the UI. With this in mind, we will go with managing the element width by ourselves using `ref`.

```diff Progress.tsx
@@ -1,8 +1,22 @@
 import type { ReactElement, MutableRefObject } from 'react';
-import { useRef } from 'react';
+import { useEffect, useRef } from 'react';
+import { useTransition } from 'remix';

 export function useProgress(): MutableRefObject<HTMLElement> {
   const el = useRef<HTMLElement>();
+  const { location } = useTransition();
+
+  useEffect(() => {
+    if (!location || !el.current) {
+      return;
+    }
+
+    el.current.style.width = `0%`;
+
+    return () => {
+      el.current.style.width = `100%`;
+    };
+  }, [location]);

   return el;
 }
```

Usually, you might need a query client which keeps track of all outgoing requests for you. However, this gets much simpler with Remix's route driven mechanism. It provides a built-in react hook named `useTransition` which returns the next location whenever a transition is happening. This allows us simply subscribe to the `location` value with useEffect and set the width accordingly.

```diff Progress.tsx
@@ -4,6 +4,7 @@
import { useTransition } from 'remix';

 export function useProgress(): MutableRefObject<HTMLElement> {
   const el = useRef<HTMLElement>();
+  const timeout = useRef<NodeJS.Timeout>();
   const { location } = useTransition();

   useEffect(() => {
@@ -11,10 +12,21 @@
export function useProgress(): MutableRefObject<HTMLElement> {
       return;
     }

+    if (timeout.current) {
+      clearTimeout(timeout.current);
+    }
+
     el.current.style.width = `0%`;

     return () => {
       el.current.style.width = `100%`;
+      timeout.current = setTimeout(() => {
+        if (el.current?.style.width !== '100%') {
+          return;
+        }
+
+        el.current.style.width = ``;
+      }, 200);
     };
   }, [location]);
```

For sure, the progress bar should be disappeared after a short time. Let's add a timeout to clear the width after 200ms.

```diff Progress.tsx
@@ -18,7 +18,26 @@
export function useProgress(): MutableRefObject<HTMLElement> {

     el.current.style.width = `0%`;

+    let updateWidth = (ms: number) => {
+      timeout.current = setTimeout(() => {
+        let width = parseFloat(el.current.style.width);
+        let percent = !isNaN(width) ? 10 + 0.9 * width : 0;
+
+        el.current.style.width = `${percent}%`;
+
+        updateWidth(100);
+      }, ms);
+    };
+
+    updateWidth(300);
+
     return () => {
+      clearTimeout(timeout.current);
+
+      if (el.current.style.width === `0%`) {
+        return;
+      }
+
       el.current.style.width = `100%`;
       timeout.current = setTimeout(() => {
         if (el.current?.style.width !== '100%') {
```

Even though we have no idea about the actual progress status, it is better to keep the progress moving as the page loads. To achieve this, we increase the progress slightly every 100ms with a smaller gap each time. There is also an initial delay of 300ms which avoid showing the progress in case the transition finish quickly.

```diff Progress.tsx
@@ -59,7 +59,7 @@
  function Progress(): ReactElement {
     <div className="fixed top-0 left-0 right-0 h-1 flex">
       <div
         ref={progress}
-        className="bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
+        className="transition-all ease-out bg-gradient-to-r from-green-400 via-blue-500 to-pink-500"
       />
     </div>
   );
```

One final touch would be making use of the CSS transition property to make the animation smoother.

Reference: [Gist](https://gist.github.com/edmundhung/023e85cc731466bb5f4b350590ab30ea)
