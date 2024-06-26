import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'root',
      database: 'db_jogatina_galatica',
      entities: [],
      synchronize: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
