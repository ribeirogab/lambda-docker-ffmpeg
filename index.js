const child = require('node:child_process')
const util = require('node:util')

const exec = util.promisify(child.exec)

exports.handler = async event => {
  console.log('Executing `ffmpeg -version` command')

  const { stdout, stderr } = await exec('ffmpeg -version')

  if (stdout) {
    console.log('stdout', stdout)
  }

  if (stderr) {
    console.log('stderr', stderr)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' })
  }
}
