import * as Promise from "bluebird"

import * as async from "async"


import * as net from "net"



export function checkPort(port: number) {
  return new Promise<{ port: number }>((resolve, reject) => {
    let available = false;
    const s = net.createServer().listen(port, '0.0.0.0');
    s.on('listening', () => {
      available = true;
      s.close();
    });
    s.on('error', () => {
      available = false;
      s.close();
    });
    s.on('close', () => {
      if (available) reject('invalid port');
      resolve({ port: port });
    });
  })
}


export function checkFreePortFromPool(portPool: number[]) {
  return new Promise<{ port: number }>((resolve, reject) => {

    async.eachSeries(portPool, (p, cb) => {

      checkPort(p).then((port) => {
        if (port) return resolve(port)
      }).catch((err) => {
        cb()
      })


    }, (err) => {
      if (err) return reject(err)
      reject('not found')
    })



  })

}