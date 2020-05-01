const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-1' });


module.exports = async (encrypted) => {
  let decrypted
  const kms = new AWS.KMS()

  try {
      const req = { CiphertextBlob: Buffer.from(encrypted, 'base64') }
      const data = await kms.decrypt(req).promise()
      decrypted = data.Plaintext.toString('ascii')
  } catch (err) {
      console.log('Decrypt error:', err)
      throw err
  }

  return decrypted
}
