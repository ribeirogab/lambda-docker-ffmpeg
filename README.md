# Lambda Docker with FFmpeg

Source: <https://www.maskaravivek.com/post/how-to-install-ffmpeg-on-ec2-running-amazon-linux/>

Related: <https://github.com/ribeirogab/lambda-docker-ecr>

---

## Download static ffmpeg

```bash
wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
tar -xf ffmpeg-release-amd64-static.tar.xz
rm -rf ffmpeg-release-amd64-static.tar.xz
mv ffmpeg-*-amd64-static ffmpeg
```

## Dockerfile

```Dockerfile
FROM public.ecr.aws/lambda/nodejs:18

COPY index.js ${LAMBDA_TASK_ROOT}

# Copy the ffmpeg static files
COPY ffmpeg /usr/local/bin/ffmpeg

# Create symlink so that `ffmpeg` can be run from any location
RUN ln -s /usr/local/bin/ffmpeg/ffmpeg /usr/bin/ffmpeg
  
CMD [ "index.handler" ]
```

## Testing

1. Edit `index.js` to show ffmpeg version on executing

```js
const child = require('node:child_process')
const util = require('node:util')

const exec = util.promisify(child.exec)

exports.handler = async event => {
  console.log('Executing `ffmpeg -version` command')

  const { stdout, stderr } = await exec('ffmpeg -version')

  if (stdout) {
    console.log('stdout', stdout)
  }

  if (stderr) {
    console.log('stderr', stderr)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' })
  }
}
```

2. Build Docker

```bash
docker build -t docker-image:node-ffmpeg . 
```

3. Run Docker container

```bash
docker run -p 9000:8080 docker-image:node-ffmpeg 
```

4. Get the `CONTAINER ID`

```bash
docker container ls 
```

5. Enter the container and run the command `ffmpeg -version`

```bash
docker exec -it CONTAINER_ID bash
```

The return should be something like this:

```bash
ffmpeg version N-66595-gc2b38619c0-static https://johnvansickle.com/ffmpeg/  Copyright (c) 2000-2023 the FFmpeg developers
built with gcc 8 (Debian 8.3.0-6)
configuration: --enable-gpl --enable-version3 --enable-static --disable-debug --disable-ffplay --disable-indev=sndio --disable-outdev=sndio --cc=gcc --enable-fontconfig --enable-frei0r --enable-gnutls --enable-gmp --enable-libgme --enable-gray --enable-libaom --enable-libfribidi --enable-libass --enable-libvmaf --enable-libfreetype --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-librubberband --enable-libsoxr --enable-libspeex --enable-libsrt --enable-libvorbis --enable-libopus --enable-libtheora --enable-libvidstab --enable-libvo-amrwbenc --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libdav1d --enable-libxvid --enable-libzvbi --enable-libzimg
libavutil      58. 14.100 / 58. 14.100
libavcodec     60. 22.100 / 60. 22.100
libavformat    60. 10.100 / 60. 10.100
libavdevice    60.  2.101 / 60.  2.101
libavfilter     9.  8.102 /  9.  8.102
libswscale      7.  3.100 /  7.  3.100
libswresample   4. 11.100 /  4. 11.100
libpostproc    57.  2.100 / 57.  2.100
```
