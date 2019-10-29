const express = require('express');
const db = require('../data/db');

const router = express.Router();

// Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." }).end();
  }
  db.insert({ title, contents }).then(post => {
    db.findById(post.id).then(postData => {
      res.status(201).json(postData);
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
  // find post
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
      // add comment
      db.insertComment({ text, post_id: id }).then(comment => {
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
  db.find().then(postList => {
    if (!postList) {
      res.status(404).json({ error: "The posts information could not be retrieved." }).end();
    } else {
      res.status(200).json(postList);
    }
  }).catch(err => {
    res.status(500).json({ error: "The posts information could not be retrieved." }).end();
  });
});

// Returns the post object with the specified id.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
    } else {
      res.status(200).json(post);
    }
  }).catch(err => {
    res.status(500).json({ error: "The post information could not be retrieved." }).end();
  });
});

// Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
  const { id } = req.params;
  // get post
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
    } else {
      // get comments
      db.findPostComments(id).then(comments => {
        res.status(200).json(comments);
      }).catch(err => {
        res.status(500).json({ error: "The comments information could not be retrieved." }).end();
      });
    }
  }).catch(err => {
    res.status(500).json({ error: "The post information could not be retrieved." }).end();
  });
});

// Removes the post with the specified id and returns the deleted post object. 
// You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
    } else {
      db.remove(id).then(deleted => {
        res.status(204).json({ ...post, deleted: deleted });
      }).catch(err => {
        res.status(500).json({ error: "The post could not be removed" }).end();
      });
    }
  }).catch(err => {
    res.status(500).json({ error: "The post information could not be retrieved." }).end();
  });
});

// Updates the post with the specified id using data from the request body. 
// Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." }).end();
  }
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
    } else {
      db.update(id, { title, contents }).then(updated => {
        res.status(200).json({ ...post, title, contents, updated });
      }).catch(err => {
        res.status(500).json({ error: "The post information could not be modified." }).end();
      });
    }
  }).catch(err => {
    res.status(500).json({ error: "The post information could not be retrieved." }).end();
  });
});

module.exports = router;