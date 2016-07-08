# globus-js

A package for interacting with the globus.org REST API.

[globus.org](globus.org)

## Install

npm install --save-dev globus-js

## TODO
* Format modules into API logical section
  * [Task Submission](https://docs.globus.org/api/transfer/task_submit/)
  * [Task Monitoring](https://docs.globus.org/api/transfer/task/)
  * [File Operations](https://docs.globus.org/api/transfer/file_operations/)
  * [Endpoint Management](https://docs.globus.org/api/transfer/endpoint/)
  * [Endpoint Search](https://docs.globus.org/api/transfer/endpoint_search/)
  * [Endpoint Roles](https://docs.globus.org/api/transfer/endpoint_roles/)
  * [Endpoint Bookmarks](https://docs.globus.org/api/transfer/endpoint_bookmarks/)
  * [Endpoint ACL](https://docs.globus.org/api/transfer/acl/)
* Write script prepublish to construct minified globus.js file
* Reformat README to be more readable
* Move documentation to github wiki

# API

## getUserId

getUserId - Given a token authorized by globus.org and a user's e-mail registered by globus
it returns the user's id. Can be used in conjunction with shareEndpointWithUser's userId
feild.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `userEmail` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** User's e-mail

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** contains a string of the User's UUID

___

## shareEndpointWithUser

shareEndpointWithUser - opens an access point with a given user. Shared endpointId's can be
found by looking at the details of the endpoint you want to piggy back off of.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `endpointId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the id of the endpoint you'd like to base your share off of
-   `userId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the UUID of the user you'd like to share this endpoint with
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an absolute path to the resoureces you'd like to share
-   `userEmail` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the email of the user you'd like to notify
-   `emailMessage` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the message you'd like to attach to the e-mail

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** containing the body of the response

___

## getEndPoint

getEndPoint - get's information about an endpoint given its endpointId.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `endpointId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the id of the endpoint you'd like to base your share off of

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** containing the body of the response

___

## createEndPoint

createEndPoint - creates a shared_endpoint endpoint that it's ACL can be editted
to share paths with certain people.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `displayName` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** display name of the endpoint
-   `hostId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the Id of the host endpoint that this endpoint will append
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an absolute path to the resoureces you'd like to share
-   `description` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** a short description of the endpoint
-   `organization` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the organization that is opening this endpoint

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** containing the body of the response

___

## getActivationRequirements

getActivationRequirements - Gets the activation requirements of a particular endpoint.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `endpointId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** UUID of endpoint you want to get the activation requirements for

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** containing the body of the response

___

## activateEndpoint

activateEndpoint - To active an endpoint, clients should get the activation
 requirements for the endpoint (either explicitly or from the autoactivate
 result), pick an activation method, and fill in values for the chosen
 activation method. The requirements for the other methods not being used
 must be removed before submitting the request.

On success, it will return a result code of the form "Activated.TYPE", where
TYPE indicates the type of activation used.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `endpointId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** UUID of endpoint you want to activate
-   `activation_requirements_document` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** a json object gotten from getActivationRequirements(..) with the required values filled in (<https://docs.globus.org/api/transfer/endpoint_activation/#activation_requirements_document>)

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** containing the body of the response

___

## deactivateEndpoint

deactivateEndpoint - Deactivates a endpoint given its UUID.

**Parameters**

-   `bearerToken` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** token authorized by globus.org
-   `endpointId` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** UUID of endpoint you want to deactivate

Returns **[promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** containing the body of the response
