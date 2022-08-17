import{ PrismaClient, Prisma } from '@prisma/client';


export const prisma = new PrismaClient();

export async function exists<Model extends {count: any}>  ( model: Model, args: Parameters<Model['count']>[0] ): Promise<boolean> {
  const count = await model.count(args);
  return !!count;
}



type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof typeof Prisma[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function excludeFields<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}

export function includeFields<T extends Entity, K extends Keys<T>>(
  type: T,
  inc: K[],
) {
  type TMap = Record<K, true>;
  const result: TMap = {} as TMap;
  for (const key of inc) {
    result[key as K] = true;
  }
  return result;
}
