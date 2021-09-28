function get(sensorId, callback) {
  var now = new Date();
  callback(undefined, now.getSeconds());
}
module.exports = {
  get: get
};