// modules to import 
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  //  in GQL a query is used to read or fetch values 'GET' 
  Query: {
    // me is a function that finds a logged in user
    me: async (parent, args, context) => { 
      //  if there is a user in the context, return it
      if (context.user) {
        //  userData finds one user by their id (if they are logged in) 
        const userData = await User.findOne({ _id: context.user._id })
        //  we are selecting userData we do not want to return
          .select('-__v -password');
          return userData;
      }
      // if there is no user in the context, throw an error
      throw new AuthenticationError('You need to be logged in');
    }
  },
   // in GQL a mutation  inserts, updates, or deletes data .  'POST', 'PUT', 'DELETE'
  Mutation: {
    // createUser is a function that creates a user 'POST'
    addUser: async (parent, args) => { // args is destructured req.body
      // variable to store the user and create a new user using the args
      const user = await User.create(args);
      //  variable to store the token and sign a token using the user
      const token = signToken(user);
      // return the token and user
      return { token, user };
    },
    // login is a function that logs in a user 'POST'
    login: async (parent, { email, password }) => { // destructured req.body for email and password
      //  find the user by their email
      const user = await User.findOne({ email });
      //  if there is no user, throw an error
      if (!user) {
        throw new AuthenticationError('No user found with this email');
      }
      //  if the user is found, check if the password is correct
      const correctPw = await user.isCorrectPassword(password);
      //  if the password is incorrect, throw an error
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      //  if the password is correct, sign a token using the user
      const token = signToken(user);
      //  return the token and user
      return { token, user };
      },
      //  saveBook is a function that saves a book to a user 'PUT'
      saveBook: async (parent, { newBook }, context) => { // destructured req.body for newBook. context verifies that the user is logged in

        // if there is no user in the context, throw an error
        if (!context.user) {
          throw new AuthenticationError('You need to be logged in');
        }
        // if there is a user in the context, find the user by their id
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: newBook } },
          { new: true }
        );
        return updatedUser;
      },
      // removeBook is a function that removes a book 'DELETE'
      removeBook: async (parent, { bookId }, context) => { // destructure req.body for bookId. 
        //  if there is no user in context, throw an error
        if (!context.user) {
          throw new AuthenticationError('You need to be logged in');
        }
        // if there is a user in context, find the user by their id and update their savedBooks
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
    }
  };

  module.exports = resolvers;