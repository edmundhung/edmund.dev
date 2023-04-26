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

### [0:00-0:10] Introduction (Who am I, what I do, why I am here)

Hi everyone, my name is Edmund Hung. I am a senior software engineer at DeliveryHero. I maintain Remix Guide and a form validation library called Conform. Today, I will be talking about Constraint Validation. [10s]

### [0:10-0:25] What is Constraint Validation? (Use the platform)

First of all, what is Constraint Validation? It's a built-in browser mechanism for form validation. It was introduced in HTML5 and is now supported by all modern browsers. You might not be familiar with the name, but you have probably used it before. [15s]

### [0:25-1:15] Validation Attributes

Let's say we are building a simple signup form and this is how the markup looks like. Pretty basic, right? Now, if I type an invalid email address here and submit it, what will happen? [Type "edmund" on the email input and click submit]

Well, the browser prevents us from submitting the form and tells us the email is invalid. But why? It's because of the email type attribute here. If your form have these validation attributes set, the browser will make sure all values are valid. For example, we can enforce all inputs to be filled by adding the required attribute. We can also restrict the password to be at least 8 characters long using the minlength attribute and make sure it follows a certain pattern with a regular expression on the pattern attribute.

This might be far from the actual experience we want. But this is just the basic validation experience. I am gonna show you how we can progressively enhanced it using the DOM APIs. [50s]

### [1:15-1:45] Enhancing validation

The first thing is to disable the browser validation with the `noValidate` attribute. This is quite important because it gives us flexiblity when a submit event is triggered regardless it is valid or not and we will re-implement
the validation with the `reportValidty` API quickly.

This API will fire an invalid event which caused the error bubbles if the input is invalid and also returns the validity of the form, which helps us decide if the submission should be blocked or not. [Click on the submit button and show the error bubbles] [30s]

### [1:45-2:40] Customizing messages

Now the browser validation is re-enabled. Let's customize the errors using the `setCustomValidity` API. We will loop over each form elements and set a custom message on each input. We will also setup a function to derive the message we want called `formatError`.

Inside this function, we will be accessing the ValidityState of the input element through the `validity` property, which is a set of booleans that describes the result of each validation attributes. For example, if a required input is empty, the `valueMissing` property will be marked as `true`. [Click on the submit button to show the update message]

It's not done yet. We haven't check if the password and confirm password are the same yet. Unfortunately, there is no built-in validation attribute for this. A quick solution here would be passing the formData to our formatError function and then we can compare their values manually. And the whole function will end up looking like this [Type both password to test the validation].[45s]

### [2:40-3:40] Capturing errors

I know not everyone likes the error bubble. How about capturing the errors and display them ourselves? To achieve this, we will make use of the `invalid` event we mentioned earlier and capture the latest validation message through the `validationMessage` property. Also, we will be cancelling the event bubbles by calling `event.preventDefault()` here.

Once we have the error state ready, we can render it however we want. We are almost done. But there is one hidden problem here, let me show you: [Type an valid email and click submit]. As you can see, the message is still showing here. Why? It's because we are updating the message only on `invalid`, but the event handler will not be triggered when it becomes valid. To fix this, all we need is to reset it before reporting new errors.

Complete Demo [50s]

### [3:30-3:45] How about the server

Well, it's great to have client validation in place even without JavaScript. But it doesn't mean we can skip the server validation, right? Are we going to rewrite the validation logic again? [15s]

### [3:45-4:30] The secret sauce

Here let me introduce the Conform validitystate helper.
This is a package for you to validate on the server based on the ValidityState. It supports type inference for sure. It's also 0kb on the client as you need it only on the server.

Let's get back to our example and see how it works. Here we are gonna extract the constraint of each form control and put it together as the schema.

Then, we will import the parse helper and parse the formData based on the schema and the formatError helper. If there is any error, we just send it back to the client and sync it with the client error state. [45s]

What's great about this approach is that we can reuse the same validation logic on the client and the server. It is now fully enhanced from the server and being able to show the same message even without JavaScript. [10s]

### [4:30-5:00] Summary

The constraint validation might not be the best tool for complex forms. But it's pretty good for simple forms, like signin or signup forms where the validation attributes can cover most of the requirements.

Also, it's a web solution. Once you get the gist of our example, you should be able to apply it anywhere, no matter you are using Remix or not.

### [5:00-5:15] Closing

That's it. If you are still interest in this topic, feel free to check out my articles here. You can also find me on Twitter. Thank you. [15s]
