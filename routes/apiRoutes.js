const fs = require('fs');
//using package to give each note a unique id
const generateUniqueId = require('generate-unique-id');
//variable created to shorten code below
let noteData;
noteData = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));

// ROUTING
module.exports = function (app) {
  //returns database on api request
  app.get('/api/notes', function (req, res) {
    res.json(noteData);
  });

  //creates a new note with a unique id
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

  //deletes selected note from database by using the id that is requested
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
