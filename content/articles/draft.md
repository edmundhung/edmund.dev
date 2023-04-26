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

### [0:25-1:25] Validation Attributes

Let's say we are building a simple signup form and this is how the markup looks like. Pretty basic, right? Now, if I type an invalid email address here and submit it, can you tell what would happen and why? [Type "edmund" on the email input and click submit]

Well, the browser is reporting the problem on the email field because the email type attribute is actually one of the validation attributes. When the browser finds any of the validation attributes, the constraint validation mechanism got kicks-in. There are more validation attributes we can use too. For example, we can enforce all the fields to be filled by adding the required attribute. We can also restrict the password to be at least 8 characters long using the minlength attribute and make sure there are at least 1 lowercase, 1 uppercase and 1 digit with a regular expression on the pattern attribute.

It might be far from what the acttual experience we want to offer to our user. But you should think of it as the basic validation experience you offered to your users and we are gonna progresively enhanced it using the DOM APIs. There are a few concepts you need to learn but it's not that hard.

### [1:25-1:55] Enhancing validation

The first thing is to disable the browser validation with the noValidate attribute. This is quite important because it gives us full control on when a submission is happened. Without it, the submit event will not be triggered until all issues are resolved. That's why if I click on the submit button now, the form will be actually submitted.

Don't worry, we can reimplement it easily with the reportValidty API on the form element. It triggers the error bubbles and returns whether the form is valid or not, which help us deciding if the submission should be blocked. [30s]

### [1:55-2:40] Customizing messages

After this, how about customzing the messages? We will call the `setCustomValidity` API on each input element before any error is reported. We will also setup a formatError function to derive the message we want.

In this function, we are accessing the ValidityState of the input element through the `validity` property, which is a set of booleans that describes the result of each validation attributes. For example, if a required input is empty, the `valueMissing` property will be marked as `true`.

We haven't check if the passwords are matching yet. Unfortunately, there is no built-in validation attribute for this. We will have to validate it ourselves. To achieve that, we will pass the formData to our formatError function and compare their values. [40s]

### [2:40-3:30] Capturing errors

I know not everyone likes the error bubble. Let's capture the errors and display them next to the input instead. When the `reportValidity` API is called, the browser will fire an invalid event on each invalid input. We will use it to capture the latest validation message in an error state. Note that our form does not show any error bubble now because it is cancelled with the `preventDefault` method on the event object.

Once we have the error ready, we can render it next to the input. We are almost done. But there is one problem as you can see here: We just typed a password. But the message is still showing even after I re-submit the form. Why? It's because we are updating the message only on `invalid`, but the event handler will not be triggered when it becomes valid. To fix this, all we need is to reset it before reporting new errors.

Complete Demo [50s]

### [3:30-3:45] How about the server

Well, it's great to have client validation in place even without JavaScript. But it doesn't mean we can skip the server validation, right? How should we validate it on the server side? You cannot access the DOM on the server. Are we going to rewrite the validation logic again? This is where my secret sauce comes in [15s]

### [3:45-4:30] The secret sauce

This is a package for you to validate on the server based on the ValidityState with type inference support. Most importantly, it's 0kb on the client as you need it only on the server.

Let's get back to our example and see how it works. Here we are gonna extract the constraint of each form control and put it together as the schema.

Then, we will import the parse helper and parse the formData based on the schema and the formatError helper. If there is any error, we just send it back to the client and sync it with the client error state.

What's great about this approach is that we can reuse the same validation logic on the client and the server. It is now fully enhanced from the server and being able to show the same message even without JavaScript. [45s]

### [4:30-5:00] Progressive Enhancement / Comparing both validation experience and tradeoffs

### [5:00-5:15] Closing

To wrap up, we have learned how to use the Constraint Validation APIs to build better form. It's a progressive enhancement approach that makes your form more accessible and usable without JavaScript. [15s]
