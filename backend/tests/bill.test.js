const { addBill, getBills, editBill, deleteBill } = require('../controllers/bills');
const { Bill } = require('../models');
jest.useFakeTimers();

jest.mock('../models', () => ({
  Bill: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));

describe('BillController', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('addBill', () => {
    it('should create a new bill', async () => {
      mockRequest = {
        body: { title: 'Rent', amount: 1200, currency: 'USD', toWhom: 'Landlord', dueDate: '2024-09-01' },
        user: { id: 1 }
      };
      const newBill = { id: 1, ...mockRequest.body, userId: 1 };
      Bill.create.mockResolvedValue(newBill);

      await addBill(mockRequest, mockResponse);

      expect(Bill.create).toHaveBeenCalledWith({ ...mockRequest.body, userId: 1 });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ bill: newBill });
    });

    it('should handle errors during bill creation', async () => {
      mockRequest = {
        body: { title: 'Rent', amount: 1200, currency: 'USD', toWhom: 'Landlord', dueDate: '2024-09-01' },
        user: { id: 1 }
      };
      const mockError = new Error('Bill creation failed');
      Bill.create.mockRejectedValue(mockError);

      await addBill(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Bill creation failed' });
    });
  });

  describe('getBills', () => {
    it('should retrieve all bills for the user', async () => {
      mockRequest = { user: { id: 1 } };
      const bills = [{ id: 1, title: 'Rent' }, { id: 2, title: 'Utilities' }];
      Bill.findAll.mockResolvedValue(bills);

      await getBills(mockRequest, mockResponse);

      expect(Bill.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(mockResponse.json).toHaveBeenCalledWith({ bills });
    });
  });


describe('error in  bills  ', () => {
    it('should handle errors during bill retrieval', async () => {
      mockRequest = { user: { id: 1 } };
      const mockError = new Error('Failed to retrieve bills');
      Bill.findAll.mockRejectedValue(mockError);

      await getBills(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to retrieve bills' });
    });
  });
  

  afterAll(async () => {
    // Any additional cleanup if needed
  });
});
