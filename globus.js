const request = require('request-promise-native')

const transferBaseURL = 'https://transfer.api.globusonline.org/v0.10'
const authBaseURL = 'https://auth.globus.org/v2/api'

// https://docs.globus.org/api/transfer/acl

/**
 * getAccessRulesList - Get the list of access rules in the ACL for a specified endpoint.
 *
 * @param  {string} bearerToken  token authorized by globus.org.
 * @param  {Object} options
 * @param  {string} options.endpoint_xid   the id of the endpoint you'd like to list ACL's from.
 * @return {promise}             containing the body of the response.
 */
exports.getAccessRulesList = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/access_list'

  return request(url, {
    auth: { bearer: bearerToken },
    json: true
  })
}

/**
 * getAccessRulesListById - Get a single access rule for a specified endpoint by id.
 *
 * @param  {string} bearerToken          token authorized by globus.org.
 * @param  {Object} options
 * @param  {string} options.endpoint_xid the id of the endpoint you'd like to get an ACL from.
 * @param  {number} options.id           Integer id of an access rule.
 * @return {promise}                     containing the body of the response.
 */
exports.getAccessRulesListById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/access/' + options.id

  return request(url, {
    auth: { bearer: bearerToken },
    json: true
  })
}

/**
 * createAccessRule - opens an access point with a given user. Shared endpoint_xid's can be
 * found by looking at the details of the endpoint you want to piggy back off of.
 *
 * @param  {string} bearerToken  token authorized by globus.org.
 * @param  {Object} options
 * @param  {string} options.endpoint_xid   the id of the endpoint you'd like to base your share off of.
 * @param  {string} options.userId       the UUID of the user you'd like to share this endpoint with
 * @param  {string} options.path         an absolute path to the resoureces you'd like to share
 * @param  {string} options.permissions  a combination of 'r', 'w', to give the user read and write permissions
 * @param  {string} options.userEmail    the email of the user you'd like to notify
 * @param  {string} options.emailMessage the message you'd like to attach to the e-mail
 * @return {promise}             containing the body of the response
 */
exports.createAccessRule = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/access'
  const body = {
    DATA_TYPE: 'access',
    principal_type: 'identity',
    principal: options.userId,
    path: options.path,
    permissions: 'r',
    notify_email: options.userEmail
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * updateAccessRule - Update the permissions on an existing access rule. Other fields (besides DATA_TYPE which must always be present) may be omitted.
 * If the id is present it must match the id in the URL.
 *
 * @param  {string} bearerToken  token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.id             Unique id for this access rule. Implicit access rules from "access_manager" role assignments will have a null id, see role_id.
 * @param  {string} options.endpoint_xid   the id of the endpoint you'd like to base your share off of.
 * @param  {string} options.role_id        description
 * @param  {string} options.principal_type Type of principal that the rule applies to. One of "identity", "group", or "all_authenticated_users" or "anonymous".
 * @param  {string} options.principal      The subject of the access rule; the interpretation depends on principal_type: [See link here for options.](https://docs.globus.org/api/transfer/acl/#fields)
 * @param  {string} options.path           Absolute path to a directory the access rule applies to. The path must begin and end with a slash, and can’t contain un-normalized components "/../" or "/./". GridFTP endpoints and shared endpoints hosted on GridFTP endpoints also support home directory relative paths beginning with "/~/". The path is limited to 2000 characters after encoding; in practice this means 2000 ascii characters and slightly less when unicode is present and must be encoded.
 * @param  {string} options.permissions    How much permission to grant the principal specified in principal_type and principal. Either read-only, specified as "r", or read-write, specified as "rw".
 * @return {promise}             containing the body of the response
 */
exports.updateAccessRule = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/access/' + options.id
  const body = {
    DATA_TYPE: 'access',
    id: options.id,
    role_id: options.role_id,
    principal_type: options.principal_type,
    principal: options.principal,
    path: options.path,
    permissions: options.permissions
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * deleteAccessRule - Delete a single access rule, specified by id.
 * Returns a result document with code "Deleted" on success and HTTP status code 200, and an "AccessRuleNotFound" error if the rule has already been deleted.
 * If the client is using a retry loop, both should be accepted as success in case the first successful attempt is disconnected after the request is processed
 * but before the response is received by the client.
 *
 * @param  {string} bearerToken  token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid the id of the endpoint you'd like to delete an ACL from
 * @param  {number} options.id          Integer id of an access rule.
 * @return {promise}             containing the body of the response
 */
exports.deleteAccessRule = function(bearerToken, options) {
  const url = options.transferBaseURL + '/endpoint/' + options.endpoint_xid + '/access/' + options.id

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'DELETE',
  })
}

// https://docs.globus.org/api/transfer/endpoint_activation/#get_activation_requirements
/**
 * getActivationRequirements - Gets the activation requirements of a particular endpoint.
 *
 * @param  {string} bearerToken token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  UUID of endpoint you want to get the activation requirements for
 * @return {promise}          containing the body of the response
 */
exports.getActivationRequirements = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/activation_requirements'

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * autoActivateEndpoint - Attempt to auto activate an endpoint. The response will always contain a code field. If the code is "AutoActivateFailed", the response will also include an
 * activation requirements document, which can be filled in and submited to activate. On success, it will return a result code of the form "AutoActivated.CREDENTIAL_SOURCE", where
 * CREDENTIAL_SOURCE indicates the how the credential was acquired.
 *
 * @param  {type} bearerToken  description
 * @param  {type} endpoint_xid description
 * @return {type}              description
 */
exports.autoActivateEndpoint = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/autoactivate'

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
  })
}

