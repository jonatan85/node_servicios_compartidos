const express = require('express');
const Gasto = require('../models/Gasto.js');

const gastoRoutes = express.Router();

gastoRoutes.get('/',  async (req, res, next) => {
  try{
     const gasto = await Gasto.find()
     return res.status(200).json(gasto);
  }catch(err) {
     next(err);
  }
});

gastoRoutes.get('/:id',  async (req, res, next) => {
  const id = req.params.id;
  try {
      const gasto = await Gasto.findById(id);
      if (gasto) {
          return res.status(200).json(gasto);
      } else {
          next(createError('No existe un gasto con el id indicado', 404));
      }
  } catch (err) {
      // Next nos permite pasar al siguiente paso dentro del flujo de nuestro servidor
      next(err);
  }
});

gastoRoutes.post('/', async (req, res, next) => {
  try {
 
     const newGasto = new Gasto({...req.body });
     const createGasto = await newGasto.save();
     
     return res.status(201).json(createGasto);
  } catch(err) {
     next(err);
  }
});

gastoRoutes.put('/update/:id', async (req, res, next) => {
  try {
     const id = req.params.id;
     const modifiedGasto = new Gasto({...req.body});
     //Para que no genere un id aleatorio y lo deje como fijo.
     modifiedGasto.id = id;
     // Para actualizar, Pero no me cambia los datos de la movie.
     const gastoUpdate = await Gasto.findByIdAndUpdate(
        id,
        modifiedGasto,
        //Añado new = true para que me traiga la movie con los cambios realizados.
        {new: true}
     );
     // Por ultimo el estatus json + paramatro
     return res.status(200).json(gastoUpdate);
  }catch (err) {
     next(err);
  }
});

gastoRoutes.delete('/:id', async (req, res, next) => {
  try{  
     const id = req.params.id;
     await Gasto.findByIdAndDelete(id);
     return res.status(200).json('El gasto se a eliminado correctamente.')
  } catch(err) {
     next(err);
  }
});

gastoRoutes.put('/add-put', async (req, res, next) => {
   try {
      const { gastoId, userId, groupId } = req.body;
      if (!gastoId) {
         return next(createError('Se necesita un id de user para poder añadir el gasto', 500));
      }
      if (!groupId) {
         return next(createError('Se necesita un id de group para añadirlo', 500));
      }
      if (!userId) {
         return next(createError('Se necesita un id de group para añadirlo', 500));
      }

      const addGasto = await Gasto.findByIdAndUpdate(
         gastoId,
         {$addToSet: {userId: userId, groupId: groupId}},
         {new: true }
     );
     return res.status(200).json(addGasto);
   } catch (err) {
      next(err);
   }
});

 module.exports = gastoRoutes;