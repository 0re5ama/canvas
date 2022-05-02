function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function gen () {
  fnBasis();
  let domain = document.querySelector('#domain').value;
  let codomain = document.querySelector('#codomain').value;
  let rel = document.querySelector('#rel').value;

  rname = rel.split(':')[0];
  r = rel.split(':')[1];

  dd = domain.split(':')[0];
  d = domain.split(':')[1];

  cdcd = codomain.split(':')[0];
  cd = codomain.split(':')[1];



  darr = d.split(',');
  cdarr = cd.split(',');

  rarr = (',' + r).split(')').slice(0,-1).map(x => x.substring(2));

  ctx.font = "italic 18px Cambria";
  dlen = darr.length;
  cdlen = cdarr.length;

  dgap = 150 / (dlen + 1);
  cdgap = 150 / (cdlen + 1);

  dpoints = darr.map((x, i) => [100 - 5, 25 + 4.5 + dgap * (i + 1)]);
  darr.map((x, i) => {
    if ('0123456789'.includes(x.toString()[0]))
      ctx.font = "18px Cambria";
    else
      ctx.font = "italic 18px Cambria";

    ctx.fillText(x, ...dpoints[i])
  });

  cdpoints = cdarr.map((x, i) => [210 - 5, 25 + 4.5 + cdgap * (i + 1)]);
  cdarr.map((x, i) => {
    if ('0123456789'.includes(x.toString()[0]))
      ctx.font = "18px Cambria";
    else
      ctx.font = "italic 18px Cambria";
    ctx.fillText(x, ...cdpoints[i])
  });

  ctx.fillText(dd, 100 - 5, 25 - 10);
  ctx.fillText(cdcd, 210 - 5, 25 - 10)
  ctx.fillText(rname, 150, 0);

  arrarr = rarr.map(x => {
    pi = x.split(',')[0];
    im = x.split(',')[1];
    dix = 25 + dgap * (darr.indexOf(pi) + 1);
    cdix = 25 + cdgap * (cdarr.indexOf(im) + 1);
    from_x = 100 + 10;
    from_y = dix;
    to_x = 210 - 10;
    to_y = cdix;
    return [from_x, from_y, to_x, to_y];
  });

  ctx.beginPath();
  arrarr.map(x => canvas_arrow(ctx,...x));
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(155,110,100,-Math.PI / 3.1,Math.PI + Math.PI / 3.1,true);
  ctx.stroke();

  tox = 155;
  toy = 10;
  headlen = 10;
  angle = Math.atan2(0, 5);
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function clear () {
  domain = 'A:1,2,3';
  codomain = 'B:a,b,c';
  rel = 'f:(1,a),(2,b),(3,c)';
  document.querySelector('#domain').value = domain;
  document.querySelector('#codomain').value = codomain;
  document.querySelector('#rel').value = rel;

  clearCanvas();
}

function clearCanvas() {
  cc = document.getElementById('canvas');
  cc.width = 200;
  cc.height = 200;
  ctx = cc.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.setTransform(1, 0, 0, 1, -50,20);
  return ctx;
}

function fnBasis () {
  let ctx = clearCanvas();

  ctx.beginPath();
  ctx.ellipse(100, 100, 30, 75, 0, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(210, 100, 30, 75, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

function txBasis () {
  let ctx = clearCanvas();
}

clear();

function Transformation (data) {
  var self = this;
  self.tx = ko.observable(1);
  self.txData = ko.observable();
  self.tx.subscribe(x => {
    self.txData(null);
  });
}

function canVM () {
  var self = this;
  self.chapters = [
    { id: 1, name: 'Function', ctxClear: fnBasis },
    { id: 2, name: 'Transformation', ctxClear: txBasis },
  ];

  self.txs = [
    { id: 1, name: 'Reflection' },
    { id: 2, name: 'Rotation' },
    { id: 3, name: 'Translation' },
    { id: 4, name: 'Enlargement' },
  ];
  self.chapter = ko.observable(1);

  self.txList = ko.observableArray([new Transformation({})]);

  self.addTx = () => {
    self.txList.push(new Transformation({}));
  };

  self.rmTx = data => {
    self.txList.remove(data);
  };

  self.chapter.subscribe(ch => {
    console.log(ch);
    self.chapters[ch - 1].ctxClear();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ko.applyBindings(new canVM());
});
