export default {
  generateUploadUrl: {
    name: "generate upload url",
    success: "generating upload url",
    error: "could not generate upload url"
  },
  authorizer: {
    name: "authorize user",
    success: "successfully authorized user",
    error: "failed to authorize user"
  },
  decodeToken: {
    error: {
      noKid: "No kid provided in token!"
    }
  },
  getToken: {
    error: {
      noheader: 'No authentication header',
      invalidHeader: 'Invalid authentication header'
    }
  },
  getSigningKey: {
    error: {
      noAssocKey: "Key was not signed by application"
    }
  },
  delete: {
    name: "delete todo",
    success: "deleting todo",
    error: "could not delete todo"
  },
  create: {
    name: "create todo",
    success: "creating todo",
    error: "could not create todo"
  },
  update: {
    name: "update todo",
    success: "updating todo",
    error: "could not update todo"
  },
  findAll: {
    name: "find all todos",
    success: "fetching list of todos",
    error: "could not return list of todos"
  }
}