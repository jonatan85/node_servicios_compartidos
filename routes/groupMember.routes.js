const express = require('express');
const GroupMember = require('../models/GroupMember.js');

const upload = require('../utils/middleware/file.middleware.js');
const uploadToCloudinary = require('../utils/middleware/cloudinary.middleware.js')
const imageToUri = require('image-to-uri');
const fs = require('fs');

const groupMemberRoutes = express.Router();

groupMemberRoutes.get('/',  async (req, res, next) => {
  try{
     const groupMember = await GroupMember.find()
     return res.status(200).json(groupMember);
  }catch(err) {
     next(err);
  }
});

groupMemberRoutes.get('/:id',  async (req, res, next) => {
  const id = req.params.id;
  try {
      const groupMember = await GroupMember.findById(id);
      if (groupMember) {
          return res.status(200).json(groupMember);
      } else {
          next(createError('No existe un groupMember con el id indicado', 404));
      }
  } catch (err) {
      // Next nos permite pasar al siguiente paso dentro del flujo de nuestro servidor
      next(err);
  }
});

groupMemberRoutes.post('/',[upload.single('picture')], async (req, res, next) => {
  try {
     const picture = req.file ? req.file.filename : null;
     const newGroupMember = new GroupMember({...req.body, picture });
     const createGroupMember = await newGroupMember.save();
     
     return res.status(201).json(createGroupMember);
  } catch(err) {
     next(err);
  }
});

groupMemberRoutes.post('/with-uri', [upload.single('picture')], async (req, res, next) => {
  try {
     const filePath = req.file ? req.file.path : null;
     const picture = imageToUri(filePath);
     const newGroupMember = new GroupMember({...req.body, picture });
     const createGroupMember = await newGroupMember.save();
     
     await fs.unlinkSync(filePath);
     return res.status(201).json(createGroupMember);
  } catch(err) {
     next(err);
  }
});

groupMemberRoutes.post('/to-cloud', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
  try {
     const newGroupMember = new GroupMember({ ...req.body, picture: req.file_url })
     const createGroupMember = await newGroupMember.save();

     return res.status(201).json(createGroupMember);
  } catch(err) {
     next(err);
  }
});

groupMemberRoutes.put('/update/:id', async (req, res, next) => {
  try {
     const id = req.params.id;
     const modifiedGroupMember = new GroupMember({...req.body});
     //Para que no genere un id aleatorio y lo deje como fijo.
     modifiedGroupMember.id = id;
     // Para actualizar, Pero no me cambia los datos de la movie.
     const groupMemberUpdate = await GroupMember.findByIdAndUpdate(
        id,
        modifiedGroupMember,
        //Añado new = true para que me traiga la movie con los cambios realizados.
        {new: true}
     );
     // Por ultimo el estatus json + paramatro
     return res.status(200).json(groupMemberUpdate);
  }catch (err) {
     next(err);
  }
});

groupMemberRoutes.delete('/:id', async (req, res, next) => {
  try{  
     const id = req.params.id;
     await GroupMember.findByIdAndDelete(id);
     return res.status(200).json('El groupMember se a eliminado correctamente.')
  } catch(err) {
     next(err);
  }
});

groupMemberRoutes.put('/add-put', async (req, res, next) => {
   try {
      const { groupMemberId, userId, groupId } = req.body;
      if (!groupMemberId) {
         return next(createError('Se necesita un id de user para poder añadir al group member', 500));
      }
      if (!groupId) {
         return next(createError('Se necesita un id de group para añadirlo', 500));
      }
      if (!userId) {
         return next(createError('Se necesita un id de group para añadirlo', 500));
      }

      const addGroupMember = await GroupMember.findByIdAndUpdate(
         groupMemberId,
         {$addToSet: {userId: userId, groupId: groupId}},
         {new: true }
     );
     return res.status(200).json(addGroupMember);
   } catch (err) {
      next(err);
   }
});

 module.exports = groupMemberRoutes;