## Understanding

What does the audience know about the subject?

- New to the Constraint Validation APIs. They know the attributes but nothing more.

Do they find the subject interesting or not at all? Is the subject relevant to them?

- They want to follow the Remix design philosophy - use the platform
- Progressive Enhancement

What do you as the speaker know about the subject in question?

- Demo a simple example

What are the reasons behind your presentation?

- Makes it a good option for the developers

Do you have any expertise on the matter?

- I build Conform on top to handle complex form

What new information will you be sharing with your audience?

- A working solution

What is my objective?

- How to utilize Constraint Validation
- Why should they? Use the platform / Progressive enhancement

What is my only message?

- Utilizing Constraint Validation makes you build better form

Demonstrative speech

- Ask yourself why you choose this topic and why it is important to the audience
- Provide an overview
- Explain the steps involved in your process
- Talk about variations, other options
- Ensure you allot time for Q&A
- Give a brief summary

FORMS ARE HARD
YOU ARE LAZY AND YOUR CODE SUCKS / LESS CODE, BETTER UX
BROWSER FOR THE RESCUE
ALWAYS VALIDATE YOUR FORM SERVER SIDE / NEVER TRUST YOUR CLIENT

## Scripts

### [0:00-0:15] Introduction (Who am I, what I do, why I am here)

Hi everyone, my name is Edmund Hung. I am a senior software engineer at DeliveryHero. I maintain Remix Guide and a form validation library called Conform. Today, I will be talking about Constraint Validation. [10s]

### [0:15-1:15] What is Constraint Validation? (Use the platform)

Before we start, what is Constraint Validation? It's a browser mechanism for form validation. It introudced a set of HTML validation attributes to enforce some common constraint which will be checked by the browser.

For example, you can enforce an input to be filled with the `required` attribute:

You can also restrict its format as a number or email with some extra criterias. Or applying to other form elements, such as textarea.

When you submit the form, the browser checks the validity of each input and prevent the submission if anything looks wrong, which sounds great. But there are some limitations. [35s]

First, the error bubbles looks different on each browsers. The styles cannot be changed. It also have limited support for message customization, such as the messages.

What we missed is the DOM APIs.

### [1:15-1:45] validationMessage / ValidityState

First of all, you can capture the message on the error bubbles with JavaScript. It's available on the form element through the `validationMessage` property. But you are probably more interested in the `validity` property, which represent the `ValidityState` of the input.

The `ValidityState` is a set of booleans that describes the result of each validation attributes. For example, if a required input is empty, the `valueMissing` property will be marked as `true`. [25s]

### [1:45-2:30] Invalid event / reportValidity

Now we know about the errors, but when should we show it? This is where the `invalid` event comes to play. By default, when you submit a form, the browser will report the error and fire an `invalid` event on each invalid elements. This gives us a chance to react to the invalid state and display the error message to the user. If you called `event.preventDefault()`, the error bubble will be cancelled as well.

You can also customize the time when it should fire the invalid event. For example, you can disable the browser checks with the `noValidte` attribute and reimplement the check yourself using the `reportValidity` API. It will fire the `invalid` event on all invalid form elements and return a boolean value indicating whether the form is valid or not. [45s]

### [2:30-2:45] Transition to the demo

[Insert humor] and here is a remix recipe. [15s]

### [2:45-4:00] Demo

To begin, let's create a simple login form with the validation attributes to give a basic validation experience. It checks the email and password and report errors through the bubbles. Now, let's improve it using the DOM APIs.

The error bubble is nice, but sometimes you might prefer having the errors displayed next to the inputs.
The first thing we can do is to capture them with an error state by listening to the `invalid` event, and then display them ourselves.

But there is a problem here. As you can see here: We just typed a password. But the message is still there even after I submit the form. Why? We are updating the message only on `invalid`, but the event handler will not be triggered when it becomes valid. To fix this, we can customize the `onSubmit` event handler to clear the error messages before reporting errors, like this.

We can also customize the messages with the ValidityState.

It's done! We started with a basic validation experience and progressively enhanced it with the Constraint Validation APIs. The form is still usable without JavaScript.

[70s]

### [4:00-4:15] How about the server

Well, it's great to have client validation in place even without JavaScript. But it doesn't mean we can skip the server validation, right? How should we validate it on the server side? You cannot access the DOM on the server. Are we going to rewrite the validation logic again? This is where our secret sauce comes in [15s]

### [4:15-5:00] The secret sauce

This is a package for you to validate on the server based on the ValidityState, with type inference support. Most importantly, it's 0kb on the client as you need it only on the server.

Let's get back to our example and see how it works. Here we are gonna extract the constraint of each form control and put it together as the schema.

Then, we will import the parse helper and pass the formData to it together with the schema and the formatError helper. The result includes the errors which we can send back to the client, or the parsed data if no error. Once the action returns the error, we can sync it with the client state.

### [5:00-5:15] Closing

To wrap up, we have learned how to use the Constraint Validation APIs to build better form. It's a progressive enhancement approach that makes your form more accessible and usable without JavaScript. [15s]
