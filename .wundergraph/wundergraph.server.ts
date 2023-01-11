import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { configureWunderGraphServer } from '@wundergraph/sdk/server';
import type { HooksConfig } from './generated/wundergraph.hooks';
import type { InternalClient } from './generated/wundergraph.internal.client';

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
	hooks: {
		queries: {
			First: {
				customResolve: async (hook) => {
					console.log('CUSTOM RESOLVE - FIRST')
					return hook.internalClient.queries.Second()
				}
			},
			Second: {
				customResolve: async () => {
					console.log('CUSTOM RESOLVE - SECOND')
					return {
						data: {
							countries_continents: [
								{
									code: '123',
									name: 'abc'
								}
							]
						}
					}
				}
			}
		},
		mutations: {},
	},
	graphqlServers: [
		{
			serverName: 'gql',
			apiNamespace: 'gql',
			schema: new GraphQLSchema({
				query: new GraphQLObjectType({
					name: 'RootQueryType',
					fields: {
						hello: {
							type: GraphQLString,
							resolve() {
								return 'world';
							},
						},
					},
				}),
			}),
		},
	],
}));
