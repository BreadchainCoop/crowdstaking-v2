import { useEffect, useState } from "react";
import { getAudioContext } from "./audioContext";

export function useAudio({ src }: { src: string }) {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchAudio() {
      const audioContext = getAudioContext();
      if (!audioContext) return;
      const res = await fetch(src, { signal: controller.signal });
      if (!res.ok) throw new Error(`Failed to load audio: ${res.status}`);
      const audioBuffer = await audioContext.decodeAudioData(
        await res.arrayBuffer()
      );
      if (!controller.signal.aborted) setAudioBuffer(audioBuffer);
    }
    fetchAudio().catch((err): void => {
      if (!controller.signal.aborted) console.log({ err });
    });
    return () => controller.abort();
  }, [src]);

  async function playSound() {
    if (!audioBuffer) return;
    const audioContext = getAudioContext();
    const src = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    src.buffer = audioBuffer;
    src.loop = false;
    src.connect(gain);
    gain.connect(audioContext.destination);
    src.start(now);
    gain.gain.setValueAtTime(1, now);
    gain.gain.setValueAtTime(1, now + 0.4);
    gain.gain.linearRampToValueAtTime(0, now + 1.2);

    // console.log("playing sound");
    // console.log("playing sound", audioContext.state);
    // if (audioContext.state === "suspended") {
    //   await audioContext.resume();
    //   console.log("ctx state after:", audioContext.state);
    //   source.onended = () => initSource(audioBuffer);
    //   return;
    // }
    // source.start();
    // source.onended = () => initSource(audioBuffer);
  }

  return { playSound };
}
