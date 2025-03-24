import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigClient } from '../clients/config.client';

/**
 * RedisClient is a service responsible for managing a Redis connection
 * using the `ioredis` library. It provides a centralized client for Redis operations.
 */
@Injectable()
export class RedisClient {
  /**
   * Internal Redis client instance.
   */
  private readonly client: Redis;

  /**
   * Initializes the Redis client with the configuration provided by ConfigClient.
   *
   * @param configClient - A service providing Redis connection configuration.
   */
  constructor(private readonly configClient: ConfigClient) {
    this.client = new Redis({
      host: this.configClient.getRedisHost(), // Redis server host
      port: this.configClient.getRedisPort(), // Redis server port
      password: this.configClient.getRedisPassword(), // Redis server password
    });
  }

  /**
   * Getter to expose the Redis client for executing commands.
   *
   * @returns The Redis client instance.
   */
  get execute() {
    return this.client;
  }
}
