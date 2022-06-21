import Srt from 'srt-parser-2'
import fs from 'fs'

const timeToMs = (time) =>  {
  const [_, hour, minute, second, millisecond = 0] = time.match(/(\d+):(\d+):(\d+),?(\d+)?/)

  return Math.floor((Number(hour) * 60 * 60 + Number(minute) * 60 + Number(second)) * 1000 + Number(millisecond))
}

const srt = Srt.default || Srt

export default (srtInput, onItem) => {
  const data = fs.readFileSync(srtInput).toString()
  const result = (new srt()).fromSrt(data).filter(item => !item.text.includes('{\\'))

  for (const item of result) {
    const { id, startTime, text } = item
    const ms = timeToMs(startTime)

    onItem({
      count: result.length,
      name: `${id}-${ms}`,
      text,
    })
  }
}
