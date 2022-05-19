Object.defineProperties(Array.prototype, {
	first: {
		get() { return this[0]; },
		set() { this[0] = v; }
	},
	last: {
		get() { return this[this.length - 1]; },
		set(v) { this[this.length - 1] = v; }
	}
});

const app = document.getElementById("app"),
data = [
	[10, "충년", "沖年"],

	[15, "지학", "志學"],

	[16, "과년", "瓜年"],

	[20, "방년", "芳年"],
	[20, "약관", "弱冠"],
	[20, "묘령", "妙齡"],

	[30, "이립", "而立"],

	[40, "불혹", "不惑"],

	[48, "상년", "桑年"],
	[48, "상수", "桑壽"],

	[50, "지천명", "知天命"],
	[50, "지명", "知命"],
	[50, "애년", "艾年"],

	[60, "이순", "耳順"],
	[60, "육순", "六旬"],

	[61, "환갑", "還甲"],
	[61, "화갑", "華甲"],
	[61, "환력", "還曆"],
	[61, "회갑", "回甲"],

	[62, "진갑", "進甲"],

	[70, "고희", "古稀"],
	[70, "종심", "從心"],

	[77, "희수", "喜壽"],

	[80, "산수", "傘壽"],

	[88, "미수", "米壽"],

	[90, "졸수", "卒壽"],
	[90, "동리", "凍梨"],

	[99, "백수", "白壽"],

	[100, "기이지수", "期頥之壽"]
]
const sCell = {
	pri: {
		defProps(value, color) {
			let 
				_value = value,
				_color = color;
			Object.defineProperties(this, {
				value: {
					get() {
						return _value;
					},
					set(v) {
						_value = v;
						this.elem.innerText = v;
					},
					enumerable: true
				},
				color: {
					get() {
						return _color;
					},
					set(v) {
						_color = v;
						this.elem.style.backgroundColor = v;
					},
					enumerable: true
				}
			});
			this.initProp = {value, color};
		},
		setStyle() {
			this.elem.innerText = this.value;
			this.elem.style.display = "grid";
			this.elem.style.alignContent = "center"
			this.elem.style.backgroundColor = this.color;
			this.elem.style.padding = "5px";
		},
		setEvnet(eHendler) {
			eHendler = eHendler 
			? eHendler 
			: e => this.value = this.value === "　" ? this.initProp.value : "　";
			this.elem.addEventListener("mousedown", eHendler);
		},
		init(value, color, eHendler) {
			const here = sCell.pri;
			here.defProps.call(this, value, color);
			here.setStyle.call(this);
			here.setEvnet.call(this, eHendler);
		}
	}
}
class Cell {
	constructor(props = {}) {
		const {value, className, color = "#e5bcda", handler} = props;
		this.elem = document.createElement("div");
		this.elem.className = className;
		this.elem.cell = this;
		sCell.pri.init.call(this, value, color, handler);
	}
}
const sRow = {
	pri: {
		setStyle() {
			this.elem.style.display = "grid";
			this.elem.style.gridTemplateColumns = `repeat(${this.length}, 1fr)`;
			this.elem.style.justifyItems = "stretch";
			this.elem.style.textAlign = "center";
			this.elem.style.backgroundColor = "#222222";
			this.elem.style.gridColumnGap = "10px";
			// this.elem.style.height = "100%";
		},
		init() {
			const here = sRow.pri;
			here.setStyle.call(this);
			this.forEach(cell => {
				this.elem.appendChild(cell.elem);
				this.data.push(cell.value);
			});
		}
	}
}
class Row extends Array {
	constructor() {
		super();
		this.data = [];
		this.elem = document.createElement("div");
		this.push(...arguments);
		sRow.pri.init.call(this);
	}
	shuffle() {
		const frag = document.createDocumentFragment();
		this.forEach(cell => this.elem.removeChild(cell.elem));
		this.sort(() => Math.random() - 0.5);
		this.forEach(cell => frag.appendChild(cell.elem));
		this.elem.appendChild(frag);
	}
	init() {
		this.data.forEach((value, i) => this[i].value = value);
	}
}

class Title extends Row {
	constructor() {
		super(...arguments);
		this.selected = new Set();
	}
	has(index) {
		return this.selected.has(index);
	}
	add(index) {
		this.selected.add(index);
	}
	delete(index) {
		this.selected.delete(index);
	}
}


const sController = {
	pri: {
		createRow(data = []) {
			const cells = [];
			data.forEach(data => cells.push(new Cell({value: data})));
			return new Row(...cells);
		},
		init() {
			const here = sController.pri;
		}
	}
}
class Controller extends Array{
	constructor() {
		super();
		this.elem = document.createElement("div");
		sController.pri.init.call(this);
	}
}

