import * as uuid from "uuid";
import TodoAccess from "../../helpers/todosAcess";
import { CreateTodoRequest } from "../../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import { TodoItem } from "../../models/TodoItem";

const todoAccess = new TodoAccess();

export const createTodo = async (todoItem: CreateTodoRequest, userId: string): Promise<TodoItem> => {
  const requestMergedWithDefaults: TodoItem = {
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: "",
    userId,
    ...todoItem,
  } as TodoItem;

  const saved = await todoAccess.create(requestMergedWithDefaults);

  return saved;
}

export const updateTodo = async (todoId: string, todoItem: UpdateTodoRequest, userId: string): Promise<TodoItem> => {
  const updated = await todoAccess.update(todoId, todoItem as TodoItem, userId);
  return updated;
}

export const deleteTodo = async (todoId: string, userId: string): Promise<string> => {
  await todoAccess.delete(todoId, userId);
  return todoId;
}

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  const items = await todoAccess.findAll(userId);

  return items as TodoItem[];
}

export const getTodo = async (userId: string, todoId: string): Promise<TodoItem> => {
  const items = await todoAccess.findOne(userId, todoId);
  return items as TodoItem;
}