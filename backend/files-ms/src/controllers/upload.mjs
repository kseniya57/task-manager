import bodyParser from 'koa-body';

export default [
  bodyParser({
    formidable: {
      uploadDir: process.env.UPLOADS_PATH,
      onFileBegin: (name, file) => {
        const ext = file.name.match(/(.*)\.(.*)/)[2];
        const dir = file.type.startsWith('image') ? 'images/' : 'files/';

        // eslint-disable-next-line no-param-reassign
        file.path = `${file.path.replace('upload_', dir)}.${ext}`;
      },
    },
    multipart: true,
    urlencoded: true,
  }),
  (ctx) => {
    ctx.body = {
      error: false,
      fileName: ctx.request.files.file.path.replace(/^uploads/, ''),
    };
  },
];
