import path from 'path'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

const toTTS = async (config) => {
  const { speed = 0, pitch = 0, voiceName, content, name, outputPath } = config
  const tts = new MsEdgeTTS()

  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_48KHZ_192KBITRATE_MONO_MP3)

  const xml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:emo="http://www.w3.org/2009/10/emotionml" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${tts._voiceLocale}">
          <voice name="${tts._voice}">
              <prosody rate="${speed}%" pitch="${pitch}%">${content}</prosody>
          </voice>
      </speak>`.trim()
    
  const success = await tts.rawToFile(path.join(outputPath, name + '.mp3'), xml)

  if (!success) {
    return toTTS(config)
  }

  return true
}

export default toTTS
