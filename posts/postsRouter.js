const express = require('express');
const db = require('../data/db');

const router = express.Router();

// Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." }).end();
  }
  db.insert({ title, contents }).then(data => {
    db.findById(data.id).then(data => {
      res.status(201).json(data);
    }).catch(err => {
      res.status(500).json({ errorMessage: "Could not get newly created post." }).end();
    });
  }).catch(err => {
    res.status(500).json({ error: "There was an error while saving the post to the database" }).end();
  });
});

// Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." }).end();
  }
  // find user
  db.findById(id).then(data => {
    if (!data) {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
      // add comment
      db.insertComment({ text }).then(comment => {
        // get comment data
        db.findCommentById(comment.id).then(newComment => {
          res.status(201).json(newComment);
        }).catch(err => {
          res.status(500).json({ errorMessage: "Could not get newly created comment." }).end();
        });
      }).catch(err => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" }).end();
      });
    }
  }).catch(err => {
    res.status(500).json({ errorMessage: "Could not find user by id." }).end();
  });
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

module.exports = router;