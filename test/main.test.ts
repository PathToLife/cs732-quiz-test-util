import axios from "axios";

/**
 * The definition of the REST service required is as follows:
 * - GET /api/todos:
 *   returns a 200 response with a list of all todo items in the database.
 * - GET /api/todos/{id}:
 *   returns a 200 response with the single todo item with the given id if it exists, or a 404 response if that todo does not exist.
 * - POST /api/todos:
 *   Receives a new todo item in the request body (consisting of a description, completed status, and due date - NOT including the id, which is to be created by the backend), and adds it to the database. If successful, returns a 201 response with a Location header set to the new todo item's URI, as per #2 above. If a failure occurs, an appropriate 4XX or 5XX response should be returned.
 * - PUT /api/todos/{id}:
 *   Updates an existing todo item. If a todo with the given id exists, its description, completed status, and due date should be updated according to the data contained within the request body, and a 204 response should be returned. If not, a 404 response should be returned.
 * - DELETE /api/todos/{id}:
 *   Deletes the todo with the given id, if it exists. Returns a 204 response regardless of whether any todo item was actually deleted
 */

const axiosClient = axios.create({
  validateStatus: () => true,
})

const PORT = 3001;

describe("step 2 test", () => {
  const BASE_URL = `http://127.0.0.1:${PORT}`;

  let exampleTodo: any | null = null;

  it("should get at least one todos", async () => {
    const res = await axiosClient.get(`${BASE_URL}/api/todos`);
    expect(res.status).toBe(200);
    expect(res.data.length).toBeDefined();
    expect(res.data.length).toBeGreaterThan(0);

    // set example todo for later tests
    exampleTodo = res.data[0];
  });

  it("should get a todo by id", async () => {
    const res = await axiosClient.get(`${BASE_URL}/api/todos`);
    expect(res.status).toBe(200);
    expect(res.data.length).toBeGreaterThan(0);
    const todo = res.data[0];
    expect(todo).toBeDefined();

    const id = todo.id || todo["_id"];
    expect(id).toBeDefined();

    // get the todo by id
    const res2 = await axiosClient.get(`${BASE_URL}/api/todos/${id}`);
    expect(res2.status).toBe(200);
    expect(res2.data).toEqual(todo);
  });

  it("should return 404 for non existent todo", async () => {
    const res = await axiosClient.get(`${BASE_URL}/api/todos/629d46c01f6f3f55f19f48ef`);
    expect(res.status).toBe(404);
  })

  it("should create a todo", async () => {
    expect(exampleTodo).not.toBeNull();
    if (exampleTodo == null) return;
    const newTodo = {...exampleTodo};
    delete newTodo["id"];
    delete newTodo["_id"];
    delete newTodo["__v"];
    const res2 = await axiosClient.post(`${BASE_URL}/api/todos`, newTodo);

    expect(res2.status).toBe(201);
    expect(res2.headers.location).toBeDefined();
  });

  it("should update todo", async () => {
    expect(exampleTodo).not.toBeNull();
    const id = exampleTodo.id || exampleTodo["_id"];
    expect(id).toBeDefined();

    // update todo, set false
    let completeKey = Object.keys(exampleTodo).find((key) =>
      key.toLowerCase().includes("complete") || key.toLowerCase().includes("status") || key.toLowerCase().includes("done")
    );
    expect(completeKey).toBeDefined();

    if (!completeKey) return;
    const res1 = await axiosClient.put(`${BASE_URL}/api/todos/${id}`, {
      ...exampleTodo,
      [completeKey]: false,
    });

    expect(res1.status).toBe(204);

    const res2 = await axiosClient.get(`${BASE_URL}/api/todos/${id}`);
    expect(res2.status).toBe(200);
    expect(res2.data[completeKey]).toBe(false);

    // update the todo again, set true
    const res3 = await axiosClient.put(`${BASE_URL}/api/todos/${id}`, {
      ...exampleTodo,
      [completeKey]: true,
    });

    expect(res3.status).toBe(204);

    const res4 = await axiosClient.get(`${BASE_URL}/api/todos/${id}`);
    expect(res4.status).toBe(200);
    expect(res4.data[completeKey]).toBe(true);
  });

  it('should delete todo', async () => {
    expect(exampleTodo).not.toBeNull();
    const id = exampleTodo.id || exampleTodo["_id"];
    expect(id).toBeDefined();
    const res = await axiosClient.delete(`${BASE_URL}/api/todos/${id}`);
    expect(res.status).toBe(204);

    await new Promise<void>((res) => setTimeout(() => res(), 200))

    const res2 = await axiosClient.get(`${BASE_URL}/api/todos/${id}`);
    expect(res2.data).not.toEqual(exampleTodo);
  })

  it('should return 204 for delete of valid but non existent mongodb id', async () => {
    const resFakeDelete = await axiosClient.delete(`${BASE_URL}/api/todos/629d46c01f6f3f55f19f48ef`);
    expect(resFakeDelete.status).toBe(204);
  })

  it('should return 204 for delete of non valid id', async () => {
    const resFakeDelete = await axiosClient.delete(`${BASE_URL}/api/todos/NOTANID`);
    expect(resFakeDelete.status).toBe(204);
  })
});
