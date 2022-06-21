import os
import sys
import threading
from pydub import AudioSegment

[inputPath, outputPath] = sys.argv[1:3]

loadAudioSuccess = 0
audioLength = 0

def joinAudio(items):
  audio = AudioSegment.silent(0)

  count = 0
  success = 0
  length = len(items)

  for item in items:
    emptyTime = item['start'] - count

    if emptyTime > 0:
      audio += AudioSegment.silent(emptyTime)

    audio += item['audio']
    count = len(audio)

    success += 1

    sys.stdout.write(f'join {success} / {length}\n')
    sys.stdout.flush()

  return audio

def process(fun, items):
  result = {}
  threads = []

  class Thread(threading.Thread):
    def __init__(self, result, index, value):
      threading.Thread.__init__(self)

      self.index = index
      self.value = value
      self.result = result

    def run(self):
      self.result[self.index] = fun(self.value)
  
  for index in range(len(items)):
    thread = Thread(result, index, items[index])
    thread.start()
    threads.append(thread)

  for x in threads:
    x.join()

  result = list(result.items())
  result.sort(key=lambda x: int(x[0]))

  newItems = []

  for x in result:
    newItems.append(x[1])

  return newItems

def processAudioFile(file):
  global loadAudioSuccess

  audio = AudioSegment.from_mp3(file['filePath'])

  loadAudioSuccess += 1

  sys.stdout.write(f'load {loadAudioSuccess} / {audioLength}\n')
  sys.stdout.flush()

  return { 'audio': audio, 'start': file['start'] }

def init():
  global audioLength
  initFiles = os.listdir(inputPath)
  files = []

  for name in initFiles:
    if name == '.DS_Store':
      continue
    
    files.append(name)


  files.sort(key=lambda x: int(x.split('-')[0]))
  newFiles = []
  audioLength = len(files)

  for name in files:
    start = name.replace('.mp3', '').split('-')[1]
    filePath = os.path.join(inputPath, name)
    newFiles.append({ 'start': int(start), 'filePath': filePath })

  audio = joinAudio(process(processAudioFile, newFiles))

  audio.export(outputPath, format='mp3')

  print('ok')

init()
