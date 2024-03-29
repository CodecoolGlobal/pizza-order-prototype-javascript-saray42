const { readFile, writeFile } = require("fs/promises");

const fileWriterAsync = async (filePath, content) => {
  try {
    return await writeFile(filePath, content, { flag: "w" });
  } catch (error) {
    console.error(`File reading error: ${error.message}`);
  }
};

const fileReaderAsync = async (filePath) => {
  try {
    return await readFile(filePath, {encoding: "utf8"});
  } catch (error) {
    console.error(`File reading error: ${error.message}`);
  }
};

module.exports = {
  fileReaderAsync,
  fileWriterAsync,
};