/**
 * activateEndpoint - To active an endpoint, clients should get the activation
 *  requirements for the endpoint (either explicitly or from the autoactivate
 *  result), pick an activation method, and fill in values for the chosen
 *  activation method. The requirements for the other methods not being used
 *  must be removed before submitting the request.
 *
 * On success, it will return a result code of the form "Activated.TYPE", where
 * TYPE indicates the type of activation used.
 *
 * @param  {string} bearerToken                      token authorized by globus.org
 * @param  {object} options
 * @param  {string} options.endpoint_xid                       UUID of endpoint you want to activate
 * @param  {object} options.document a json object gotten from getActivationRequirements(..) with the required values filled in (https://docs.globus.org/api/transfer/endpoint_activation/#activation_requirements_document)
 * @return {promise}                                  containing the body of the response
 */
exports.activateEndpoint = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/activate'
  const body = options.document

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * deactivateEndpoint - Deactivates a endpoint given its UUID.
 *
 * @param  {string} bearerToken token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  UUID of endpoint you want to deactivate
 * @return {promise}          containing the body of the response
 */
exports.deactivateEndpoint = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/deactivate'

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
  })
}

// https://docs.globus.org/api/auth/reference/#api_endpoints
/**
 * getUserId - Given a token authorized by globus.org and a user's e-mail registered by globus
 * it returns the user's id. Can be used in conjunction with shareEndpointWithUser's userId
 * feild.
 *
 * @param  {string} bearerToken token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.userEmail   User's e-mail
 * @return {promise}            containing the body of the response
 */
