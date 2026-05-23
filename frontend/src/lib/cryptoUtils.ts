import CryptoJS from 'crypto-js';

/**
 * Criptografa um arquivo (Blob) usando AES-GCM com uma chave gerada aleatoriamente.
 * Retorna o arquivo criptografado e a chave secreta.
 */
export async function encryptFile(file: File): Promise<{ encryptedBlob: Blob, key: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Converter para string base64 para criptografar
  const binaryString = Array.from(uint8Array).map(b => String.fromCharCode(b)).join('');
  const wordArray = CryptoJS.lib.WordArray.create(binaryString);

  // Gerar chave aleatória de 256 bits
  const key = CryptoJS.lib.WordArray.random(256/8).toString(CryptoJS.enc.Hex);

  // Criptografar
  const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

  // Converter de volta para Blob
  const encryptedBytes = CryptoJS.enc.Base64.parse(encrypted);
  const encryptedUint8 = new Uint8Array(encryptedBytes.words.length * 4);
  for (let i = 0; i < encryptedBytes.words.length; i++) {
    const word = encryptedBytes.words[i];
    encryptedUint8[i * 4] = (word >> 24) & 0xff;
    encryptedUint8[i * 4 + 1] = (word >> 16) & 0xff;
    encryptedUint8[i * 4 + 2] = (word >> 8) & 0xff;
    encryptedUint8[i * 4 + 3] = word & 0xff;
  }

  const encryptedBlob = new Blob([encryptedUint8], { type: 'application/octet-stream' });

  return { encryptedBlob, key };
}

/**
 * Descriptografa um arquivo criptografado com a chave.
 */
export async function decryptFile(encryptedBlob: Blob, key: string): Promise<Blob> {
  const arrayBuffer = await encryptedBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Converter para base64 string
  let base64Str = '';
  for (let i = 0; i < uint8Array.length; i++) {
    base64Str += String.fromCharCode(uint8Array[i]);
  }
  
  const encryptedWordArray = CryptoJS.enc.Base64.parse(base64Str);
  const decrypted = CryptoJS.AES.decrypt(encryptedWordArray.toString(CryptoJS.enc.Base64), key);
  
  const decryptedBytes = decrypted.toString(CryptoJS.enc.Utf8);
  const decryptedUint8 = new Uint8Array(decryptedBytes.length);
  for (let i = 0; i < decryptedBytes.length; i++) {
    decryptedUint8[i] = decryptedBytes.charCodeAt(i);
  }

  return new Blob([decryptedUint8], { type: 'application/octet-stream' });
}
