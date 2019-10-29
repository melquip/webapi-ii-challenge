const express = require('express');
const db = require('../data/db');

const router = express.Router();

// Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
  const post = req.body;
});

// Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
  const post = req.body;
});

// Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
  db.find().then(data => {
    if (!data) {
      res.status(404).json().end();
    } else {
      res.status(200).json(data);
    }
  }).catch(err => {
    res.status(500).json().end();
  });
});

// Returns the post object with the specified id.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(data => {
    if (!data) {
      res.status(404).json().end();
    } else {
      res.status(200).json(data);
    }
  }).catch(err => {
    res.status(500).json().end();
  });
});

// Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(data => {
    if (!data) {
      res.status(404).json().end();
    } else {
      res.status(200).json(data.comments);
    }
  }).catch(err => {
    res.status(500).json().end();
  });
});

// Removes the post with the specified id and returns the deleted post object. 
// You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(data => {
    if (!data) {
      res.status(404).json().end();
    } else {
      res.status(200).json(data.comments);
    }
  }).catch(err => {
    res.status(500).json().end();
  });
});

// Updates the post with the specified id using data from the request body. 
// Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(data => {
    if (!data) {
      res.status(404).json().end();
    } else {
      res.status(200).json(data.comments);
    }
  }).catch(err => {
    res.status(500).json().end();
  });
});