import { SessionRepository } from 'src/core';

import { db, type TransactionClient } from '../db';

interface CreateSessionRepositoryImpl {
  (props: { db: TransactionClient }): SessionRepository.t;
}

export const createSessionRepositoryImpl: CreateSessionRepositoryImpl = ({
  db,
}) => {
  return {
    async find(id) {},
    async findBy(options) {},
    async findAll() {},
    async findAllBy(options) {},
    async count() {},
    async countBy(options) {},
  };
};
