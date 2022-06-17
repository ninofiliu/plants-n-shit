import { useEffect, useState } from "react";
import waterSrc from "./sounds/amo/liquid2.mp3";

import RangeInput from "./RangeInput";
import React from "react";
import ac from "./ac";
import Graph from "./Graph";

const createAudioGain = (src: string) => {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.autoplay = true;
  audio.loop = true;
  const source = ac.createMediaElementSource(audio);
  const gain = ac.createGain();
  source.connect(gain);
  gain.connect(ac.destination);
  return gain;
};

export default ({ raw, name }: { raw: number; name: string }) => {
  const smoother = 0.5;
  const [smooth, setVMooth] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1);
  const norm = (smooth - min) / (max - min);
  const [gain, setGain] = useState<GainNode | null>(null);

  const setMinSafe = (newMin: number) => {
    if (newMin >= max) return;
    setMin(newMin);
  };
  const setMaxSafe = (newMax: number) => {
    if (newMax <= min) return;
    setMax(newMax);
  };

  useEffect(() => {
    setVMooth(smoother * smooth + (1 - smoother) * raw);
    if (gain) {
      gain.gain.value = Math.max(0, Math.min(1, norm));
    }
  }, [raw]);

  useEffect(() => {
    setGain(createAudioGain(waterSrc));
  }, []);

  return (
    <>
      <h2>{name}</h2>
      <RangeInput value={min} setValue={setMinSafe} name="min" />
      <RangeInput value={max} setValue={setMaxSafe} name="max" />
      <Graph
        values={{
          "#00f": raw,
          "#88f": smooth,
          "#000": min,
          "#001": max,
        }}
      />
      <Graph
        values={{
          "#44f": norm,
        }}
      />
    </>
  );
};