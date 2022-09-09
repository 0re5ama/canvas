const WIDTH = 400;
const HEIGHT = 400;
const VENNGAP = 150;
const VENNWIDTH = 100;
const VENNHEIGHT = 100;
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

function gen (domain, codomain, rel) {
	fnBasis();

	rname = rel.split(':')[0];
	r = rel.split(':')[1];

	dd = domain.split(':')[0];
	d = domain.split(':')[1];

	cdcd = codomain.split(':')[0];
	cd = codomain.split(':')[1];

	darr = d.split(',');
	cdarr = cd.split(',').map(x => +x);

	rarr = (',' + r).split(')').slice(0,-1).map(x => x.substring(2));

	ctx.font = "italic 18px Cambria";
	dlen = darr.length;
	cdlen = cdarr.length;

	dgap = VENNGAP / (dlen + 1);
	cdgap = VENNGAP / (cdlen + 1);

	dpoints = darr.map((x, i) => [-VENNWIDTH - 5, -VENNWIDTH + 25 + 4.5 + dgap * (i + 1)]);
	darr.map((x, i) => {
		if ('0123456789'.includes(x.toString()[0]))
		ctx.font = "18px Cambria";
		else
		ctx.font = "italic 18px Cambria";

		ctx.fillText(x, ...dpoints[i])
	});

	cdpoints = cdarr.map((x, i) => [VENNWIDTH - 5, -VENNWIDTH + 25 + 4.5 + cdgap * (i + 1)]);
	cdarr.map((x, i) => {
		if ('0123456789'.includes(x.toString()[0]))
		ctx.font = "18px Cambria";
		else
		ctx.font = "italic 18px Cambria";
		ctx.fillText(x, ...cdpoints[i])
	});

	ctx.font = "italic 18px Cambria";
	ctx.fillText(dd, -VENNWIDTH - 5, -VENNWIDTH + 25 - 10);
	ctx.fillText(cdcd, VENNWIDTH - 5, -VENNWIDTH + 25 - 10)
	ctx.fillText(rname, 0, -115);

	arrarr = rarr.map(x => {
		pi = x.split(',')[0];
		im = x.split(',')[1];
		dix = -VENNWIDTH + 25 + dgap * (darr.indexOf(pi) + 1);
		cdix = -VENNWIDTH + 25 + cdgap * (cdarr.indexOf(+im) + 1);
		from_x = -VENNWIDTH + 10;
		from_y = dix;
		to_x = VENNWIDTH - 10;
		to_y = cdix;
		return [from_x, from_y, to_x, to_y];
	});

	ctx.beginPath();
	arrarr.map(x => canvas_arrow(ctx,...x));
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(0, 95, 200,-Math.PI / 3.1,Math.PI + Math.PI / 3.1,true);
	ctx.stroke();

	tox = 0;
	toy = -105;
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
	cc.width = WIDTH;
	cc.height = HEIGHT;
	ctx = cc.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.lineWidth = 2;
	const W = ctx.canvas.width, H = ctx.canvas.height;
	// ctx.setTransform(1, 0, 0, 1, -50,20);
	ctx.translate(canvas.width/2,canvas.height/2);
	return ctx;
}

