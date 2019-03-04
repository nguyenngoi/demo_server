const dgram = require('dgram').createSocket('udp4');
const io = require('socket.io');

class Socket {
  constructor(server) {
    this.io = io(server);
    this.dgram = dgram;
    this.status = '0';
    this.socket = null;
    this.remote = null;

    this.onUdp();
    this.onSocketIo();
  }

  onUdp() {
    this.dgram.on('message', (msg, remote) => {
      this.remote = remote;
      if (msg === '?') {
        const ms = new Buffer(this.status);
        this.dgram.send(ms, 0, ms.length, remote.port, remote.address, (err, bytes) => {
          if (err) throw err;
          console.log('UDP message sent to ' + remote.address + ':' + remote.port);
        })
      } else {
        // this.status = msg;
        this.onEvent(msg);
      }
    })
    this.dgram.bind(8088);
  }

  onSocketIo() {
    this.io
      .on('connection', socket => {
        this.socket = socket;
        console.log('client connection')
        this.socket.on('info', data => {
          this.socket.emit('info', data)
        })
        this.socket.on('message', data => {
          this.onEvent(data);
        })
        this.socket.on('disconnect', () => {
          // disconnect socket
        })
      })
  }

  onEvent(data) {
    this.status = data;

    // sendback
    if (this.remote) {
      const ms = new Buffer(msg);
      this.dgram.send(ms, 0, ms.length, this.remote.port, this.remote.address, (err, bytes) => {
        if (err) throw err;
        console.log('UDP message sent to ' + this.remote.address + ':' + this.remote.port);
      })
    }

    // broadcast
    if (this.socket) {
      this.socket.emit('message', data)
      this.socket.broadcast.emit('message', data)
    }
  }
}

module.exports = Socket;