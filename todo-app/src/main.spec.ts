import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

// Mock the core NestJS functions
jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn()
  }
}));

// Don't actually call bootstrap() when importing main.ts
jest.mock('./main', () => ({
  bootstrap: jest.fn()
}), { virtual: true });

describe('bootstrap', () => {
  // Store the original implementation
  const originalModule = jest.requireActual('./main');
  let mockApp: Partial<INestApplication>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    jest.resetModules();
    
    // Set up our mock app
    mockApp = {
      listen: jest.fn().mockResolvedValue(undefined)
    };
    
    // Return the mock app when NestFactory.create is called
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  it('should create a Nest application and listen on the default port', async () => {
    // Import real bootstrap function
    const { bootstrap } = originalModule;
    
    // Clear PORT env var
    delete process.env.PORT;
    
    // Call bootstrap directly
    await bootstrap();
    
    // Check that NestFactory.create was called with the right module
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    
    // Check that app.listen was called with the right port
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });

  it('should listen on the configured port', async () => {
    // Import real bootstrap function
    const { bootstrap } = originalModule;
    
    // Set PORT env var
    process.env.PORT = '3001';
    
    // Call bootstrap directly
    await bootstrap();
    
    // Check that NestFactory.create was called with the right module
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    
    // Check that app.listen was called with the right port
    expect(mockApp.listen).toHaveBeenCalledWith('3001');
    
    // Clean up
    delete process.env.PORT;
  });
});
