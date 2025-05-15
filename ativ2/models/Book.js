// models/Book.js
const { v4: uuidv4 } = require('uuid');

class Book {
  constructor(title, author, publisher, year, isbn, genre, description) {
    this.id = uuidv4();
    this.title = title;
    this.author = author;
    this.publisher = publisher;
    this.year = year;
    this.isbn = isbn;
    this.genre = genre;
    this.description = description;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update(data) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Book;