exports.getUserId = function(bearerToken, options) {
  const url = authBaseURL + '/identities?usernames=' + options.userEmail.replace('@', '%40')

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

// https://docs.globus.org/api/transfer/endpoint/#operations
/**
 * getEndpointById - get's information about an endpoint given its endpoint_xid.
 *
 * @param  {string} bearerToken token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @return {promise}            containing the body of the response
 */
exports.getEndpointById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * createEndpoint - (__UNTESTED__) Create an endpoint. Which fields are required depends on the type of endpoint.
 * Note that name and canonical_name are deprecated and supported only for backward compatibility; display_name
 * should be used instead of, or in addition to, these fields. If canonical_name is not set, it will
 * default to "USERNAME#ENDPOINT_UUID". At least one of them must be specified.
 * The result will include an id field containing the globally unique endpoint id, which should
 * be used to further manipulate the endpoint document, and to perform transfers and other operations
 * on the endpoint’s filesystem.
 *
 * @param  {string} bearerToken      token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.display_name     Friendly name for the endpoint, not unique. Unicode string, max 128 characters, no new lines (\r or \n). If not specified, will default to canonical_name, but that is deprecated and all new clients hould use id and display_name. Searchable.
 * @param  {object[]} options.documents Array of [server documents](https://docs.globus.org/api/transfer/endpoint/#server_document) that each represents a network service that provides access to a filesystem. The most common type is a GridFTP server, which is represented by scheme "gsiftp". This is also the default scheme.
 * @return {promise}            containing the body of the response
 */
exports.createEndpoint = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint'
  const body = {
    display_name: options.display_name,
    DATA: options.documents
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * createSharedEndpoint - creates a shared_endpoint endpoint that it's ACL can be editted
 * to share paths with certain people.
 *
 * @param  {string} bearerToken  token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.displayName  Friendly name for the endpoint, not unique. Unicode string, max 128 characters, no new lines (\r or \n). If not specified, will default to canonical_name, but that is deprecated and all new clients hould use id and display_name. Searchable.
 * @param  {string} options.hostId       Id of standard endpoint hosting the shared endpoint.
 * @param  {string} options.path         Root path being shared on the host endpoint.
 * @param  {string} options.description  A description of the endpoint. Unicode string, max length 4096 characters. Included in fulltext search.
 * @param  {string} options.organization Organization that runs the server(s) represented by the endpoint. Optional to preserve backward compatibility, but will eventually be required and all clients are encouraged to require users to specify it. Unicode string, max 1024 characters, no new lines. Searchable.
 * @return {promise}             containing the body of the response
 */
exports.createSharedEndpoint = function(bearerToken, options) {
  const url = transferBaseURL + '/shared_endpoint'
  const body = {
    DATA_TYPE: 'shared_endpoint',
    display_name: options.displayName,
    host_endpoint: options.hostId,
    host_path: options.path,
    description: options.description,
    organization: options.organization
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * exports - Update an endpoint. This can be done using a partial document by specifying only DATA_TYPE and the fields to be updated, or doing a GET on the endpoint,
 * changing the appropriate fields, and doing a PUT of the full document. Using a partial document is preferred.
 *
 * @param  {string} bearerToken               token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid              The UUID of the endpoint.
 * @param  {object} options.document Look at this [link](https://docs.globus.org/api/transfer/endpoint/#update_endpoint_by_id) for an explanation of a partial_endpoint_document based off of server and updated fields.
 * @return {promise}             containing the body of the response
 */
exports.updateEndpointById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid
  const body = options.document

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * deleteEndpointById - Delete an endpoint by id or canonical name (the latter is deprecated). Only the owner can delete the endpoint. Note that all data associated with the endpoint,
 *  including roles and the ACL, will be deleted as well. If the hostname of the server has changed, the server document(s) in the endpoint should be changed rather than deleting and
 *  recreating the endpoint with different servers.
 *
 * @param  {string} bearerToken               token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid              The UUID of the endpoint.
 * @return {promise}             containing the body of the response
 */
exports.deleteEndpointById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'DELETE',
  })
}

/**
 * getEffectivePauseRuleList - Get all pause rules on an endpoint that affect the current user, with sensitive administrator only fields removed.
 *
 * @param  {string} bearerToken           token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @return {promise}             containing the body of the response
 */
exports.getEffectivePauseRuleList = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/my_effective_pause_rule_list'

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * getEndpointServerList - Get a list of all servers belonging to the specified endpoint. Note that this is the same as the server list included under the "DATA" key
 * of the endpoint document.
 *
 * @param  {string} bearerToken               token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid              The UUID of the endpoint.
 * @return {promise}             containing the body of the response
 */
exports.getEndpointServerList = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/server_list'

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * getEndpointServerById - Get a specific server belonging to the specified endpoint.
 *
 * @param  {string} bearerToken   token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @param  {string} options.server_id     UUID of the server you want get.
 * @return {promise}             containing the body of the response
 */
exports.getEndpointServerById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/server_list'

  throw new Error('FIXME(param server_id not used)')

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * exports - Add a server to the specified endpoint. The hostname field is required, scheme and port default to "gsiftp" and 2811, and subject defaults to "null". The derived fields
 * and boolean status fields are ignored, and should not be included in the request body.
 * Returns a result document containing the id of the newly added server.
 *
 * @param  {string} bearerToken   token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @param  {string} options.hostname     Hostname of the server.
 * @param  {string} options.uri          URI of the server. This is a derived field combining the scheme, hostname, and port, and is not used when creating servers.
 * @param  {string} options.port         Port the server is listening on. Default: 2811.
 * @param  {string} options.scheme       URI scheme (protocol) used by the endpoint. Must be "gsiftp" or "ftp". Default: "gsiftp".
 * @return {promise}             containing the body of the response
 */
exports.addEndpointServer = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/server'
  const body = {
    DATA_TYPE: 'server',
    hostname: options.hostname,
    uri: options.uri,
    port: options.port || '2811',
    scheme: options.scheme || 'gsiftp'
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * updateEndpointServerById - Update a server belonging to the specified endpoint. Include only the fields to be updated in the request body - any of hostname, scheme, port, and subject can be updated.
 *
 * @param  {string} bearerToken   token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @param  {string} options.server_id       The UUID of the server you wish to update.
 * @param  {string} options.hostname     Hostname of the server.
 * @param  {string} options.uri          URI of the server. This is a derived field combining the scheme, hostname, and port, and is not used when creating servers.
 * @param  {string} options.port         Port the server is listening on. Default: 2811.
 * @param  {string} options.scheme       URI scheme (protocol) used by the endpoint. Must be "gsiftp" or "ftp". Default: "gsiftp".
 * @param  {string} options.subject      subject of the x509 certificate of the server. If not specified, the CN in the subject must match its hostname.
 * @return {promise}             containing the body of the response
 */
exports.updateEndpointServerById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/server/' + options.server_id
  const body = {
    DATA_TYPE: 'server',
    hostname: options.hostname,
    uri: options.uri,
    port: options.port || '2811',
    scheme: options.scheme || 'gsiftp',
    subject: options.subject
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'PUT',
    body: body,
    json: true
  })
}

/**
 * deleteEndpointServerById - Delete a server belonging to the specified endpoint.
 *
 * @param  {string} bearerToken   token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @param  {string} options.server_id       The UUID of the server you wish to update.
 * @return {promise}             containing the body of the response
 */
exports.deleteEndpointServerById = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + '/server/' + options.server_id

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'DELETE',
  })
}

