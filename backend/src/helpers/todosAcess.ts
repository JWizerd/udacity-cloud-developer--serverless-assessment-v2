import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createDynamoDBClient } from '../utils/dynamo-db-get-client';
import { TodoItem } from "../models/TodoItem";

export default class TodoAccess {
  constructor(
    private readonly client: DocumentClient = createDynamoDBClient(),
    private readonly table: string = process.env.TODOS_TABLE
  ) { }

  async findAll(userId: string): Promise<TodoItem[]> {
    var params: DocumentClient.QueryInput = {
      ExpressionAttributeValues: {
        ':userId': userId
      },
      IndexName: process.env.TODO_GLOBAL_SECONDARY_INDEX_NAME,
      KeyConditionExpression: 'userId = :userId',
      TableName: this.table
    };

    const result = await this.client.query(params).promise();

    return result.Items as TodoItem[];
  }

  async findOne(userId: string, todoId: string): Promise<TodoItem> {
    var params: DocumentClient.GetItemInput = {
      Key: {
        todoId,
        userId
      },
      TableName: this.table
    };

    const result = await this.client.get(params).promise();

    return result.Item as TodoItem;
  }

  async create(todoItem: TodoItem): Promise<TodoItem> {
    await this.client.put({
      TableName: this.table,
      Item: todoItem
    }).promise();

    return todoItem as TodoItem;
  }

  async delete(todoId: string, userId: string): Promise<string> {
    await this.client.delete({
      TableName: this.table,
      Key: {
        todoId,
        userId
      }
    }).promise();

    return todoId;
  }

  async update(todoId: string, todoItem: TodoItem, userId: string): Promise<TodoItem> {
    const existingTodo = await this.findOne(userId, todoId);

    const mergedAttributes = {
      ...existingTodo,
      ...todoItem
    };

    await this.client.update({
      TableName: this.table,
      Key: {
        todoId: todoId,
        userId: userId,
      },
      UpdateExpression: "set todo.#n= :a , todo.dueDate= :b , todo.done= :c",
      ExpressionAttributeNames: {
        "#n": "name"
      },
      ExpressionAttributeValues: {
        ":a": mergedAttributes.name,
        ":b": mergedAttributes.dueDate,
        ":c": mergedAttributes.done
      },
      ReturnValues: "ALL_NEW"
    }).promise();

    return todoItem as TodoItem;
  }
}