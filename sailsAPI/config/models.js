
module.exports.models = {

  // These settings make the .update(), .create() and .createEach()
  // work like they did in 0.12, by returning records in the callback.
  fetchRecordsOnUpdate: true,
  fetchRecordsOnCreate: true,
  fetchRecordsOnCreateEach: true,


  //Sets datastore to the default located at config/datastores.js
  datastore: 'default',

	//Keep the database data safe
  migrate: 'safe',
	
  // These attributes will be added to all of your models. 
  attributes: {
    id: { type: 'number', autoIncrement: true, },
    createdAt: { type: 'string', autoCreatedAt: true, },
    updatedAt: { type: 'string', autoUpdatedAt: true, }
  },

  /******************************************************************************
  *                                                                             *
  * The set of DEKs (data encryption keys) for at-rest encryption.              *
  * i.e. when encrypting/decrypting data for attributes with `encrypt: true`.   *
  *                                                                             *
  * > The `default` DEK is used for all new encryptions, but multiple DEKs      *
  * > can be configured to allow for key rotation.  In production, be sure to   *
  * > manage these keys like you would any other sensitive credential.          *
  *                                                                             *
  * > For more info, see:                                                       *
  * > https://sailsjs.com/docs/concepts/orm/model-settings#?dataEncryptionKeys  *
  *                                                                             *
  ******************************************************************************/
  dataEncryptionKeys: {
    default: '0H68K9HjFICncEE1OlT/9vqoWLOD7w2ZJid5AYrrNHk='
  },

};
