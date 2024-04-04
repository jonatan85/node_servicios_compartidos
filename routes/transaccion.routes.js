const express = require('express');
const Transaccion = require('../models/Transaccion');

const transaccionRoutes = express.Router();

transaccionRoutes.get('/',  async (req, res, next) => {
  try{
     const trasaccion = await Transaccion.find()
     return res.status(200).json(trasaccion);
  }catch(err) {
     next(err);
  }
});

transaccionRoutes.get('/:id',  async (req, res, next) => {
  const id = req.params.id;
  try {
      const trasaccion = await Transaccion.findById(id);
      if (trasaccion) {
          return res.status(200).json(trasaccion);
      } else {
          next(createError('No existe un trasaccion con el id indicado', 404));
      }
  } catch (err) {
      // Next nos permite pasar al siguiente paso dentro del flujo de nuestro servidor
      next(err);
  }
});

transaccionRoutes.post('/', async (req, res, next) => {
  try {
 
     const newGroupTransaccion = new Transaccion({...req.body });
     const createTransaccion = await newGroupTransaccion.save();
     
     return res.status(201).json(createTransaccion);
  } catch(err) {
     next(err);
  }
});

transaccionRoutes.put('/update/:id', async (req, res, next) => {
  try {
     const id = req.params.id;
     const modifiedTrasaccion = new Transaccion({...req.body});
     //Para que no genere un id aleatorio y lo deje como fijo.
     modifiedTrasaccion.id = id;
     // Para actualizar, Pero no me cambia los datos de la movie.
     const transaccionUpdate = await Transaccion.findByIdAndUpdate(
        id,
        modifiedTrasaccion,
        //Añado new = true para que me traiga la movie con los cambios realizados.
        {new: true}
     );
     // Por ultimo el estatus json + paramatro
     return res.status(200).json(transaccionUpdate);
  }catch (err) {
     next(err);
  }
});

transaccionRoutes.delete('/:id', async (req, res, next) => {
  try{  
     const id = req.params.id;
     await Transaccion.findByIdAndDelete(id);
     return res.status(200).json('El trasaccion se a eliminado correctamente.')
  } catch(err) {
     next(err);
  }
});

// transaccionRoutes.put('/add-put', async (req, res, next) => {
//    try {
//       const { groupMemberId, userId, groupId, imgId } = req.body;
//       // if (!groupMemberId) {
//       //    return next(createError('Se necesita un id de user para poder añadir al group member', 500));
//       // }
//       // if (!groupId) {
//       //    return next(createError('Se necesita un id de group para añadirlo', 500));
//       // }
//       // if (!userId) {
//       //    return next(createError('Se necesita un id de group para añadirlo', 500));
//       // }

//       const addGroupMember = await Transaccion.findByIdAndUpdate(
//          groupMemberId,
//          {$addToSet: {userId: userId, groupId: groupId}},
//          {new: true }
//      );
//      return res.status(200).json(addGroupMember);
//    } catch (err) {
//       next(err);
//    }
// });

 module.exports = transaccionRoutes;