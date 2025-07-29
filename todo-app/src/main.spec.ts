import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

jest.mock('@nestjs/core');

describe('bootstrap', () => {
  let app: INestApplication;

  beforeEach(() => {
    jest.resetModules();

    app = {
      listen: jest.fn().mockResolvedValue(undefined),
    } as any;
    (NestFactory.create as jest.Mock).mockResolvedValue(app);
  });

  it('should create a Nest application and listen on the default port', async () => {
    delete process.env.PORT;
    await import('./main');
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(app.listen).toHaveBeenCalledWith(3000);
  });

  it('should listen on the configured port', async () => {
    process.env.PORT = '3001';
    await import('./main');
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(app.listen).toHaveBeenCalledWith('3001');
  });
});
