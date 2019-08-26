import mongoose from 'mongoose';

export const isEmpty = fieldValue => {
  return !(fieldValue.trim().length === 0);
}

export const handleError = ({ errors }, res) => {
  const modelErrors = Object.keys(errors);
  return res.status(400).send({
    status: 'failed',
    message: errors[modelErrors.shift()].message
  })
}


export async function validateDocument (model, documentId, res) {
  const error = new Error();
  error.status = 'failed'

  try {
    if(!mongoose.Types.ObjectId.isValid(documentId)) {
      error.code = 400;
      error.message = 'state(id) isn\'t a valid mongoose document id';
      throw error;
    }

    const document = await model.findById(documentId);
    if (!document) {
      error.code = 404;
      error.message = 'state(id) not found';
      throw error;
    }
    return document
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.code = 400;
      error.message = 'state(id) isn\'t a valid mongoose document id';
      return res.send({
        status: error.status,
        message: error.message,
      })
    } else if (error.code === 404 || error.code === 400) {
      return res.status(error.code).json({
        status: error.status,
        message: error.message,
      })
    }
    return res.status(500).json({
      status: error.status,
      message: error.message,
    })
  }
}

export async function validateSubDocument (state, subDocId, res) {
  const error = new Error();
  error.status = 'failed'

  try {
    if (!mongoose.Types.ObjectId.isValid(subDocId)) {
      error.code = 400;
      error.message = 'lga(id) isn\'t a valid mongoose document id';
    }

    const document = await state.lgas.id(subDocId);
    if (!document) {
      error.code = 404;
      error.message = 'lga(id) not found within provided state';
      throw error
    }

    return document
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.code = 400;
      error.message = 'lga(id) isn\'t a valid mongoose document id';
      return res.send({
        status: error.status,
        message: error.message,
      })
    } else if (error.code === 404) {
      return res.status(error.code).json({
        status: error.status,
        message: error.message,
      })
    }
    return res.status(500).json({
      status: error.status,
      message: error.message,
    })
  }
}
