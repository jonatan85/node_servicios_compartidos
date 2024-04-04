const express = require('express');
const Usuario = require('../models/Usuario.js');

const usuarioRoutes = express.Router();

usuarioRoutes.get('/',  async (req, res, next) => {
  try{
     const usuario = await Usuario.find()
     return res.status(200).json(usuario);
  }catch(err) {
     next(err);
  }
});

usuarioRoutes.get('/:id',  async (req, res, next) => {
  const id = req.params.id;
  try {
      const usuario = await Usuario.findById(id);
      if (usuario) {
          return res.status(200).json(usuario);
      } else {
          next(createError('No existe un usuario con el id indicado', 404));
      }
  } catch (err) {
      // Next nos permite pasar al siguiente paso dentro del flujo de nuestro servidor
      next(err);
  }
});

usuarioRoutes.post('/', async (req, res, next) => {
  try {
 
     const newUsuario = new Usuario({...req.body });
     const createUsuario = await newUsuario.save();
     
     return res.status(201).json(createUsuario);
  } catch(err) {
     next(err);
  }
});

usuarioRoutes.put('/update/:id', async (req, res, next) => {
  try {
     const id = req.params.id;
     const modifiedUsuario = new Usuario({...req.body});
     //Para que no genere un id aleatorio y lo deje como fijo.
     modifiedUsuario.id = id;
     // Para actualizar, Pero no me cambia los datos de la movie.
     const usuarioUpdate = await Usuario.findByIdAndUpdate(
        id,
        modifiedUsuario,
        //Añado new = true para que me traiga la movie con los cambios realizados.
        {new: true}
     );
     // Por ultimo el estatus json + paramatro
     return res.status(200).json(usuarioUpdate);
  }catch (err) {
     next(err);
  }
});

usuarioRoutes.delete('/:id', async (req, res, next) => {
  try{  
     const id = req.params.id;
     await Usuario.findByIdAndDelete(id);
     return res.status(200).json('El usuario se a eliminado correctamente.')
  } catch(err) {
     next(err);
  }
});

// usuarioRoutes.put('/add-put', async (req, res, next) => {
//    try {
//       const { gastoId, userId, groupId } = req.body;
//       if (!gastoId) {
//          return next(createError('Se necesita un id de user para poder añadir el usuario', 500));
//       }
//       if (!groupId) {
//          return next(createError('Se necesita un id de group para añadirlo', 500));
//       }
//       if (!userId) {
//          return next(createError('Se necesita un id de group para añadirlo', 500));
//       }

//       const addGasto = await Usuario.findByIdAndUpdate(
//          gastoId,
//          {$addToSet: {userId: userId, groupId: groupId}},
//          {new: true }
//      );
//      return res.status(200).json(addGasto);
//    } catch (err) {
//       next(err);
//    }
// });

 module.exports = usuarioRoutes;