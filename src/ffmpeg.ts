import {user_config as config} from './main'
const mktemp = (extension: string) => {
  const command = ['mktemp', `--suffix=.${extension}`, `${config.media_collection_dir}/sub2srs.XXXXXX`];
  const raw = mp.command_native({
    name: 'subprocess',
    playback_only: false,
    capture_stdout: true,
    args: command
  })
  mp.msg.warn(`||${raw.stdout.trim()}||`);
  return raw.stdout.trim();
}

export const screenshot = (ss: number, to: number) => {
  const output = mktemp('webp');
  ss = (ss + to) / 2;
  const path = mp.get_property('path');
  var command = [
    "run",
    "ffmpeg",
    "-hide_banner",
    "-nostdin",
    "-y",
    "-loglevel",
    "quiet",
    "-an",
    "-ss",
    `${ss}`,
    "-i",
    path,
    "-vcodec",
    "libwebp",
    "-lossless",
    "0",
    "-compression_level",
    "6",
    "-qscale:v",
    `${config.screenshot_quality}`,
    "-vf",
    `scale=${config.image_width}:${config.image_height}`,
    "-vframes",
    "1",
    output
  ];
  mp.commandv(...command);
  mp.msg.warn(command.toString());
  return output;
}
export const clipaudio = (ss: number, to: number) => {
  const output = mktemp('ogg');
  ss = ss - config.audio_threshold;
  to = to + config.audio_threshold;
  const path = mp.get_property('path');
  //change to configurations
  var command = [
    "run",
    "ffmpeg",
    "-hide_banner",
    "-nostdin",
    "-y",
    "-vn",
    "-loglevel",
    "quiet",
    "-ss",
    `${ss}`,
    //sts(start - AUDIO_THRESHOLD),
    "-to",
    `${to}`,
    //sts(end + AUDIO_THRESHOLD),
    "-i",
    path,
    "-map_metadata",
    "-1",
    "-map",
    `0:${mp.get_property('aid')}`,
    "-ac",
    "1",
    "-codec:a",
    "libopus",
    "-vbr",
    "on",
    "-compression_level",
    "7",
    "-application",
    "voip",
    "-b:a",
    "18k",
    output,
  ];
  mp.msg.warn(command.toString());
  mp.commandv(...command);
  command;
  return output;
}
