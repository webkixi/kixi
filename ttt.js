// var ssdb = require('ssdb');
// var client = ssdb.createClient();

ssdb = (function(){    

    var net = require('net');
    var util = require('util');


    /**
     * Cast responsed strings to Javascript types
     *
     * For each converter function:
     *
     *  @param {Array} list
     */
    var conversions = {
      int: function(list) {
        return parseInt(list[0], 10);
      },
      float: function(list) {
        return parseFloat(list[0]);
      },
      str: function(list) {
        return list[0];
      },
      bool: function(list) {
        return !!parseInt(list[0], 10);
      },
      list: function(list) {
        return list;
      }
    };


    /**
     * @exports
     * All avaliable commands this ssdb client supports
     */

    /* jshint ignore:start */
    var commands = {
      set: 'int',
      setx: 'int',
      expire: 'int',
      ttl: 'int',
      setnx: 'int',
      get: 'str',
      getset: 'str',
      del: 'int',
      incr: 'int',
      exists: 'bool',
      getbit: 'int',
      setbit: 'int',
      countbit: 'int',
      substr: 'str',
      strlen: 'int',
      keys: 'list',
      scan: 'list',
      rscan: 'list',
      multi_set: 'int',
      multi_get: 'list',
      multi_del: 'int',
      hset: 'int',
      hget: 'str',
      hdel: 'int',
      hincr: 'int',
      hexists: 'bool',
      hsize: 'int',
      hlist: 'list',
      hrlist: 'list',
      hkeys: 'list',
      hgetall: 'list',
      hscan: 'list',
      hrscan: 'list',
      hclear: 'int',
      multi_hset: 'int',
      multi_hget: 'list',
      multi_hdel: 'int',
      zset: 'int',
      zget: 'int',
      zdel: 'int',
      zincr: 'int',
      zexists: 'bool',
      zsize: 'int',
      zlist: 'list',
      zrlist: 'list',
      zkeys: 'list',
      zscan: 'list',
      zrscan: 'list',
      zrank: 'int',
      zrrank: 'int',
      zrange: 'list',
      zrrange: 'list',
      zclear: 'int',
      zcount: 'int',
      zsum: 'int',
      zavg: 'float',
      zremrangebyrank: 'int',
      zremrangebyscore: 'int',
      multi_zset: 'int',
      multi_zget: 'list',
      multi_zdel: 'int',
      qsize: 'int',
      qclear: 'int',
      qfront: 'str',
      qback: 'str',
      qget: 'str',
      qslice: 'list',
      qpush: 'str',
      qpush_front: 'int',
      qpush_back: 'int',
      qpop: 'str',
      qpop_front: 'str',
      qpop_back: 'str',
      qlist: 'list',
      qrlist: 'list',
      dbsize: 'int',
      info: 'list',
      auth: 'bool'
    };
    /* jshint ignore:end */


    /**
     * @constructor
     */
    function ResponseParser(){}


    /**
     * Parse incoming string from socket to chunks
     * @param {String} buf
     */

    ResponseParser.prototype.parse = function(buf) {  // jshint ignore: line
      buf = new Buffer(buf);

      if (typeof this.unfinished !== 'undefined') {
        // pickup unfinished buffer last time
        buf = Buffer.concat([this.unfinished, buf]);
      }

      var resps = [], resp = [];
      var len = buf.length;
      var p = 0;  // pointer to loop over buffer
      var q = 0;  // the position of the first '\n' in an unit
      var r = 0;  // always the start of the next response
      var d = 0;

      while (p < len) {
        // find the first '\n'
        q = [].indexOf.apply(buf, [10, p]);
        // no '\n' was found
        if (q < 0) {
          break;
        }
        // an '\n' was found, skip it
        q += 1;
        d = q - p ;

        // the first char is '\n' or the first two chars are '\r\n',
        // ends of a response
        if (d === 1 || (d === 2 && buf[p] === 13)) {
          r = p += d; // skip the distancea
          resps.push(resp); resp = [];
          // continue to next response
          continue;
        }

        // size of data
        var size = +buf.slice(p, q);

        // move to the '\n' after data
        var t = p = q + size;

        if (p < len && buf[p] === 10) {
          // skip a '\n'
          p += 1;
        } else if (p + 1 < len && buf[p] === 10 && buf[p + 1] === 13) {
          // skip a '\r\n'
          p += 2;
        } else {
          // exceeds length
          break;
        }

        var data = buf.slice(q, t);
        resp.push(data.toString());
      }

      if (r < len) {
        this.unfinished = buf.slice(r);
      } else {
        this.unfinished = undefined;
      }

      return resps;
    };


    /**
     * @constructor
     * @param {Object} options
     *
     * options
     *
     *   port     Number, ssdb port to connect
     *   host     String, ssdb host to connect
     *   auth     String, ssdb auth password
     *   timeout  Number, time limit to connect ssdb (in ms)
     */
    function Connection(options) {
      this.port = options.port || 8888;
      this.host = options.host || '0.0.0.0';
      this.auth = options.auth;  // default: undefined
      this.timeout = options.timeout || 0;  // default: 0

      this.sock = null;
      this.callbacks = [];
      this.commands = [];
      this.parser = new ResponseParser();
    }


    /**
     * Connect to ssdb server
     *
     * @param {Function} callback  // callback on socket connected (with no params)
     */
    Connection.prototype.connect = function(callback) {
      this.sock = net.Socket();
      this.sock.setTimeout(this.timeout);
      this.sock.setEncoding('utf8');
      this.sock.setNoDelay(true);
      this.sock.setKeepAlive(true);
      this.sock.connect(this.port, this.host, callback);
      var self = this;
      this.sock.on('data', function(buf) {return self.onrecv(buf);});
    };


    /**
     * Close this connection
     */
    Connection.prototype.close = function() {
      if (this.sock) {
        this.sock.end();
        this.sock.destroy();
        this.sock = null;
      }
    };


    /**
     * Compile command & parameters to buffer before sent to ssdb
     *
     * @param {String} cmd   // ssdb command, e.g. 'set', 'get'
     * @param {Array} params  // command args, e.g. ['1', '2']
     * @return {Buffer}
     */
    Connection.prototype.compile = function(cmd, params) {
      var args = [];
      var list = [];
      var pattern = '%d\n%s\n';

      args.push(cmd);
      [].push.apply(args, params);

      for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        var bytes = Buffer.byteLength(util.format('%s', arg));
        list.push(util.format(pattern, bytes, arg));
      }

      list.push('\n');
      return new Buffer(list.join(''));
    };


    /**
     * Send command & parameters to ssdb
     *
     * @param {String} cmd
     * @param {Array} params
     */
    Connection.prototype.send = function(cmd, params) {
      var buf = this.compile(cmd, params);
      // lazy connect
      if (!this.sock) {
        var self = this;
        return this.connect(function() {
          if (typeof self.auth !== 'undefined') {
            // auth on the first command
            self.send('auth', [self.auth]);
          }
          // tcp guarantees this `write` orders after `auth`
          self.sock.write(buf);
        });
      } else {
        return this.sock.write(buf);
      }
    };


    /**
     * Buile Javascript values by type and data from socket
     *
     * @param {String} type  // data type, e.g. 'int', 'str'
     * @param {Arrat} list
     * @return {Object}
     */
    Connection.prototype.buildValue = function(type, list) {
      return conversions[type](list);
    };


    /**
     * Receive buffer from socket and call the responsive callback
     *
     * @param {String} buf
     */
    Connection.prototype.onrecv = function(buf) {
      var responses = this.parser.parse(buf);
      var self = this;

      responses.forEach(function (response) {
        var error;
        var data;

        var status = response[0];
        var body = response.slice(1);
        var command = self.commands.shift();
        var errTpl = 'ssdb: \'%s\' on command \'%s\'';

        // build value
        switch (status) {
          case 'ok':
            var type = commands[command] || 'str';
            data = self.buildValue(type, body);
            break;
          case 'not_found':
            // do nothing, err: undefined, data: undefined
            break;
          /* jshint ignore:start */
          case 'client_error':
          case 'fail':
          case 'error':
          case 'server_error':
          default:
          /* jshint ignore:end */
            // build error
            error = new Error(util.format(errTpl, status, command));
            break;
        }

        // call callback
        var callback = self.callbacks.shift();

        if (callback) {
          callback(error, data);
        }
      });
    };


    /**
     * Execute an command with parameters and callback.
     *
     * @param {String} cmd
     * @param {Array} params
     * @param {Function} callback
     */
    Connection.prototype.request = function(cmd, params, callback) {
      this.commands.push(cmd);
      this.callbacks.push(callback);
      return this.send(cmd, params);
    };


    /**
     * @constructor
     *
     * @param {Object} options
     *
     * options
     *
     *   port     Number, ssdb port to connect
     *   host     String, ssdb host to connect
     *   auth     String, ssdb auth password
     *   size     Number, connection pool size, default: 1
     *   timeout  Number, time limit to connect ssdb (in ms)
     */
    function Client(options) {
      this.size = options.size || 1;
      this.pool = [];

      for (var i = 0; i < this.size; i++) {
        this.pool.push(new Connection(options));
      }

      this._registerCommands();
    }


    /**
     * Acquire a connection with less commands to be executed
     * @return {Object} conn
     */
    Client.prototype.acquire = function() {
      var nums = [];

      for (var i = 0; i < this.pool.length; i++) {
        nums.push(this.pool[i].commands.length);
      }

      var min_ = Math.min.apply(null, nums);

      for (i = 0; i < this.pool.length; i++) {
        if (this.pool[i].commands.length <= min_) {
          return this.pool[i];
        }
      }
    };


    /**
     * Bind commands to this client
     */
    Client.prototype._registerCommands = function() {
      var self = this;

      for (var key in commands) {
        (function(key) {
          self[key] = function() {
            var callback;
            var cmd = key;
            var params = [].slice.call(arguments, 0, -1);
            var lastItem = [].slice.call(arguments, -1)[0];

            if (typeof lastItem === 'function') {
              callback = lastItem;
            } else {
              params.push(lastItem);
            }

            var conn = self.acquire();
            return conn.request(cmd, params, callback);
          };
        })(key);  // jshint ignore: line
      }
    };


    /**
     * Quit this client from ssdb
     */
    Client.prototype.quit = function() {
      for (var i = 0; i < this.pool.length; i++) {
        this.conn.close();
      }
    };


    /**
     * Make this client behaves thunkify
     */
    Client.prototype.thunkify = function() {
      var self = this;

      for (var cmd in commands) {
        (function(cmd) {
          var nfunc = self[cmd];
          self[cmd] = function () {
            var args = arguments;
            return function (callback) {
              [].push.call(args, callback);
              nfunc.apply(this, args);
            };
          };
        })(cmd);  // jshint ignore: line
      }
      return self;
    };


    /**
     * MAke this client behaves promisify
     * To works with tj/co or bluebird or then ..
     */
    Client.prototype.promisify = function() {
      var self = this;
      for (var cmd in commands) {
        (function(cmd) {
          var nfunc = self[cmd];
          self[cmd] = function() {
            var args = arguments;
            var ctx = this;
            return new Promise(function(resolve, reject){
              var cb = function(err, data) {
                if (err) {
                  return reject(err);
                }
                resolve(data);
              };
              [].push.call(args, cb);
              nfunc.apply(ctx, args);
            });
          };
        })(cmd);  // jshint ignore: line
      }
      return self;
    };

    /**
     * @exports
     */    
    var cC = function(options){
        return new Client(options || {});
    }  

    return {commands:commands,createClient:cC} 

})() //ssdb end


var client = ssdb.createClient();
function co(GenFunc,cb) {
  var co_in = function(cb) {
    var gen = GenFunc()
    next();
    function next(err, args) {
      if (err) {
        cb(err)
      } else {
        if (gen.next) {
          var ret = gen.next(args)
          if (ret.done) {
            cb && cb(err, args)
          } else {            
            ret.value(next)
          }
        }
      }
    }
  }
  co_in(cb);
}

function set(key,value){
    return function(fn){ client.set(key,value,fn); }
}
function get(key){
    return function(fn){ client.get(key,fn); }
}

function* run(){
    var data = yield get('key');
    console.log(data);
}

co(run);