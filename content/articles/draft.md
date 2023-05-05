## Scripts

### [0:00-0:10] Introduction (Who am I, what I do, why I am here)

Hi everyone, my name is Edmund Hung. I am a senior software engineer at DeliveryHero.
I maintain Remix Guide and a form validation library called Conform. Let's get started.

### [0:10-0:25] What is Constraint Validation? (Use the platform)

First of all, Constraint Validation is a browser mechanism for form validation. It was introduced in HTML5 and is now supported by all modern browsers. [15s]

### [0:25-1:00] Validation Attributes

Let's say we are building a simple signup form and this is how the markup could look. Now, if we type remix here and submit it, what will happen?

Well, the browser blocks our form submission and tells us the email is invalid, because the email type here is one of the validation attributes. These attributes let us define a constraint based on different usecases. For example, we can mark an input as required with the required attrbute. We can also enforce a password policy using the minlength and pattern attributes.

Now, we are gonna progressively enhance it using the DOM APIs. [35s]

### [1:00-1:40] Disable default browser validation

The first step is to disable default browser validation. Why? Let's take a look at the validation flow. The top diagram shows how the browser works by default. When a form is submited, the browser validates the form and fires a submit event only if the form is valid. There is no way for us to add custom logic to this process. Now, in the bottom diagram, we are gonna disable the default browser validation, so that the submit event is fired immediately, and then re-implement the browser validation again.

Let's apply this to our signup form example. First, we disable default browser validation with the `noValidate` attribute, then we re-implement it on the submit event handler using the `reportValidity` method on the form element. If the form is invalid, We will also block the submission. And you can see the error is displaying again. [40s]

### [1:40-2:45] Customizing errors

Next, we need to learn about the error interface of the input element.

First, the error message displayed is defined by the `validationMessage` property. It can be overridden with the `setCustomValidity` method. If we want to know more about the error, we can also check the `validity` property. This property represents the `ValidityState` of the input with each boolean describes the result of a different validation attribute.

With this in mind, if we wanna customize the error message, this is how the new validation flow looks. The top diagram shows the validation flow that we enhanced earlier. Now in the bottom diagram, we customize the error before calling the reportValidity API. Let's go back to our example again.

Here we define a `formatError` function that derives the message based on the input element and a formData object. We also loop over each input and pass the result to the `setCustomValidity` method.

Inside the `formatError` function, we are checking both the name and the ValidityState of the input. We are also comparing the password and confirm password fields manually because there is no validation attribute that covers this usecase. Now, if we click on the submit button, we can see the error message updated. [65s]

### [2:45-3:45] Synchronizing errors

The next thing to learn about is the `invalid` event. When browser validation happens, an `invalid` event will be fired on each invalid input and trigger error display like in the top diagram here. This gives us a chance to capture the error state and customize how error should be reported. But, as there is no `valid` event available, we can't track when an invalid input becomes valid again. To fix this, we need to reset the error state before synchronizing new errors as shown in the bottom diagram.

Let me show you how this works. First, we prepare an error state that maps input name to error message. Then, we synchronize the validationMessage in the invalid event handler and cancel error display with `preventDefault`. We are also reseting the error state as mentioned.

Now, we can display the error message anywhere we want, like this. [60s]

### [3:45-4:40] How about the server

Well, it's great to have client validation in place even without JavaScript. But it doesn't mean we should skip the server validation.

Let me introduce you to the Conform ValidityState helper.
This is a package for you to perform server validation by providing a ValidityState like interface based on the validation attributes. It supports type inference and coercions. It is also 0kb on the client as you need it only on the server.

Let's get back to our example and see how it works. Here we extract the constraint of each input and combine them into a schema.

Then, we import the `parse` helper to parse the formData based on the schema and the formatError function. If there is any error, we just send it back to the client and synchronize it with the client error state.

Now, if I disable JavaScript, our form will continue to work just fine. [55s]

### [4:40-5:00] Summary

In the end, I wanna say it's just the web. Once you get the gist of this talk, you should be able to apply it anywhere, whether or not you are using Remix.

If you wanna know more about this topic, feel free to check out my project on GitHub, or find me on Twitter. Thank you. [15s]
