import * as config from './main'
export const screenshot = (ss: number, to: number) => {
  const output = 'temp output';
  ss = ss + to;
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
    ss.toString(),
    "-i",
    path,
    "-vcodec",
    "libwebp",
    "-lossless",
    "0",
    "-compression_level",
    "6",
    "-qscale:v",
    "70",
    "-vf",
    "scale=-1:520",
    "-vframes",
    "1",
    `${config.user_config.media_collection_dir}"/"${output}`
  ];
  mp.msg.warn(command.toString());
  mp.msg.warn("screenshot taken");
  command;
  return output;
}
export const clipaudio = (ss: number, to: number) => {
  //const output = mktemp('webp');
  const output = 'temp output';
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
    ss.toString(),
    //sts(start - AUDIO_THRESHOLD),
    "-to",
    to.toString(),
    //sts(end + AUDIO_THRESHOLD),
    "-i",
    path,
    "-map_metadata",
    "-1",
    "-map",
    //audio stream with japanese
    "0:1",
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
  //mp.commandv(...command);
  command;
  return output;
}