const sMatrix = {
	pri: {
		elem: {
			wrap() {
				const elem = document.createElement("div");
				elem.style.display = "grid";
				elem.style.justifyContent = "center";
				return elem;
			},
			block(className) {
				const elem = document.createElement("div");
				elem.className = className;
				elem.style.display = "grid";
				elem.style.gridGap = "10px";
				elem.style.backgroundColor = "#131313";
				elem.style.padding = "13px";
				elem.style.userSelect = "none";
				elem.style.width = "400px";
				return elem;
			}
		},
		getMaxArrayLength(data = []) {
			let result = 0;
			data.forEach(arr => {
				if(result < arr.length) result = arr.length;
			});
			return result;
		},
		dataTrim(data = []) {
			data.forEach(arr => {
				if(arr.length < this.columnCount)
					for(let i=0, length = this.columnCount-arr.length; i<length; i++) arr.push("");
			});
		},
		controller: {
			events: {
				init() {
					this.init();
				},
				shuffle: {
					x() {
						this.xShuffle();
					},
					y() {
						this.yShuffle();
					},
					xy() {
						this.shuffle();
					}
				},
				hide() {
					if(this.title.selected.size) {
						this.title.selected.forEach(index => {
							this.forEach(row => {
								row[Number(index) - 1].value = "　";
							});
						});
					}
				},
				reset() {
					if(this.title.selected.size) {
						this.title.selected.forEach(index => {
							this.forEach(row => {
								row[Number(index) - 1].value = row[Number(index) - 1].initProp.value;
							});
						});
					}
				}
			},
			create() {
				function props(value, color, handler, className) {
					return {value, color, handler, className};
				}
				const e = sMatrix.pri.controller.events, color = "#dd74c1", cells = [
					new Cell(props("init", color, e.init.bind(this))),
					new Cell(props("x", color, e.shuffle.x.bind(this))),
					new Cell(props("y", color, e.shuffle.y.bind(this))),
					new Cell(props("x, y", color, e.shuffle.xy.bind(this))),

					new Cell(props("hide", color, e.hide.bind(this), "hide")),
					new Cell(props("reset", color, e.reset.bind(this), "reset"))
				];
				return new Row(...cells);
			}
		},
		title: {
			create() {
				const cells = [], handler = e => {
					const index = e.target.innerText,
					color = e.target.cell.initProp.color, changeColor = "#ef37be";
					if(this.title.has(index)) {
						this.title.delete(index);
						e.target.cell.color = color;
					}
					else {
						this.title.add(index);
						e.target.cell.color = changeColor;
					}
				};
				for(let i=1; i<=this.columnCount; i++) cells.push(new Cell({
					value: i, color: "#dd74c1", handler
				}));
				return new Title(...cells);
			}
		},
		createRow(data = []) {
			const cells = [];
			data.forEach(data => cells.push(new Cell({value: data})));
			return new Row(...cells);
		},
		createMatrix(data = []) {
			const here = sMatrix.pri, result = [];
			data.forEach(data => result.push(here.createRow(data)));
			return result;
		},
		setup: {
			controller() {
				const 
					controller = this.elem.getElementsByClassName("controller")[0],
					elem = this.controller.elem,
					hideButton = elem.getElementsByClassName("hide")[0],
					resetButton = elem.getElementsByClassName("reset")[0];
				elem.style.gridTemplateColumns = "repeat(4, 1fr)";
				elem.style.gridTemplateRows = "repeat(2, 1fr)";
				elem.style.gridGap = "10px";
				hideButton.style.gridColumn = "1/3";
				resetButton.style.gridColumn = "3/5";

				controller.appendChild(elem);
				
			},
			title() {
				const title = this.elem.getElementsByClassName("title")[0];
				title.appendChild(this.title.elem);
			},
			content() {
				const content = this.elem.getElementsByClassName("content")[0];
				this.forEach(row => content.appendChild(row.elem));
			},
			main(data) {
				const parent = sMatrix.pri, here = parent.setup;

				this.controller = parent.controller.create.call(this);
				this.title = parent.title.create.call(this);
				this.push(...parent.createMatrix(data));
				here.controller.call(this);
				here.title.call(this);
				here.content.call(this);
			}
		},
		setElem() {
			const here = sMatrix.pri;
			this.elem = here.elem.wrap();
			this.controllerElem = here.elem.block("controller");
			this.titleElem = here.elem.block("title");
			this.contentElem = here.elem.block("content");
		},
		appendElem() {
			console.log(this.title);
			this.elem.appendChild(this.controllerElem);
			this.elem.appendChild(this.titleElem);
			this.elem.appendChild(this.contentElem);
		},
		init(data) {
			const here = sMatrix.pri;
			here.setElem.call(this);
			here.appendElem.call(this);

			this.columnCount = here.getMaxArrayLength(data);

			here.dataTrim.call(this, data);
			here.setup.main.call(this, data);
		}
	}
}

class Matrix extends Array {
	constructor(data = []) {
		super();
		this.data = data;
		this.elem;
		this.contentElem;
		this.controller;
		this.controllerElem;
		this.columnCount = 0;
		this.title;
		this.titleElem;
		sMatrix.pri.init.call(this, data);
	}
	xShuffle() {
		this.forEach(row => row.shuffle());
	}
	yShuffle() {
		const frag = document.createDocumentFragment();
		this.forEach(row => this.contentElem.removeChild(row.elem));
		this.sort(() => Math.random() - 0.5);
		this.forEach(row => frag.appendChild(row.elem));
		this.contentElem.appendChild(frag);
	}
	shuffle() {
		this.xShuffle();
		this.yShuffle();
	}
	init() {
		this.forEach((row, i) => {
			row.forEach((cell, j) => {
				cell.value = this.data[i][j];
			});
		});
	}
	render(target) {
		target.appendChild(this.elem);
	}
}

const matrix = new Matrix(data);
matrix.render(app);
// matrix.yShuffle();
// matrix.xShuffle();