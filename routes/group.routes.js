const express = require('express');
const Group = require('../models/Group.js');


const groupRoutes = express.Router();

groupRoutes.get('/',  async (req, res, next) => {
  try{
     const grup = await Group.find()
     return res.status(200).json(grup);
  }catch(err) {
     next(err);
  }
});

groupRoutes.get('/:id',  async (req, res, next) => {
  const id = req.params.id;
  try {
      const grup = await Group.findById(id);
      if (grup) {
          return res.status(200).json(grup);
      } else {
          next(createError('No existe un grupo con el id indicado', 404));
      }
  } catch (err) {
      // Next nos permite pasar al siguiente paso dentro del flujo de nuestro servidor
      next(err);
  }
});

groupRoutes.post('/', async (req, res, next) => {
  try {
 
     const newGroup = new Group({...req.body });
     const createGroup = await newGroup.save();
     
     return res.status(201).json(createGroup);
  } catch(err) {
     next(err);
  }
});

groupRoutes.put('/:id', async (req, res, next) => {
  try {
     const id = req.params.id;
     const modifiedGroup = new Group({...req.body});
     //Para que no genere un id aleatorio y lo deje como fijo.
     modifiedGroup.id = id;
     // Para actualizar, Pero no me cambia los datos de la movie.
     const groupUpdate = await Group.findByIdAndUpdate(
        id,
        modifiedGroup,
        //Añado new = true para que me traiga la movie con los cambios realizados.
        {new: true}
     );
     // Por ultimo el estatus json + paramatro
     return res.status(200).json(groupUpdate);
  }catch (err) {
     next(err);
  }
});

groupRoutes.delete('/:id', async (req, res, next) => {
  try{  
     const id = req.params.id;
     await Group.findByIdAndDelete(id);
     return res.status(200).json('El grupo se a eliminado correctamente.')
  } catch(err) {
     next(err);
  }
});

 module.exports = groupRoutes;