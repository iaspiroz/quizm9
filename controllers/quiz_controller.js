var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
   models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes,errors:[]});
  }).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
 res.render('quizes/show', { quiz: req.quiz,errors:[]});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado,errors:[]});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(
    {pregunta: "Pregunta", respuesta: "Respuesta",indiceTema:"Tema"}//Añado el índice para el ejercicio P2P del módulo 8
  );

 //Ejercicio P2P módulo 9. 
 if(req.session.user){
    res.render('quizes/new.ejs', {quiz: quiz, errors: []});
  } else{
    res.render('sessions/new.ejs', {quiz: quiz, errors: []});
  };
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

 quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta","indiceTema"]})//Añadido el indice temático, para el ejercicio P2P del módulo 8
        .then( function(){ res.redirect('/quizes')}) 
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz

  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  //Añadido el indice temático, para el ejercicio P2P del módulo 8
  req.quiz.indiceTema = req.body.quiz.indiceTema;

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta","indiceTema"]})//Añadido el indice temático, para el ejercicio P2P del módulo 8
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};


// GET /quizes/statistics (ampliación opcional módulo 9)
exports.statistics = function (req, res, next) {
	models.Quiz.findAll({
		include: [{ model: models.Comment }]
	}).then(function (quizes) {
		var est = {
			preguntas: quizes.length,
			comentarios: 0,
			cmtsPreg: 0,
			preguntasSinCom: 0,
			preguntasCom: 0
		};
		for (var i = 0; i < quizes.length; i++) {
			var comments = quizes[i].Comments.length;
			est.comentarios += comments;
			if (comments > 0) {
				est.preguntasCom++;
			} else {
				est.preguntasSinCom++;
			}
		}
		est.cmtsPreg = est.comentarios / est.preguntas;
		res.render('quizes/statistics', {est:est, errors:[]});
	}).catch(function (err) {
		next(err);
	});
};
