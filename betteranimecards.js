var config = {
  audio_threshold: 0.25,
  image_width: 520,// -2 for auto width
  image_height: 520,
  image_delay_percent: 0.08,
  screenshot_quality: 70, //0 - 100, 100 is best
  deck_name: 'Manual Mine',
  note_type: 'Audio Cards',
  tag_name: 'animecards',
  media_collection_dir: '/home/massimo/debugging/'//'/home/massimo/.local/share/Anki2/User 1/collection.media',
}

var ffmpeg = {}
var ankiconnect = {}

var curl = 'curl';
//todo: utility functions

ffmpeg.prefix = ['run', 'ffmpeg', '-hide_banner', '-nostdin', '-y']
ffmpeg.execute = function(args) {
  mp.msg.warn(args)
  if (args.length > 0) {
    mp.msg.warn('running')
    var command = ffmpeg.prefix.concat(args);
    mp.msg.warn(command)
    mp.commandv.apply(null, command);
  }
}

ffmpeg.screenshot = function(ss, filename) {
  var video_path = mp.get_property('path'); 
  filename = 'debug.webp'
  ss = 600
  var screenshot_path = config.media_collection_dir.concat(filename);
  ffmpeg.execute([
        '-an',
        '-ss', ss.toString(),
        '-i', video_path,
        '-vcodec', 'libwebp',
        '-lossless', '0',
        '-compression_level', '6',
        '-qscale:v', config.screenshot_quality.toString(),
        '-vf', String.format('scale={0}:{1}', config.screenshot_width, config.screenshot.height),
        '-vframes', '1',
         screenshot_path
  ])
}
mp.msg.warn('hello world');

//source https://stackoverflow.com/a/4673436
//string formatting polyfill
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}


//mpv keybindings; todo: better keybinds
mp.add_key_binding('g', 'betteranimecards', ffmpeg.screenshot);
