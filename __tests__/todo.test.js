const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const andrea = {
  email: 'andrea@example.com',
  password: 'password',
};

const mockTodo = {
  task: 'Wash the dishes',
  done: false,
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

const signIn = async (user) => {
  const agent = request.agent(app);
  await agent.post('/api/v1/users/sessions').send(user);
  return [agent, user];
};

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST /api/v1/todos creates a new todo for the logged in user', async () => {
    const [agent, user] = await registerAndLogin();
    const resp = await agent.post('/api/v1/todos').send(mockTodo);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      task: mockTodo.task,
      done: mockTodo.done,
      user_id: user.id,
    });
  });

  it('returns the todos for a given user', async () => {
    const [agent, user] = await signIn(andrea);
    const resp = await agent.get('/api/v1/todos');
    expect(resp.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});
