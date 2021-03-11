const fs = require('fs');
const generateUniqueId = require('generate-unique-id');
let noteData;
noteData = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));

// ROUTING

module.exports = function (app) {
  app.get('/api/notes', function (req, res) {
    res.json(noteData);
  });

  app.post('/api/notes', function (req, res) {
    let newNote = req.body;
    const uniqueId = generateUniqueId({
      length: 2,
      useLetters: false,
    });
    newNote.id = uniqueId;
    noteData.push(newNote);

    fs.writeFileSync('db/db.json', JSON.stringify(noteData), function (error) {
      if (error) {
        throw console.error('write note failed');
      }
    });
    res.json(noteData);
  });

  app.delete('/api/notes/:id', function (req, res) {
    const noteId = req.params.id;
    let newId = 0;
    noteData = noteData.filter((currentNote) => {
      return currentNote.id != noteId;
    });
    for (currentNote of noteData) {
      currentNote.id = newId.toString();
      newId++;
    }
    fs.writeFileSync('db/db.json', JSON.stringify(noteData), function (error) {
      if (error) {
        throw console.error('delete note failed');
      }
    });
    res.json(noteData);
  });
};
