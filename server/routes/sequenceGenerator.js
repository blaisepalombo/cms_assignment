const Sequence = require('../models/sequence');

async function nextId(collectionType) {
  const sequence = await Sequence.findOne();

  if (!sequence) {
    throw new Error('Sequence document not found.');
  }

  let nextId;
  const updateObject = {};

  switch (collectionType) {
    case 'documents':
      sequence.maxDocumentId++;
      nextId = sequence.maxDocumentId;
      updateObject.maxDocumentId = nextId;
      break;

    case 'messages':
      sequence.maxMessageId++;
      nextId = sequence.maxMessageId;
      updateObject.maxMessageId = nextId;
      break;

    case 'contacts':
      sequence.maxContactId++;
      nextId = sequence.maxContactId;
      updateObject.maxContactId = nextId;
      break;

    default:
      throw new Error('Invalid collection type.');
  }

  await Sequence.updateOne({ _id: sequence._id }, { $set: updateObject });

  return nextId.toString();
}

module.exports = {
  nextId
};