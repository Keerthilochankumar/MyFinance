const { addSaving, getSavings, editSaving, deleteSaving } = require('../controllers/savings');
const { Saving } = require('../models');

jest.mock('../models', () => ({
  Saving: {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
}));

describe('SavingController', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('addSaving', () => {
    it('should create a new saving', async () => {
      mockRequest = {
        body: { amount: 500, currency: 'USD', desc: 'Emergency Fund', date: '2024-08-15' },
        user: { id: 1 }
      };
      const newSaving = { id: 1, ...mockRequest.body, userId: 1 };
      Saving.create.mockResolvedValue(newSaving);

      await addSaving(mockRequest, mockResponse);

      expect(Saving.create).toHaveBeenCalledWith({ ...mockRequest.body, userId: 1 });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ saving: newSaving });
    });

    it('should handle errors during saving creation', async () => {
      mockRequest = {
        body: { amount: 500, currency: 'USD', desc: 'Emergency Fund', date: '2024-08-15' },
        user: { id: 1 }
      };
      const mockError = new Error('Saving creation failed');
      Saving.create.mockRejectedValue(mockError);

      await addSaving(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Saving creation failed' });
    });
  });

  describe('getSavings', () => {
    it('should retrieve all savings for the user', async () => {
      mockRequest = { user: { id: 1 } };
      const savings = [{ id: 1, desc: 'Emergency Fund' }, { id: 2, desc: 'Vacation Fund' }];
      Saving.findAll.mockResolvedValue(savings);

      await getSavings(mockRequest, mockResponse);

      expect(Saving.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(mockResponse.json).toHaveBeenCalledWith({ savings });
    });

    it('should handle errors during savings retrieval', async () => {
      mockRequest = { user: { id: 1 } };
      const mockError = new Error('Failed to retrieve savings');
      Saving.findAll.mockRejectedValue(mockError);

      await getSavings(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to retrieve savings' });
    });
  });

    it('should return 404 if the saving is not found', async () => {
      mockRequest = {
        params: { id: 1 },
        body: { amount: 600, currency: 'USD', desc: 'Updated Emergency Fund', date: '2024-08-20' },
        user: { id: 1 }
      };
      Saving.findOne.mockResolvedValue(null);

      await editSaving(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Saving not found' });
    });


  afterAll(async () => {
    // Any additional cleanup if needed
  });
});
