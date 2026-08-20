#!/usr/bin/env python3
"""Generate Joga Intelligence promo videos via OpenAI Sora 2 API."""

import os
import sys
import time
from openai import OpenAI

client = OpenAI()

OUTPUT_DIR = "/root/joga-intelligence/marketing/videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Video definitions: (filename, prompt)
VIDEOS = [
    (
        "01-hero-nave-orbe.mp4",
        "A colossal mechanical sphere floating in deep space, with eight glowing "
        "planetary orbs orbiting around it in a golden ring — green, blue, white, "
        "red, purple, orange, gold, cyan. The central reactor core pulses with "
        "blinding white light, sending shockwaves of energy outward. The orbs "
        "slowly rotate around the sphere while spiral galaxies swirl in the "
        "background. Circuit-like cyan energy lines on the sphere's surface "
        "shimmer and pulse. Camera slowly pushes in toward the core. Cinematic "
        "sci-fi atmosphere, epic orchestral synth music with deep bass."
    ),
    (
        "02-closeup-reactor.mp4",
        "Dramatic close-up of a massive mechanical sphere in space, its central "
        "reactor aperture blazing with intense white light. Blue energy conduits "
        "across the metallic surface pulse rhythmically. Three smaller planetary "
        "orbs — orange, blue, and green — drift slowly past. A purple and pink "
        "nebula shimmers in the background. Camera slowly orbits around the "
        "sphere revealing intricate mechanical detail. Particles of light float "
        "outward from the core. Deep cinematic bass drone with ethereal synth pads."
    ),
    (
        "03-jogabody-meditation.mp4",
        "A translucent green energy sphere in deep space containing a holographic "
        "wireframe human figure sitting in lotus meditation pose with glowing red "
        "energy points at chakra positions. A golden ring orbits around the sphere. "
        "Bright green light rays pulse outward rhythmically like breathing — "
        "expanding and contracting. A massive mechanical space station looms in "
        "the background. Particles of green light float upward serenely. Camera "
        "slowly zooms in on the meditating figure. Gentle ambient synth music "
        "with deep meditative hum."
    ),
]


def generate_video(filename, prompt):
    """Submit a Sora 2 video job and poll until done."""
    output_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(output_path):
        print(f"  SKIP (already exists): {output_path}")
        return output_path

    print(f"  Submitting: {filename}")
    video = client.videos.create(
        model="sora-2",
        prompt=prompt,
    )
    print(f"  Job ID: {video.id} — Status: {video.status}")

    # Poll until done
    while video.status in ("in_progress", "queued"):
        time.sleep(5)
        video = client.videos.retrieve(video.id)
        progress = getattr(video, "progress", 0)
        sys.stdout.write(f"\r  [{filename}] {video.status} — {progress:.0f}%   ")
        sys.stdout.flush()

    print()

    if video.status == "failed":
        err = getattr(getattr(video, "error", None), "message", "Unknown error")
        print(f"  FAILED: {err}")
        return None

    if video.status == "completed":
        print(f"  Downloading...")
        content = client.videos.download_content(video.id, variant="video")
        content.write_to_file(output_path)
        print(f"  SAVED: {output_path}")
        return output_path

    print(f"  Unexpected status: {video.status}")
    return None


def main():
    print("=" * 60)
    print("JOGA INTELLIGENCE — Sora 2 Video Generation")
    print("=" * 60)

    results = []
    for filename, prompt in VIDEOS:
        print(f"\n[{len(results)+1}/{len(VIDEOS)}] {filename}")
        result = generate_video(filename, prompt)
        results.append((filename, result))

    print("\n" + "=" * 60)
    print("RESULTADOS:")
    for fname, path in results:
        status = f"OK → {path}" if path else "FAILED"
        print(f"  {fname}: {status}")
    print("=" * 60)


if __name__ == "__main__":
    main()
