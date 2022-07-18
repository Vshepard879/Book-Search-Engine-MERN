const { gql } = require('apollo-server-express');

// typeDefs is a string that contains all of the GraphQL schema
const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
}
type Query {
  me: User
}
type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  saveBook(newBook: BookInput!): User
  removeBook(bookId: ID!): User
}
  type Auth {
    token: ID!
    user: User
  }
  type Book {
    bookId: ID!
    authors: [String]
    title: String
     description: String
    image: String
    link: String
  }
  input BookInput {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;