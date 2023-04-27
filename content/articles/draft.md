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

Hi everyone, my name is Edmund Hung. I am a senior software engineer at DeliveryHero. I maintain Remix Guide and a form validation library called Conform. Today, I am here to talk about Constraint Validation. [10s]

### [0:10-0:25] What is Constraint Validation? (Use the platform)

First of all, Constraint Validation is a built-in browser mechanism for form validation. It was introduced in HTML5 and is now supported by all modern browsers. You might not be familiar with the name, but you have probably used it before. [15s]

### [0:25-1:05] Validation Attributes

Let's say we are building a simple signup form and this is how the markup looks like. Now, if I type remix here and submit it, what will happen?

Well, the browser blocks our form submission and tells us the email is invalid, because the email type here is one of the validation attributes. These attributes let you define the constraint of the input based on different usecases. For example, you can mark an input as required with the required attrbute. You can also enforce a password policy with the minlength and pattern attributes.

This might be far from the actual experience we want. But we should think of it as just the basic validation experience. I am gonna show you how we can progressively enhanced it using the DOM APIs. [40s]

### [1:05-1:45] Disable default browser validation

The first step is to disable the default browser validation. Why? Let's take a look of the current validation flow. By default, when a form is submited, the browser will fire a submit event only if the value is valid. There is no way for us to prepare or customize anything in between. To get around this, we will disable the default browser validation and then re-implement it manually.

Let's apply this to our signup form example. First, we disable the browser validation with the `noValidate` attribute and so no error bubbles are showing now. But then we will re-implement it on the submit event handler using the `reportValidity` API and block the submission if the form is invalid. And you can see the error bubbles are showing again. [40s]

### [1:45-2:40] Customizing errors

Now that we are more flexibile on the validation flow. We need to learn about the `validity` property and the `setCustomValidity` method on the input element.

First, the `validity` property represents the `ValidityState` of the input. It is a set of booleans that describes the result of each validation attributes. If a required input is empty, the `valueMissing` property will be marked as `true`. Then, the `setCustomValidity` method simply allows us to set a custom message on the input.

With this in mind, if we wanna customize the error, this is how the new validation flow looks like. For sure, we will also apply this to our signup form example.

Here we defined a `formatError` function that derives the message based on the input element and a formData object and we will loop over each input and pass the result to the `setCustomValidity` method.

Inside this function, we are checking both the name and ValidityState of the input. We are also comparing the password and confirm password field manually because there is no built-in validation attribute that cover this usecase. Now, if we click on the submit button, we will see the error message updated.

### [2:40-3:40] Capturing errors

Then, it's time to learn about the `invalid` event. When browser validation happens, an `invalid` event will be fired on each invalid input. This gives un a chance to capture the error state and cancel the error bubble if we want to customize how error should be reported.

Let me show you how it works quickly. First, we prepare an error state that maps input name to the error message. Then, we start capturing the latest error message in the invalid event handler through the `validationMessage` property. We are also cancelling the event bubbles with `event.preventDefault()` here.

However, the error state is updated only on `invalid` but not when it becomes valid. There is a chance that the error message will be out of sync with the actual state. To fix this, we will reset the error state before reporting new errors.

Now, we can display the error whereever we want. If I click on the submit button, we will see the error showing up here and it will be cleared when the input becomes valid.

This is also how our final validation flow looks like.

### [3:40-3:45] How about the server

Well, it's great to have client validation in place even without JavaScript. But it doesn't mean we can skip the server validation, right? Are we going to rewrite the validation logic again? [15s]

Here let me introduce the Conform validitystate helper.
This is a package for you to validate on the server based on the ValidityState. It supports type inference. It's also 0kb on the client as you need it only on the server.

Let's get back to our example and see how it works. Here we are gonna extract the constraint of each form control and put it together as the schema.

Then, we will import the parse helper and parse the formData based on the schema and the formatError helper. If there is any error, we just send it back to the client and sync it with the client error state. [45s]

Now, if I disable JavaScript and submit the form, we will see the error message is still showing up.

What's great about this approach is that we can reuse the same validation logic on the client and the server. Our form is now enhanced all the way from the server and works the same as the client validation even without JavaScript. [10s]

### [4:40-5:00] Summary

At the end, I just wanna empasisi everything we talked today is a web solution. Once you get the gist of the talk, you should be able to apply it anywhere, no matter you are using Remix or not.

The constraint validation might not be the best tool for complex forms. But it's pretty good for simple forms, like signin or signup forms where the validation attributes can cover most of the requirements.

If you are interest in this topic, feel free to check out my article here. You can also find me on Twitter. Thank you. [15s]

## Structure

1. [0:00-0:10] Introduction
2. [0:10-1:15] What is Constraint Validation
3. [1:15-1:45] Concept 1 - Disable browser validation and re-implement it
   Flow: Click -> (Validity check) -> Submit event
   Demo code
4. [1:45-2:40] Concept 2 - validationMessage / ValidityState / setCustomValidity
   Click -> Validity check -> (Error bubble) -> Submit event
   Demo code
5. [2:40-3:40] Concept 3 - invalid event
   Click -> Validity check -> Invalid event -> Error bubble -> Submit event
   Demo code
6. [3:40-4:40] Server validation
   Demo code
7. [4:40-5:00] Closing
