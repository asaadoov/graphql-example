const { 
  GraphQLObjectType: Type, 
  GraphQLString: String, 
  GraphQLSchema: Schema, 
  GraphQLID: ID,
  GraphQLInt: Int,
  GraphQLList: List,
  GraphQLNonNull: nonNull
} = require('graphql');

const _ = require("lodash");
const Book = require('../models/book');
const Author = require('../models/author');



// GraphQL Types
const BookType = new Type({
  name: "Book",
  fields: () => ({
    id: { type: String},
    name: { type: String},
    genre: { type: String},
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, {id: parent.authorId});
        return Author.findById(parent.authorId);
      }
    }
  }) 
});

const AuthorType = new Type({
  name: "Author",
  fields: () => ({
    id: { type: String},
    name: { type: String},
    age: { type: Int},
    books: {
      type: new List(BookType),
      resolve(parent, args) {
        // return _.filter(books, {authorId: parent.id});
        return Book.find({authorId: parent.id});
      }
    }
  }) 
});

// GraphQL Queries (get data)
const RootQuery = new Type({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: ID }
      },
      resolve(parent, args) {
        //this get the data from DB
        // return _.find(books, {id: args.id});
        return Book.findById(args.id);
      }
    },
    
    books: {
      type: new List(BookType),
      resolve(parent, args) {
        //this get the data from DB
        // return books;
        return Book.find({});
      }
    },
    
    author: {
      type: AuthorType,
      args: {
        id: { type: ID }
      },
      resolve: (parent, args) => {
        //this get the data from DB
        // return _.find(authors, {id: args.id});
        return Author.findById(args.id);
      }
    },
    
    authors: {
      type: new List(AuthorType),
      resolve(parent, args) {
        //this get the data from DB
        // return authors;
        return Author.find({});
      }
    },
  }
});

// Mutation (Add, Updated and Delete data)
const Mutation = new Type({
  name: "Mutation",
  fields: {
    // add Author to DB
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new nonNull( String )},
        age: { type: new nonNull( Int )},
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },

    // add Book to DB
    addBook: {
      type: BookType,
      args: {
        name: { type: new nonNull( String )},
        genre: { type: new nonNull( String )},
        authorId: { type: new nonNull( ID )},
      },
      resolve(parent, args){
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return book.save();
      }
    }
  }
});

module.exports = new Schema({
  query: RootQuery,
  mutation: Mutation
});

