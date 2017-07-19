const check = (src, attr) => {
  console.log('Inside CHECK: ', attr);
  console.log('Source: ', src.path());
  console.log('Source mode: ', src.mode());
  return src.path().includes('.txt') ? 0 : -30;
};

export { check };
