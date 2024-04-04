const express = require('express');
const GastoDeParticipantes = require('../models/GastoDeParticipante.js');


const gastoDeParticipantesRoutes = express.Router();

gastoDeParticipantesRoutes.get('/',  async (req, res, next) => {
  try{
     const gastoDeParticipantes = await GastoDeParticipantes.find()
     return res.status(200).json(gastoDeParticipantes);
  }catch(err) {
     next(err);
  }
});

gastoDeParticipantesRoutes.get('/:id',  async (req, res, next) => {
  const id = req.params.id;
  try {
      const gastoDeParticipantes = await GastoDeParticipantes.findById(id);
      if (gastoDeParticipantes) {
          return res.status(200).json(gastoDeParticipantes);
      } else {
          next(createError('No existe un grupo de participantes con el id indicado', 404));
      }
  } catch (err) {
      // Next nos permite pasar al siguiente paso dentro del flujo de nuestro servidor
      next(err);
  }
});

gastoDeParticipantesRoutes.post('/', async (req, res, next) => {
  try {
 
     const newGastoDeParticipantes = new GastoDeParticipantes({...req.body });
     const createGastoDeParticipantes = await newGastoDeParticipantes.save();
     
     return res.status(201).json(createGastoDeParticipantes);
  } catch(err) {
     next(err);
  }
});

gastoDeParticipantesRoutes.put('/update/:id', async (req, res, next) => {
  try {
     const id = req.params.id;
     const modifiedGastoDeParticipantes = new GastoDeParticipantes({...req.body});
     //Para que no genere un id aleatorio y lo deje como fijo.
     modifiedGastoDeParticipantes.id = id;
     // Para actualizar, Pero no me cambia los datos de la movie.
     const gastoDeParticipantesUpdate = await GastoDeParticipantes.findByIdAndUpdate(
        id,
        modifiedGastoDeParticipantes,
        //Añado new = true para que me traiga la movie con los cambios realizados.
        {new: true}
     );
     // Por ultimo el estatus json + paramatro
     return res.status(200).json(gastoDeParticipantesUpdate);
  }catch (err) {
     next(err);
  }
});

gastoDeParticipantesRoutes.delete('/:id', async (req, res, next) => {
  try{  
     const id = req.params.id;
     await GastoDeParticipantes.findByIdAndDelete(id);
     return res.status(200).json('El grupo de participantes se a eliminado correctamente.')
  } catch(err) {
     next(err);
  }
});

gastoDeParticipantesRoutes.put('/add-put', async (req, res, next) => {
   try {
      const { gastoDeParticipantesId, userId, gastoId } = req.body;
      if (!gastoDeParticipantesId) {
         return next(createError('Se necesita un id de gastoDeParticipantes para poder añadir el gasto', 500));
      }
      if (!userId) {
         return next(createError('Se necesita un id de userId para añadirlo', 500));
      }
      if (!gastoId) {
         return next(createError('Se necesita un id de gastoId para añadirlo', 500));
      }

      const addGastoDeParticipantes = await GastoDeParticipantes.findByIdAndUpdate(
         gastoDeParticipantesId,
         {$addToSet: {userId: userId, expenseId: gastoId}},
         {new: true }
     );
     return res.status(200).json(addGastoDeParticipantes);
   } catch (err) {
      next(err);
   }
});

 module.exports = gastoDeParticipantesRoutes;