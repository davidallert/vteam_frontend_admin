// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const localHostURL = "http://localhost:8585/graphql/auth";

const client = new ApolloClient({
  link: new HttpLink({
    uri: localHostURL,
  }),
  cache: new InMemoryCache(),
});

export default client;
