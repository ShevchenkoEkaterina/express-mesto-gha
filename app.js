const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
// const cardsRouter = require('./routes/cards.js');
// const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// app.use((req, res, next) => {
//   req.user = {
//     _id: '5d8b8592978f8bd833ca8133' // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

 //  next();
// });
// app.use(bodyParser.json());
app.use('/', usersRouter);
// app.use('/', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})