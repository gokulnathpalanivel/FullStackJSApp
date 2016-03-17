var express = require('express'),
    mongoose = require('mongoose');
var router = express.Router();

mongoose.connect('mongodb://localhost/todo_development');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

function validatePresenceOf(value) {
    console.log("It is validating");
    return value && value.length;
}

var Task = new Schema({
    task : { type: String, validate: [validatePresenceOf, 'a task is required'] }
});

var Task = mongoose.model('Task', Task);


/* GET EXPRESS WELCOME page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/tasks', function(req, res){
   Task.find({}, function (err, docs) {
     res.render('tasks/index', {
       title: 'Todos index view',
       docs: docs
     }); 
   });
});

/* GET new task creation page. */
router.get('/tasks/new', function(req, res){
     res.render('tasks/new.jade', {
       title: 'New Task'
     });
});

/* Submit new task entry. */
router.post('/tasks', function(req, res){
    console.log('Request body is: '+req.body);
    var task = new Task(req.body);
    task.save(function (err) {
        if (!err) {
            //req.flash('info', 'Task created');
            //req.flash('success', 'This is a flash message using the express-flash module.');
            res.redirect('/tasks');
        }
        else {
            //req.flash('warning', err);
            res.redirect('/tasks/new');
        }
    }); 
});

/* GET edit task page. */
router.get('/tasks/:id/edit', function(req, res){
     Task.findById(req.params.id, function (err, doc){
         res.render('tasks/edit', {
           title: 'Edit Task View',
           task: doc
         }); 
     });
});

/* Submit task edit change. */
router.post('/tasks/:id', function(req, res){
   Task.findById(req.params.id, function (err, doc){
     doc.task = req.body.task;
     doc.save(function(err) {
        if (!err){
             res.redirect('/tasks');
        } 
        else {
            //error handling
        }
     }); 
   });
});

/* Delete task. */
router.post('/tasks/:id/delete', function(req, res){
   console.log("Entered delete"); 
   Task.findById(req.params.id, function (err, doc){       
     if (!doc) return next(new NotFound('Document not found'));       
     console.log("The doc is:"+doc);   
     doc.remove(function() {
       res.redirect('/tasks');
     });
   }); 
});

module.exports = router;
