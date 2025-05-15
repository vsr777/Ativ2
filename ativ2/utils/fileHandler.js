// utils/fileHandler.js
const fs = require('fs').promises;
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'books.json');

// Garantir que o diretório existe
const ensureDirectoryExists = async () => {
  const dir = path.dirname(dataFilePath);
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Ler dados do arquivo
const readData = async () => {
  try {
    await ensureDirectoryExists();
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Se o arquivo não existir ou estiver vazio, retorna um array vazio
      if (error.code === 'ENOENT' || error instanceof SyntaxError) {
        await writeData([]);
        return [];
      }
      console.error('Erro ao ler arquivo:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erro ao verificar diretório:', error);
    // Em caso de erro, retorna um array vazio como fallback
    return [];
  }
};

// Escrever dados no arquivo
const writeData = async (data) => {
  try {
    await ensureDirectoryExists();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao escrever no arquivo:', error);
    throw error;
  }
};

module.exports = {
  readData,
  writeData
};