Object.keys(this).forEach(k => {
  if (k !== "version") delete this[k];
});
this.main = "index.js";
