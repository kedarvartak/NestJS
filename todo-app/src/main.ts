import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

// Only call bootstrap if this file is run directly (not imported for tests)
if (require.main === module) {
  bootstrap();
}
