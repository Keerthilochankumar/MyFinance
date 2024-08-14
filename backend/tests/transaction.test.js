const { addTransaction, getTransactions, editTransaction, deleteTransaction } = require('../controllers/transactions');
const { Transaction } = require('../models');

jest.mock('../models', () => ({
  Transaction: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));

describe('TransactionController', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('addTransaction', () => {
    it('should create a new transaction', async () => {
      mockRequest = {
        body: { amount: 100, type: 'income', currency: 'USD', category: 'Salary', desc: 'Monthly salary', date: '2024-08-15' },
        user: { id: 1 }
      };
      const newTransaction = { id: 1, ...mockRequest.body, userId: 1 };
      Transaction.create.mockResolvedValue(newTransaction);

      await addTransaction(mockRequest, mockResponse);

      expect(Transaction.create).toHaveBeenCalledWith({ ...mockRequest.body, userId: 1 });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ transaction: newTransaction });
    });

    it('should handle errors during transaction creation', async () => {
      mockRequest = {
        body: { amount: 100, type: 'income', currency: 'USD', category: 'Salary', desc: 'Monthly salary', date: '2024-08-15' },
        user: { id: 1 }
      };
      const mockError = new Error('Transaction creation failed');
      Transaction.create.mockRejectedValue(mockError);

      await addTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Transaction creation failed' });
    });
  });

  describe('getTransactions', () => {
    it('should retrieve all transactions for the user', async () => {
      mockRequest = { user: { id: 1 } };
      const transactions = [{ id: 1, desc: 'Monthly salary' }, { id: 2, desc: 'Grocery shopping' }];
      Transaction.findAll.mockResolvedValue(transactions);

      await getTransactions(mockRequest, mockResponse);

      expect(Transaction.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(mockResponse.json).toHaveBeenCalledWith({ transactions });
    });

    it('should handle errors during transactions retrieval', async () => {
      mockRequest = { user: { id: 1 } };
      const mockError = new Error('Failed to retrieve transactions');
      Transaction.findAll.mockRejectedValue(mockError);

      await getTransactions(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to retrieve transactions' });
    });
  });

  describe('editTransaction', () => {
    it('should return 404 if the transaction is not found', async () => {
      mockRequest = {
        params: { id: 1 },
        body: { amount: 150, type: 'income', currency: 'USD', category: 'Freelance', desc: 'Freelance project', date: '2024-08-20' },
        user: { id: 1 }
      };
      Transaction.findOne.mockResolvedValue(null);

      await editTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Transaction not found' });
    });

  });

  describe('deleteTransaction', () => {
    it('should return 404 if the transaction is not found', async () => {
      mockRequest = {
        params: { id: 1 },
        user: { id: 1 }
      };
      Transaction.findOne.mockResolvedValue(null);

      await deleteTransaction(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Transaction not found' });
    });

  });

  afterAll(async () => {
    // Any additional cleanup if needed
  });
});
