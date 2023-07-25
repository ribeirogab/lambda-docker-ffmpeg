FROM public.ecr.aws/lambda/nodejs:18

COPY index.js ${LAMBDA_TASK_ROOT}

# Copy the ffmpeg static files
COPY ffmpeg /usr/local/bin/ffmpeg

# Create symlink so that `ffmpeg` can be run from any location
RUN ln -s /usr/local/bin/ffmpeg/ffmpeg /usr/bin/ffmpeg
  
CMD [ "index.handler" ]