import { Inject, Module, OnModuleDestroy } from "@nestjs/common";
import { RedisService } from "./redis.service";
import Redis from 'ioredis'
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASS')
        })

        client.on('error', err => {
          console.error('Redis connection error: ', err)
        })

        return client
      }
    },
    RedisService
  ],
  exports: ['REDIS_CLIENT', RedisService]
})
export class RedisModule implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis
  ) {}
  async onModuleDestroy() {
    await this.redisClient.quit() // 当模块销毁时端开连接
  }
}