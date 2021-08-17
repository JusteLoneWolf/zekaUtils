module.exports = {
  Lib:{
    duration: require('./lib/Duration'),
    timeToMs: require('./lib/TimeToMs')
  },
  PrototypeExtend:new (require('./prototype/main'))
}