/**
 * getSharedEndpointList - Get a list of shared endpoints owned by the current user and hosted by a given GridFTP or Globus Connect Personal endpoint. Returns a
 * "BadRequest" error if called on an endpoint that can’t host shared endpoints.
 *
 * @param  {string} bearerToken   token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The UUID of the endpoint.
 * @return {promise}              containing the body of the response
 */
exports.getSharedEndpointList = function(bearerToken, options) {
  const url = transferBaseURL + '/endpoint/' + options.endpoint_xid + 'my_shared_endpoint_list'

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

// https://docs.globus.org/api/transfer/file_operations/#operations

/**
 * listDirectoryContents - List the contents of the directory at the specified path on an endpoint’s filesystem. The endpoint must be activated before performing this operation.
 *
 * The path is specified in the path query parameter. If the parameter is not passed, the default path depends on the type of endpoint
 *
 * @param  {string} bearerToken       Token authorized by globus.org.
 * @param  {Object} options
 * @param  {string} options.endpoint_xid      The id of the endpoint you'd like to get an ACL from.
 * @param  {string} options.path              (**OPTIONAL**) For shared endpoints, S3 endpoints, and anonymous FTP endpoints, the default is /. For GridFTP endpoints, the default is /~/. Most of the time this will map to the user’s home directory. However the administrator of the GridFTP server can configure it to point elsewhere. Also as a special case, if the restricted paths configuration on the server does not allow the user’s home directory, it will fall back to /.
 * @param  {string} options.query_parameters  (**OPTIONAL**) Added on query parameters to the end of the string (must be prefixed with an ampersand).  [Link](https://docs.globus.org/api/transfer/file_operations/#dir_listing_query_parameters)
 * @return {promise}             containing the body of the response.
 */
exports.listDirectoryContents = function(bearerToken, options) {
  const url = transferBaseURL + '/operation/endpoint/' + options.endpoint_xid + '/ls?path='
    + (options.path || '/')
    + (options.query_parameters || '')

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * makeDirectory - Create a directory at the specified path on an endpoint filesystem. The endpoint must be activated before performing this operation.
 *
 * @param  {string} bearerToken       Token authorized by globus.org.
 * @param  {Object} options
 * @param  {string} options.endpoint_xid      The id of the endpoint you'd like to get an ACL from.
 * @param  {string} options.path              For shared endpoints, S3 endpoints, and anonymous FTP endpoints, the default is /. For GridFTP endpoints, the default is /~/. Most of the time this will map to the user’s home directory. However the administrator of the GridFTP server can configure it to point elsewhere. Also as a special case, if the restricted paths configuration on the server does not allow the user’s home directory, it will fall back to /.
 * @return {promise}             containing the body of the response.
 */
exports.makeDirectory = function(bearerToken, options) {
  const url = transferBaseURL + '/operation/endpoint/' + options.endpoint_xid + '/mkdir'
  const body = {
    DATA_TYPE: 'mkdir',
    path: options.path,
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * rename - Rename or move a file or directory on an endpoint filesystem. The endpoint must be activated before performing this operation. When moving to a different parent directory, the parent directory of the new path must already exist.
 *
 * @param  {string} bearerToken       Token authorized by globus.org.
 * @param  {Object} options
 * @param  {string} options.endpoint_xid  The id of the endpoint you'd like to get an ACL from.
 * @param  {string} options.old_path      For shared endpoints, S3 endpoints, and anonymous FTP endpoints, the default is /. For GridFTP endpoints, the default is /~/. Most of the time this will map to the user’s home directory. However the administrator of the GridFTP server can configure it to point elsewhere. Also as a special case, if the restricted paths configuration on the server does not allow the user’s home directory, it will fall back to /.
 * @param  {string} options.new_path      For shared endpoints, S3 endpoints, and anonymous FTP endpoints, the default is /. For GridFTP endpoints, the default is /~/. Most of the time this will map to the user’s home directory. However the administrator of the GridFTP server can configure it to point elsewhere. Also as a special case, if the restricted paths configuration on the server does not allow the user’s home directory, it will fall back to /.
 * @return {promise}             containing the body of the response.
 */
exports.rename = function(bearerToken, options) {
  const url = transferBaseURL + '/operation/endpoint/' + options.endpoint_xid + '/rename'
  const body = {
    DATA_TYPE: 'rename',
    old_path: options.old_path,
    new_path: options.new_path
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

// https://docs.globus.org/api/transfer/task_submit/#operations_requirements
/**
 * getSubmissionId - Get a submission id, required when submitting transfer and delete tasks.
 * Note that this is different than the task id returned by the submit operations.
 *
 * @param  {string} bearerToken     token authorized by globus.org
 * @return {promise}                containing the body of the response object
 */
exports.getSubmissionId = function(bearerToken) {
  const url = transferBaseURL + '/submission_id'

  return request(url, {
    auth: { bearer: bearerToken },
  })
}

/**
 * submitTransferTask - Submits a transfer task.
 *
 * @param  {string} bearerToken              token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.submission_id            Id acquired from getSubmissionId
 * @param  {string} options.label                    user specified string to help identify the Transfer or delete task.
 * @param  {boolean} options.notify_on_succeeded     If true and the user has notification enabled, send a notification email when the transfer completes with status SUCCEEDED.
 * @param  {boolean} options.notify_on_failed        If true and the user has notification enabled, send a notification email when the transfer completes with status FAILED.
 * @param  {boolean} options.notify_on_inactive      If true and the user has notification enabled, send a notification email when the transfer enters status INACTIVE, e.g. from activation credentials expiring.
 * @param  {string} options.source_endpoint          UUID of the endpoint to transfer data from.
 * @param  {string} options.destination_endpoint     UUID of the endpoint to transfer data to.
 * @param  {object[]} options.DATA                     List of [transfer_item](https://docs.globus.org/api/transfer/task_submit/#transfer_item_fields) documents containing source and destination paths.
 * @param  {boolean} options.encrypt_data            If true, encrypt the data channel. If either the source or destination endpoint, or for shared endpoints the source or destination host endpoint, has force_encryption set, the data channel will be encrypted even if this is set to false.
 * @param  {integer} options.sync_level              review this [link](https://docs.globus.org/api/transfer/task_submit/#transfer_specific_fields) for information on this field.
 * @param  {boolean} options.verify_checksum          After transfer, verify that the source and destination file checksums match. If they don’t, re-transfer the entire file and keep trying until it succeeds.
 * @param  {boolean} options.preserve_timestamp       Preserve file modification time.
 * @param  {boolean} options.delete_destination_extra Delete extraneous files in the destination directory. Only applies for recursive directory transfers.
 * @return {promise}                containing the body of the response object
 */
exports.submitTransferTask = function(bearerToken, options) {
  const url = transferBaseURL + '/transfer'
  const body = {
    DATA_TYPE: 'transfer',
    submission_id: options.submission_id,
    label: options.label,
    notify_on_succeeded: options.notify_on_succeeded,
    notify_on_failed: options.notify_on_failed,
    notify_on_inactive: options.notify_on_inactive,
    source_endpoint: options.source_endpoint,
    destination_endpoint: options.destination_endpoint,
    DATA: options.DATA,
    encrypt_data: options.encrypt_data,
    sync_level: options.sync_level,
    verify_checksum: options.verify_checksum,
    preserve_timestamp: options.preserve_timestamp,
    delete_destination_extra: options.delete_destination_extra
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}

/**
 * submitDeletionTask - Submit a delete task to globus
 *
 * @param  {string} bearerToken     token authorized by globus.org
 * @param  {Object} options
 * @param  {string} options.endpoint        UUID of the endpoint containing the file system you want to delete from
 * @param  {object} options.DATA            List of [delete_item](https://docs.globus.org/api/transfer/task_submit/#delete_item_fields) documents containing paths to delete.
 * @param  {boolean} options.recursive       Delete directory contents recursively. Required if any of the delete items point to a directory.
 * @param  {boolean} options.ignore_missing  Don’t generate errors for non existent files and directories.
 * @param  {boolean} options.interpret_globs Interpret shell globs at the end of paths. Supports *, ?, [, and ] with their standard shell meanings and \ for escaping, but only in the last segment of the path. If false (the default), these special characters will be escaped and treated as literals.
 * @return {promise}                 containing the body of the response object
 */
exports.submitDeletionTask = function(bearerToken, options) {
  throw new Error('Not implemented')

  // Refer to documentation to validate code below
  const url = transferBaseURL + '/delete'
  const body = {
    DATA_TYPE: 'delete',
    endpoint: options.endpoint,
    recursive: options.recursive,
    ignore_missing: options.ignore_missing,
    interpret_globs: options.interpret_globs,
  }

  return request(url, {
    auth: { bearer: bearerToken },
    method: 'POST',
    body: body,
    json: true
  })
}
