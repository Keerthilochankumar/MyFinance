const { signup, signin, signout } = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
jest.useFakeTimers();

jest.mock('../models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(),
    close: jest.fn(),
  },
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  describe('signup', () => {
    it('should create a new user', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', username: 'testuser', password: 'password123' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const hashedPassword = 'hashedPassword';
      bcrypt.hash.mockResolvedValue(hashedPassword); // Mock bcrypt.hash to return hashedPassword
      User.create.mockResolvedValue({ email: 'test@example.com', username: 'testuser', password: hashedPassword });

      await signup(mockRequest, mockResponse);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); // Ensure bcrypt.hash is called with correct parameters
      expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', username: 'testuser', password: hashedPassword });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: { email: 'test@example.com', username: 'testuser', password: hashedPassword } });
    });

    it('should handle errors during user creation', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', username: 'testuser', password: 'password123' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockError = new Error('User creation failed');
      bcrypt.hash.mockResolvedValue('hashedPassword'); // Mock bcrypt.hash
      User.create.mockRejectedValue(mockError);

      await signup(mockRequest, mockResponse);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', username: 'testuser', password: 'hashedPassword' });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User creation failed' });
    });
  });

  describe('signin', () => {
    it('should return a token for valid credentials', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', password: 'password123' }
      };
      const mockResponse = {
        json: jest.fn()
      };
      const user = { id: 1, password: 'hashedPassword' };
      const token = 'mockToken';
      User.findOne.mockResolvedValue(user);
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue(token);

      await signin(mockRequest, mockResponse);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '7h' });
      expect(mockResponse.json).toHaveBeenCalledWith({ token });
    });

    it('should return 401 for invalid credentials', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', password: 'wrongPassword' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const user = { id: 1, password: 'hashedPassword' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compareSync.mockReturnValue(false);

      await signin(mockRequest, mockResponse);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should handle errors during sign-in', async () => {
      const mockRequest = {
        body: { email: 'test@example.com', password: 'password123' }
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const mockError = new Error('Sign-in failed');
      User.findOne.mockRejectedValue(mockError);

      await signin(mockRequest, mockResponse);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Sign-in failed' });
    });
  });

  describe('signout', () => {
    it('should return a signout message', async () => {
      const mockRequest = {};
      const mockResponse = {
        json: jest.fn()
      };

      await signout(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Successfully signed out' });
    });
  });

  afterAll(async () => {
    const { sequelize } = require('../models');
    await sequelize.close(); // Ensure Sequelize connections are closed
  });
});
