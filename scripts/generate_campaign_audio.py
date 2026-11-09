import asyncio
import os
import sys
from pathlib import Path
import edge_tts

OUTPUT_DIR = Path('apps/web/public/audio')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

DIALOGUES = [
    (
        'aria-awakening-1.mp3',
        (
            'System alert. Primary containment offline. Engineer, can you hear'
            ' me? My neural relays are barely holding auxiliary power.'
        ),
    ),
    (
        'aria-briefing-2.mp3',
        (
            'The command console was encrypted by an automated safety'
            ' interlock during the blackout. To override it, we must issue our'
            ' first Python command: print our station status to the terminal'
            ' stream.'
        ),
    ),
    (
        'aria-success-6.mp3',
        (
            'Command bridge online! Diagnostic stream verified. Reactor output'
            ' stabilizing at 98.4%. Outstanding work, Engineer! The station'
            ' lives.'
        ),
    ),
    (
        'aria-ending-7.mp3',
        (
            'The primary relays are secure, but sensor logs indicate a rogue'
            ' frequency coming from the Sub-orbital Array. Ready when you are'
            ' for our next descent.'
        ),
    ),
]


async def generate_all():
  print('Synthesizing Campaign 1 audio lines with Edge-TTS (en-US-AriaNeural)...')
  for filename, text in DIALOGUES:
    file_path = OUTPUT_DIR / filename
    print(f'Generating {filename}...')
    communicate = edge_tts.Communicate(
        text=text,
        voice='en-US-AriaNeural',
        rate='+0%',
        pitch='+2Hz',
        volume='+0%',
    )
    await communicate.save(str(file_path))
    size_kb = file_path.stat().st_size / 1024
    print(f'Saved {filename} ({size_kb:.1f} KB)')
  print('All Campaign 1 audio successfully generated into apps/web/public/audio!')


if __name__ == '__main__':
  asyncio.run(generate_all())
