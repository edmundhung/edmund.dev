import type { LoaderFunction, Params } from 'remix';
import type { Query } from '@workaholic/core';

export type { Entry, Metadata } from '@workaholic/core';

export interface Context {
  query: Query;
}

export type FirstParameter<T> = Parameters<T>[0];

export interface LoaderArguments<Context, Key extends string = string>
  extends FirstParameter<LoaderFunction> {
  context: Context;
  params: Params<Key>;
}

export interface WithContext<
  T extends LoaderFunction,
  Context extends any,
  Key = string,
> {
  (args: LoaderArguments<Context, Key>): ReturnType<T>;
}