function fnBasis () {
	let ctx = clearCanvas();

	ctx.beginPath();
	ctx.ellipse(-VENNWIDTH, 0, 30, VENNHEIGHT - 25, 0, 0, 2 * Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.ellipse(VENNWIDTH, 0, 30, VENNHEIGHT - 25, 0, 0, 2 * Math.PI);
	ctx.stroke();

	return ctx;
}

function txBasis () {
	let ctx = clearCanvas();

	ctx.beginPath();
	canvas_arrow(ctx, 0, HEIGHT / 2, 0, -HEIGHT / 2);
	canvas_arrow(ctx, -WIDTH / 2, 0, WIDTH / 2, 0);
	ctx.stroke();

	return ctx;
}

clear();

function transform (input, tx, basis) {
	let ref = basis.split(' ').join('').toLowerCase();
	if (tx == 1) { // Reflection
		mapper = pt => {
			let fn = x => x;

			switch (ref) {
				case 'y=0':
				case 'x-axis':
				case 'xaxis':
					fn = x => ({
						p: x.p + "'",
						x: x.x,
						y: -x.y,
					});
					break;
				case 'x=0':
				case 'y-axis':
				case 'yaxis':
					fn = x => ({
						p: x.p + "'",
						x: -x.x,
						y: x.y,
					});
					break;
				case 'y=x':
				case 'x=y':
					fn = x => ({
						p: x.p + "'",
						x: x.y,
						y: x.x,
					});
					break;
				default:
				if (ref.match(/x\s*=\s*-?\d+/)) {
					let h = +ref.match(/x\s*=\s*(-?\d+)/)[1];
					fn = x => ({
						p: x.p + "'",
						x: 2 * h - x.x,
						y: x.y,
					});
				} else if (ref.match(/y\s*=\s*-?\d+/)) {
					let k = +ref.match(/y\s*=\s*(-?\d+)/)[1];
					fn = x => ({
						p: x.p + "'",
						x: x.x,
						y: 2 * k - x.y,
					});
				}
				break;
			}
			let res = fn(pt);
			return res;
		}
	} else if (tx == 3) { // Translation
		mapper = pt => {
			if (ref.match(/\(-?\d+,\s*-?\d+\),\s*\(-?\d+,\s*-?\d+\)/)) {
				let arr = ref.match(/\((-?\d+),\s*(-?\d+)\),\s*\((-?\d+),\s*(-?\d+)\)/);
				let v = {
					x: +arr[3] - arr[1],
					y: +arr[4] - arr[2],
				};

				return {
					p: pt.p + "'",
					x: pt.x + v.x,
					y: pt.y + v.y,
				};
			} else if (ref.match(/\(-?\d+,\s*-?\d+\)/)) {
				let arr = ref.match(/\((-?\d+),\s*(-?\d+)\)/);
				let v = {
					x: +arr[1],
					y: +arr[2]
				};

				return {
					p: pt.p + "'",
					x: pt.x + v.x,
					y: pt.y + v.y,
				};
			}
		}
	} else if (tx == 2) {
		mapper = pt => {
			if (ref.match(/\[\(-?\d+,\s*-?\d+\),\s*[+-]?\d+\]/)) {
				let arr = ref.match(/\[\((-?\d+),\s*(-?\d+)\),\s*([+-]?\d+)\]/);
				let [a, b, theta] = arr.slice(1).map(Number);
				switch (theta) {
					case 90:
					case -270:
						return {
							p: pt.p + "'",
							x: -pt.y + a + b,
							y: pt.x - a + b,
						};
					case -90:
					case 270:
						return {
							p: pt.p + "'",
							x: pt.y + a - b,
							y: -pt.x + a + b,
						};
					case 180:
					case -180:
						return {
							p: pt.p + "'",
							x: -pt.x + 2 * a,
							y: -pt.y + 2 * b,
						};
				}
			}
		}
	} else if (tx == 4) {
		mapper = pt => {
			if (ref.match(/\[\(-?\d+,\s*-?\d+\),\s*[+-]?[0-9/.]+\]/)) {
				let arr = ref.match(/\[\((-?\d+),\s*(-?\d+)\),\s*([+-]?[0-9/.]+)\]/);
				let [a, b, k] = arr.slice(1).map(Number);
				return {
					p: pt.p + "'",
					x: k * (pt.x - a) + a,
					y: k * (pt.y - b) + b,
				};
			}
		}
	}

	let out = input.map(mapper);
	return out;
}

function Transformation (data) {
	let list = ['y=x', 'x-axis', 'y-axis', 'x=0', 'y=0'];
	let rnd = Math.floor(Math.random() * 5);
	var self = this;
	self.tx = ko.observable(1);
	self.txData = ko.observable(list[rnd]);
	self.txImage = ko.observable();
	self.tx.subscribe(x => {
		self.txData(null);
	});
}

function strToPt (str) {
	let pts = str.match(/[A-Z]'*\s*\(-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?\)/g)
	.map(x => x.split(' ').join(''));

	return pts.map(ptStr => {
		let ptArr = ptStr.match(/([A-Z]'*)\s*\(((-?)\d+(\.\d+)?),(\s*(-?)\d+(\.\d+)?)\)/);
		return {
			p: ptArr[1],
			x: +ptArr[2],
			y: +ptArr[5],
		};
	});
}

function plot (ctx, pts, scale = 10) {
	ctx.beginPath();
	start = pts[0];
	ctx.moveTo(start.x * scale, -start.y * scale);
	ctx.fillText(start.p + '(' + start.x + ', ' + start.y + ')', start.x * scale, -start.y * scale);
	pts.slice(1).map(pt => {
		ctx.lineTo(pt.x * scale, -pt.y * scale)
		ctx.fillText(pt.p + '(' + pt.x + ', ' + pt.y + ')', pt.x * scale, -pt.y * scale);
	});
	ctx.closePath();
	ctx.stroke();
}

function canVM () {
	var self = this;

	self.txPts = ko.observable('A(1,2), B(5,2), C(3,5)');

	self.ctx = ko.observable();

	self.domain = ko.observable('1,2,3');
	self.codomain = ko.observable('5,7,9,10');
	self.relation = ko.observable('');

	self.domainName = ko.observable('A');
	self.codomainName = ko.observable('B');
	self.relName = ko.observable('f');

	self.fn = ko.observable();
	self.f = ko.computed (() => self.fn() ? math.evaluate('f(x) = ' + self.fn()) : null);
	self.f.subscribe(f => {
		if (self.f()) {
			self.relation(
			self.domain()
					.split(',')
				.map(x => `(${x}, ${f(+x)})`)
				.join(',')
			);
		}
	});
	self.fn('2x+3');

	self.fn.subscribe(f => {
		// self.relation();
	});

	self.fnGen = () => {
		gen(
			self.domainName() + ':' + self.domain(),
			self.codomainName() + ':' + self.codomain(),
			self.relName() + ':' + self.relation()
		);
	};

	self.txGen = () => {
		let arr = [];
		self.ctx(self.chapters[self.chapter() - 1].ctxClear());
		self.ctx().beginPath();
		let start = strToPt(self.txPts());
		// plot(self.ctx(), start);
		arr.push(start);
		self.txList().reduce((a, b) => {
			let pt = transform(a, b.tx(), b.txData());
			b.txImage(pt.map(x => x.p + '(' + x.x + ', ' + x.y + ')').join(', '));
			arr.push(pt);
			// plot(self.ctx(), pt);
			return pt;
			}, start);

		let max = Math.max(...arr.map(x => x.map(y => [y.x, y.y]).flat()).flat().map(x => Math.abs(x)));
		scale = (WIDTH / 2 - 50) / max;
		arr.map(x => plot(self.ctx(), x, scale));
	};

	self.chapters = [
		{ id: 1, name: 'Function', ctxClear: fnBasis, gen: self.fnGen },
		{ id: 2, name: 'Transformation', ctxClear: txBasis, gen: self.txGen },
	];

	self.txs = [
		{ id: 1, name: 'Reflection' },
		{ id: 2, name: 'Rotation' },
		{ id: 3, name: 'Translation' },
		{ id: 4, name: 'Enlargement' },
	];
	self.chapter = ko.observable();

	self.gen = ko.computed(() => {
		return self.chapter()
			? self.chapters[self.chapter() - 1].gen
			: (() => {});
	});

	self.txList = ko.observableArray([new Transformation({})]);

	self.addTx = () => {
		self.txList.push(new Transformation({}));
	};

	self.rmTx = data => {
		self.txList.remove(data);
	};

	self.chapter(1);

	self.generate = () => self.gen()();

}

document.addEventListener('DOMContentLoaded', () => {
	ko.applyBindings(new canVM());
});
