import { Injectable } from "@angular/core";

export class AudioSprite {
  private constructor(
    public readonly context: AudioContext,
    public readonly track: AudioBuffer
  ) {}

  static async build(file: string): Promise<AudioSprite> {
    // for cross browser compatibility
    const AudioContext = window["AudioContext"] || window["webkitAudioContext"];
    const context = new AudioContext();
    const track = await this.getFile(context, file);
    return new AudioSprite(context, track);
  }

  private static async getFile(
    context: AudioContext,
    filepath: string
  ): Promise<AudioBuffer> {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  async playOnce() {
    const trackSource = this.context.createBufferSource();
    trackSource.buffer = this.track;
    trackSource.connect(this.context.destination);

    trackSource.start();

    return new Promise((resolve) => {
      trackSource.addEventListener("ended", resolve);
    });
  }
}

type AudioTracks = {
  hit: AudioSprite;
  lost: AudioSprite;
  bg1: AudioSprite;
  bg2: AudioSprite;
};
export enum AudioBackgroundStatus {
  stopped,
  playing,
}

@Injectable()
export class AudioService {
  audioTracks: Partial<AudioTracks> = {};
  backgroundStatus = AudioBackgroundStatus.stopped;
  backgroundTracks: Array<keyof AudioTracks> = [];
  backgroundTracksIndex = 0;

  async init() {
    const tracks = await Promise.all([
      AudioSprite.build("assets/audio/explosion.mp3"),
      AudioSprite.build("assets/audio/meow1.mp3"),
      AudioSprite.build("assets/audio/bg-track1.mp3"),
      AudioSprite.build("assets/audio/bg-track2.mp3"),
    ]);
    this.audioTracks.lost = tracks[0];
    this.audioTracks.hit = tracks[1];
    this.audioTracks.bg1 = tracks[2];
    this.audioTracks.bg2 = tracks[3];
  }

  playTrack(track: keyof AudioTracks) {
    this.audioTracks[track].playOnce();
  }

  playAsBackgroundTrack(tracks: Array<keyof AudioTracks>) {
    if (tracks.length > 0) {
      this.backgroundStatus = AudioBackgroundStatus.playing;
      this.backgroundTracks = tracks;
      this.backgroundTracksIndex = 0;
      this.backgroundTracksEngine();
    }
  }

  private async backgroundTracksEngine() {
    if (this.backgroundStatus === AudioBackgroundStatus.playing) {
      const nextTrack = this.backgroundTracks[this.backgroundTracksIndex];
      if (nextTrack) {
        await this.audioTracks[nextTrack].playOnce();
        this.backgroundTracksIndex =
          (this.backgroundTracksIndex + 1) % this.backgroundTracks.length;
        this.backgroundTracksEngine();
      }
    }
  }
}
