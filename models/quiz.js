// Definicion del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
  	'Quiz',
    { pregunta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Pregunta"}}
      },
      respuesta: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Respuesta"}}
      },//A continuación se añade un campo a la tabla, que contendrá el índice temático, para la realización del ejercicio P2P del módulo 8
      indiceTema: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta índice temático"}}
      }
    }
  );
}
