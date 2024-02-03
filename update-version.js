// update-version.js
const fs = require('fs')

// 读取 package.json 文件
const packageJsonPath = './package.json'
const packageJson = require(packageJsonPath)

// 获取当前版本号
const currentVersion = packageJson.version.split('.').map(Number) // 将版本号转换为数组

// 获取命令行参数
const args = process.argv.slice(3) // 获取命令行参数，去掉前两个参数，即 'node' 和 'update-version.js'
// console.log(process.argv)
if (args.includes('-z') || args.includes('-y') || args.includes('-x')) {
  if (args.includes('-z')) {
    // 根据命令行参数更新版本号
    currentVersion[2]++ // 自增最小版本号
  } else if (args.includes('-y')) {
    currentVersion[1]++ // 自增中间版本号
    currentVersion[2] = 0 // 将最小版本号重置为0
  } else if (args.includes('-x')) {
    currentVersion[0]++ // 自增最大版本号
    currentVersion[1] = 0 // 将中间版本号重置为0
    currentVersion[2] = 0 // 将最小版本号重置为0
  }
} else {
  console.log('自增失败,请检查参数')
}

// 更新版本号
packageJson.version = currentVersion.join('.') // 将版本号数组转换为字符串

// 将修改后的 package.json 保存回文件中
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log(`最新版本号为 ${packageJson.version}`)
