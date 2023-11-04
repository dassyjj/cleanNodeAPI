import { Readable, Writable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 5) {
        this.push(null);
      } else {
        const buff = Buffer.from(String(i))
        this.push(buff)
      }
    }, 1000);
  }
}

class MultiplayByTenStream extends Writable {
  _write(chunk, encoding, callback){
    console.log(Number(chunk.toString()) * 10);
    callback()
  }
}

fetch("http://localhost:3334", {
  method: 'POST',
  duplex: 'half',
  body: new OneToHundredStream(),
}).then(res => {
  return res.arrayBuffer()
}).then(data => {
  console.log(data)
})