import fs from 'fs'
import srt from './lib/srt.mjs'
import tts from './lib/tts.mjs'
import Scheduler from './lib/scheduler.mjs'

const { inputPath, outputPath, voiceName, processNumber = 2 } = JSON.parse(process.argv.slice(2)[0])

const scheduler = new Scheduler(processNumber)
let success = 0

try {
  fs.rmSync(outputPath, { recursive: true, force: true })
  fs.mkdirSync(outputPath, { recursive: true })
} catch (err) {}

srt(inputPath, (data) => {
  scheduler.add(async () => {
    await tts({
      voiceName: voiceName,
      content: data.text,
      name: data.name,
      outputPath: outputPath
    })

    success += 1

    console.log(`tts ${success} / ${data.count}`)

    if (success === data.count) {
      console.log('ok')
      process.exit()
    }
  })
})
