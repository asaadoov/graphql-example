const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
// allow cross-origin requests
app.use(cors());

const uri = "mongodb+srv://root:ASad*1996@booky-i242w.mongodb.net/test?retryWrites=true&w=majority";
//Set up default mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () =>{
  console.log('connected to mongoDB');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(5000, ()=>{
  console.log("server is running on port 5000");
});
