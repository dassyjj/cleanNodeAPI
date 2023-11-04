import http from 'http'
import { Transform } from 'node:stream';

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;

    callback(null, Buffer.from(String(transformed)));
  }
}

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await(const chunk of req.pipe(new InverseNumberStream())){
    buffers.push(chunk)
  }

  const fullStreamContent = Buffer.concat(buffers.toString())

  return res.end(fullStreamContent)

  // return req
  //   .pipe(new InverseNumberStream())
  //   .pipe(process.stdout)
})

server.listen(3334)