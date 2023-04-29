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

Hi everyone, my name is Edmund Hung. I am a senior software engineer at DeliveryHero. I maintain Remix Guide and a form validation library called Conform. Today, I am here to talk about Remixing Constraint Validation. [10s]

### [0:10-0:25] What is Constraint Validation? (Use the platform)

First of all, Constraint Validation is a built-in browser mechanism for form validation. It was introduced in HTML5 and is now supported by all modern browsers. You might not be familiar with the name, but you have probably used it before. [15s]

### [0:25-1:00] Validation Attributes

Let's say we are building a simple signup form and this is how the markup could look. Now, if I type remix here and submit it, what will happen?

Well, the browser blocks our form submission and tells us the email is invalid, because the email type here is one of the validation attributes. These attributes let you define a constraint based on different usecases. For example, you can mark an input as required with the required attrbute. You can also enforce a password policy using the minlength and pattern attributes.

Now, let me show you how we can progressively enhance it using the DOM APIs. [35s]

### [1:00-1:40] Disable default browser validation

The first step is to disable the default browser validation. Why? Let's take a look at the validation flow. The top diagram shows how the browser works by default. When a form is submited, the browser will validate the form and fire a submit event only if the value is valid. There is no way for us to add custom logic to this process. Now, on the bottom diagram, we will disable the default browser validation as shown with the red arrow and then re-implement it manually as shown with the green arrow.

Let's apply this to our signup form example. First, we disable the browser validation with the `noValidate` attribute, then we re-implement it on the submit event handler using the `reportValidity` API. We also block the submission if the form is invalid. And you can see the error is displaying again. [40s]

### [1:40-2:45] Customizing errors

Now we can have a more flexibile validation flow. Next, we need to learn about the error interface.

First, the error message displayed is defined by the `validationMessage` property. It can also be overridden with the `setCustomValidity` method. If we want to know more about the error, we can also check the `validity` property. This property represents the `ValidityState` of the input. It is a set of booleans that describes the result of each validation attribute.

With this in mind, if we wanna customize the error message, this is how the new validation flow looks. The top diagram shows the validation flow that we enhanced earlier. Now in the bottom diagram we add error customization, as shown with the green arrow. Let's go back to our example again.

Here we define a `formatError` function that derives the message based on the input element and a formData object. We also loop over each input and pass the result to the `setCustomValidity` method.

Inside this function, we are checking both the name and the ValidityState of the input. We are also comparing the password and confirm password fields manually because there is no built-in validation attribute that covers this usecase. Now, if we click on the submit button, we can see the error message updated. [65s]

### [2:45-3:45] Synchronizing errors

The next thing to learn about is the `invalid` event. When browser validation happens, an `invalid` event will be fired on each invalid input and then trigger error display like in the top diagram here. This gives us a chance to capture the error state and customize how the error should be reported. But there is a caveat here. As there is no `valid` event available, we can't track when an invalid input becomes valid again. To fix this, we need to reset the error state before reporting new errors to synchronize the error state as shown in the bottom diagram.

Let me show you how this works. First, we prepare an error state that maps input name to error message. Then, we synchronize the validationMessage in the invalid event handler and cancel error display with `preventDefault`. We are also clearing errors before reporting new errors.

Now, we can display the error message anywhere we want. If I click on the submit button, we can see the error showing. [60s]

### [3:45-4:40] How about the server

Well, it's great to have client validation in place even without JavaScript. But it doesn't mean we should skip the server validation.

Let me introduce you to the Conform ValidityState helper.
This is a package for you to perform server validation based on the ValidityState. It supports type inference and is also 0kb on the client as you only need it on the server.

Let's get back to our example and see how it works. Here we extract the constraint of each form control and combine it into a schema.

Then, we import the `parse` helper to parse the formData based on the schema and the formatError helper. If there is any error, we just send it back to the client and synchronize it with the client error state.

Now, if I disable JavaScript and submit the form, we can see the error message is still showing.

What's great about this approach is that we can reuse the same validation logic on the client and the server. Our form can now work just like how the browser validates even without JavaScript. [55s]

### [4:40-5:00] Summary

IN the end, I wanna say it's just the web. Once you get the gist of my talk, you should be able to apply it anywhere, whether or not you are using Remix.

If you are interested in this topic, feel free to check out my article here. You can also find me on Twitter. Thank you. [15s]

## Structure

1. [0:00-0:10] Introduction
2. [0:10-1:15] What is Constraint Validation
3. [1:15-1:45] Concept 1 - Disable browser validation and re-implement it
   Flow: Click -> (Validity check) -> Submit event
   Demo code
4. [1:45-2:40] Concept 2 - validationMessage / ValidityState / setCustomValidity
   Click -> Validity check -> (Error display) -> Submit event
   Demo code
5. [2:40-3:40] Concept 3 - invalid event
   Click -> Validity check -> Invalid event -> Error display -> Submit event
   Demo code
6. [3:40-4:40] Server validation
   Demo code
7. [4:40-5:00] Closing
