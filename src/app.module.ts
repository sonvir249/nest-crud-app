import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CoreModele } from './core/core.module';

@Module({
  imports: [CoreModele, CatsModule],
})
export class AppModule {}
