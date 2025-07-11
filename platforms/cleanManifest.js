const allowedKeys = ["version", "type"];

Object.keys(this).forEach(k => {
  if (!allowedKeys.includes(k)) delete this[k];
});

this.main = "index.js";
