module.exports = {
  info: (msg, ...args) => console.log('[INFO]', msg, ...args),
  warn: (msg, ...args) => console.warn('[WARN]', msg, ...args),
  error: (obj, msg) => console.error('[ERROR]', msg, obj)
};
