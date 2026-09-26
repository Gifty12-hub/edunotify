import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import type { AudioResult } from "../lib/api";

interface ListenButtonProps {
  /** Fetches the audio. Called on the first click, then the audio is reused. */
  load: () => Promise<AudioResult>;
  label?: string;
  disabled?: boolean;
  /** Show the words that were spoken (useful when the message was translated). */
  showText?: boolean;
}

/** Plays a message aloud. Made for parents who cannot read, and for teachers to check the voice. */
export default function ListenButton({ load, label = "Listen", disabled, showText }: ListenButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [error, setError] = useState("");
  const [spoken, setSpoken] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    []
  );

  const play = async () => {
    if (status === "playing") {
      audioRef.current?.pause();
      setStatus("idle");
      return;
    }
    setError("");
    try {
      if (!audioRef.current) {
        setStatus("loading");
        const result = await load();
        urlRef.current = result.url;
        setSpoken(result.text);
        const audio = new Audio(result.url);
        audio.onended = () => setStatus("idle");
        audioRef.current = audio;
      }
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setStatus("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not play the audio.");
      setStatus("error");
    }
  };

  return (
    <div className="inline-block text-left">
      <button
        type="button"
        onClick={play}
        disabled={disabled || status === "loading"}
        className="inline-flex items-center gap-1.5 rounded-md border border-indigo/30 px-3 py-1.5 text-xs font-semibold text-indigo hover:bg-indigo/5 disabled:opacity-50"
      >
        <Volume2 size={14} />
        {status === "loading" ? "Preparing audio…" : status === "playing" ? "Stop" : label}
      </button>
      {status === "error" && <p className="mt-1 max-w-xs text-xs text-clay">{error}</p>}
      {showText && spoken && <p className="mt-1 max-w-xs text-xs text-ink/60">{spoken}</p>}
    </div>
  );
}
