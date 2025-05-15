// controllers/bookController.js - Versão corrigida
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { readData, writeData } = require('../utils/fileHandler');

// GET /books - Retorna todos os livros
router.get('/', async (req, res) => {
  try {
    const books = await readData();
    res.json(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).json({ message: 'Erro ao buscar livros', error: error.message });
  }
});

// GET /books/:id - Retorna um livro pelo ID
router.get('/:id', async (req, res) => {
  try {
    const books = await readData();
    const book = books.find(book => book.id === req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Erro ao buscar livro por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar livro', error: error.message });
  }
});

// POST /books - Adiciona um novo livro
router.post('/', async (req, res) => {
  try {
    const { title, author, publisher, year, isbn, genre, description } = req.body;
    
    // Validação básica
    if (!title || !author) {
      return res.status(400).json({ message: 'Título e autor são obrigatórios' });
    }
    
    // Converter year para número se for uma string
    const yearValue = year ? parseInt(year, 10) : null;
    
    const newBook = new Book(
      title, 
      author, 
      publisher || '', 
      yearValue, 
      isbn || '', 
      genre || '', 
      description || ''
    );
    
    let books = [];
    try {
      books = await readData();
    } catch (error) {
      console.error('Erro ao ler dados existentes:', error);
      books = [];
    }
    
    books.push(newBook);
    
    await writeData(books);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    res.status(500).json({ message: 'Erro ao adicionar livro', error: error.message });
  }
});

// PUT /books/:id - Atualiza um livro existente
router.put('/:id', async (req, res) => {
  try {
    const { title, author, publisher, year, isbn, genre, description } = req.body;
    let books = await readData();
    const index = books.findIndex(book => book.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    // Converter year para número se for uma string
    const yearValue = year ? parseInt(year, 10) : null;
    
    // Preservar o ID e as datas originais
    const bookId = books[index].id;
    const createdAt = books[index].createdAt;
    
    // Criar o objeto atualizado diretamente
    books[index] = {
      id: bookId,
      title: title || books[index].title,
      author: author || books[index].author,
      publisher: publisher || '',
      year: yearValue,
      isbn: isbn || '',
      genre: genre || '',
      description: description || '',
      createdAt: createdAt,
      updatedAt: new Date().toISOString()
    };
    
    await writeData(books);
    res.json(books[index]);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ message: 'Erro ao atualizar livro', error: error.message });
  }
});

// DELETE /books/:id - Deleta um livro
router.delete('/:id', async (req, res) => {
  try {
    const books = await readData();
    const index = books.findIndex(book => book.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }
    
    const removedBook = books.splice(index, 1)[0];
    await writeData(books);
    
    res.json({ message: 'Livro removido com sucesso', book: removedBook });
  } catch (error) {
    console.error('Erro ao remover livro:', error);
    res.status(500).json({ message: 'Erro ao remover livro', error: error.message });
  }
});

module.exports = router;