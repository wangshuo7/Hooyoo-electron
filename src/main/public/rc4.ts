export function rc4Encrypt(key: any, plaintext: any) {
  const S: any[] = []
  let result = ''

  // 初始化S盒
  for (let i = 0; i < 256; i++) {
    S[i] = i
  }

  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256
    // 交换S[i]和S[j]
    const temp = S[i]
    S[i] = S[j]
    S[j] = temp
  }

  let i = 0
  j = 0
  for (let k = 0; k < plaintext.length; k++) {
    i = (i + 1) % 256
    j = (j + S[i]) % 256
    // 交换S[i]和S[j]
    const temp = S[i]
    S[i] = S[j]
    S[j] = temp
    // 生成密钥流
    const t = (S[i] + S[j]) % 256
    const keyStream = S[t]
    // 对明文进行异或操作
    const ciphertext = plaintext.charCodeAt(k) ^ keyStream
    // 将密文转换为十六进制字符串
    result += ('0' + ciphertext.toString(16)).slice(-2)
  }

  return result
}

export function rc4Decrypt(key, ciphertext) {
  let plaintext = ''
  const encryptedBytes: any = []

  // 将十六进制字符串转换为字节数组
  for (let i = 0; i < ciphertext.length; i += 2) {
    encryptedBytes.push(parseInt(ciphertext.substr(i, 2), 16))
  }

  // 加密操作的逆过程
  const S: any[] = []
  for (let i = 0; i < 256; i++) {
    S[i] = i
  }

  let j = 0
  for (let i = 0; i < 256; i++) {
    j = (j + S[i] + key.charCodeAt(i % key.length)) % 256
    // 交换S[i]和S[j]
    const temp = S[i]
    S[i] = S[j]
    S[j] = temp
  }

  let i = 0
  j = 0
  for (let k = 0; k < encryptedBytes.length; k++) {
    i = (i + 1) % 256
    j = (j + S[i]) % 256
    // 交换S[i]和S[j]
    const temp = S[i]
    S[i] = S[j]
    S[j] = temp
    // 生成密钥流
    const t = (S[i] + S[j]) % 256
    const keyStream = S[t]
    // 对密文进行异或操作
    const plaintextByte = encryptedBytes[k] ^ keyStream
    // 将字节转换为字符并拼接到明文字符串
    plaintext += String.fromCharCode(plaintextByte)
  }

  return plaintext
}
