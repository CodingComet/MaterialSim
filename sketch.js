function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

let grid;
let cols;
let rows;
let material_slider;
let brush_slider;
let box_tool;
let resolution = 4;
let using_box = false;
let rect_corners;
let flamables = [4];
let neighbor;
let backgroundImage;
let fireSpeed = 25;
let fireTimer = 0;

function myCheckedEvent() {
	using_box = !using_box;
}

function setup() {
	createCanvas(600, 600);
	material_slider = createSlider(0, 6, 3, 1);
	brush_slider = createSlider(0, 5, 0, 1);
	checkbox = createCheckbox('rect', false);
	checkbox.changed(myCheckedEvent);
	cols = round(width / resolution);
	rows = round(height / resolution);

	grid = make2DArray(cols, rows);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = 0;
		}
	}
	rect_corners = createVector(0, 0, 0, 0);
	neighbors_indices = [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(-1, 0), createVector(0, -1), createVector(-1, -1), createVector(-1, 1), createVector(1, -1)];
}



function draw() {
	background(0);

	if (mouseIsPressed) {
		posX = round(mouseX / resolution);
		posY = round(mouseY / resolution);
		if (!using_box) {
			if (resolution < mouseX < width - resolution && resolution < mouseY < height - resolution) {
				try {
					switch (brush_slider.value()) {
						case 0:
							grid[posX][posY] = material_slider.value();
							break;
						case 1:
							grid[posX][posY] = material_slider.value();
							grid[posX + 1][posY] = material_slider.value();
							grid[posX][posY + 1] = material_slider.value();
							grid[posX + 1][posY + 1] = material_slider.value();
							break;
						case 2:
							grid[posX][posY] = material_slider.value();
							grid[posX][posY + 1] = material_slider.value();
							grid[posX + 1][posY] = material_slider.value();
							grid[posX - 1][posY] = material_slider.value();
							grid[posX][posY - 1] = material_slider.value();
							break;
						case 3:
							grid[posX][posY] = material_slider.value();
							grid[posX + 1][posY] = material_slider.value();
							grid[posX][posY + 1] = material_slider.value();
							grid[posX + 1][posY + 1] = material_slider.value();
							grid[posX - 1][posY + 1] = material_slider.value();
							grid[posX + 1][posY - 1] = material_slider.value();
							grid[posX][posY - 1] = material_slider.value();
							grid[posX - 1][posY] = material_slider.value();
							grid[posX - 1][posY - 1] = material_slider.value();
							break;
						case 4:
							grid[posX][posY + 1] = material_slider.value();
							grid[posX + 1][posY + 1] = material_slider.value();
							grid[posX - 1][posY] = material_slider.value();
							grid[posX][posY] = material_slider.value();
							grid[posX + 1][posY] = material_slider.value();
							grid[posX + 2][posY] = material_slider.value();
							grid[posX - 1][posY - 1] = material_slider.value();
							grid[posX][posY - 1] = material_slider.value();
							grid[posX + 1][posY - 1] = material_slider.value();
							grid[posX + 2][posY - 1] = material_slider.value();
							grid[posX][posY - 2] = material_slider.value();
							grid[posX + 1][posY - 2] = material_slider.value();
							break;
						case 5:
							grid[posX - 1][posY + 1] = material_slider.value();
							grid[posX][posY + 1] = material_slider.value();
							grid[posX + 1][posY + 1] = material_slider.value();
							grid[posX + 2][posY + 1] = material_slider.value();
							grid[posX - 1][posY] = material_slider.value();
							grid[posX][posY] = material_slider.value();
							grid[posX + 1][posY] = material_slider.value();
							grid[posX + 2][posY] = material_slider.value();
							grid[posX - 1][posY - 1] = material_slider.value();
							grid[posX][posY - 1] = material_slider.value();
							grid[posX + 1][posY - 1] = material_slider.value();
							grid[posX + 2][posY - 1] = material_slider.value();
							grid[posX - 1][posY - 2] = material_slider.value();
							grid[posX][posY - 2] = material_slider.value();
							grid[posX + 1][posY - 2] = material_slider.value();
							grid[posX + 2][posY - 2] = material_slider.value();
							break;
					}
				} catch (error) {

				}
			}
		}
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let x = i * resolution;
			let y = j * resolution;
			if (grid[i][j] == 1) {
				fill(225, 225, 100);
				noStroke();
				rect(x, y, resolution, resolution);
			} else if (grid[i][j] == 2) {
				fill(0, 0, 255);
				noStroke();
				rect(x, y, resolution, resolution);
			} else if (grid[i][j] == 3) {
				fill(150);
				noStroke();
				rect(x, y, resolution, resolution);
			} else if (grid[i][j] == 4) {
				fill(150, 100, 75);
				noStroke();
				rect(x, y, resolution, resolution);
			} else if (grid[i][j] == 5) {
				fill(75);
				noStroke();
				rect(x, y, resolution, resolution);
			} else if (grid[i][j] == 6) {
				fill(226, 88, 34);
				noStroke();
				rect(x, y, resolution, resolution);
			}
			fixedUpdate(i, j);
		}
	}
	fireTimer++;
}

function fixedUpdate(i, j) {
	switch (grid[i][j]) {
		case 1:
			if (j < rows) {
				if (grid[i][j + 1] == 0) {
					grid[i][j + 1] = 1;
					grid[i][j] = 0;
					break;
				} else if (grid[i][j + 1] == 2) {
					grid[i][j + 1] = 1;
					grid[i][j] = 2;
					break;
				}
				if (i < cols - 1) {
					if (grid[i + 1][j + 1] == 0) {
						grid[i + 1][j + 1] = 1;
						grid[i][j] = 0;
						break;
					} else if (grid[i + 1][j + 1] == 2) {
						if (grid[i + 1][j + 1] == 0) {
							grid[i + 1][j + 1] = 1;
							grid[i][j] = 2;
							break;
						}
					}
				}
				if (i > 0) {
					if (grid[i - 1][j + 1] == 0) {
						grid[i - 1][j + 1] = 1;
						grid[i][j] = 0;
						break;
					} else if (grid[i - 1][j + 1] == 2) {
						grid[i - 1][j + 1] = 1;
						grid[i][j] = 2;
						break;
					}
				}
			}

			break;
		case 2:

			if (j < rows) {
				if (grid[i][j + 1] == 0) {
					grid[i][j + 1] = 2;
					grid[i][j] = 0;
					break;
				}
				if (i < cols - 1) {
					if (grid[i + 1][j + 1] == 0) {
						grid[i + 1][j + 1] = 2;
						grid[i][j] = 0;
						break;
					}
				}
				if (i > 0) {
					if (grid[i - 1][j + 1] == 0) {
						grid[i - 1][j + 1] = 2;
						grid[i][j] = 0;
						break;
					}
				}
			}
			if (i < cols - 1) {
				if (grid[i + 1][j] == 0) {
					grid[i + 1][j] = 2;
					grid[i][j] = 0;
					break;
				}
			}
			if (i > 0) {
				if (grid[i - 1][j] == 0) {
					grid[i - 1][j] = 2;
					grid[i][j] = 0;
					break;
				}
			}

			break;
		case 3:
			break;
		case 4:
			break;
		case 5:

			if (round(random(0, 150)) == 3) {
				grid[i][j] = 0;
				break;
			}
			if (j > 0) {
				if (grid[i][j - 1] == 0) {
					grid[i][j - 1] = 5;
					grid[i][j] = 0;
					break;
				}
				if (i < cols - 1) {
					if (grid[i + 1][j - 1] == 0) {
						grid[i + 1][j - 1] = 5;
						grid[i][j] = 0;
						break;
					}
				}
				if (i > 0) {
					if (grid[i - 1][j - 1] == 0) {
						grid[i - 1][j - 1] = 5;
						grid[i][j] = 0;
						break;
					}
				}
			}
			if (i < cols - 1) {
				if (grid[i + 1][j] == 0) {
					grid[i + 1][j] = 5;
					grid[i][j] = 0;
					break;
				}
			}
			if (i > 0) {
				if (grid[i - 1][j] == 0) {
					grid[i - 1][j] = 5;
					grid[i][j] = 0;
					break;
				}
			}

			break;
		case 6:
			if (fireTimer % fireSpeed == 0) {
				let survived = fireSuvived(i, j);
				let flamableNeighbors = survived[1];
				survived = survived[0];
				if (!survived) {
					grid[i][j] = 0;
					break;
				} else {
					neighbors_indices.forEach((item, index) => {
						grid[i + item.x][j + item.y] = 6;
					});
					break;
				}
			}
			break;

	}
}

function drawRect(x1, y1, x2, y2) {
	for (let i = min(x1, x2); i < max(x1, x2); i++) {
		for (let j = min(y1, y2); j < max(y1, y2); j++) {
			grid[i][j] = material_slider.value();
		}
	}
}

function mousePressed() {
	posX = round(mouseX / resolution);
	posY = round(mouseY / resolution);
	if (using_box) {
		rect_corners.x = posX;
		rect_corners.y = posY;
	}
}

function mouseReleased() {
	posX = round(mouseX / resolution);
	posY = round(mouseY / resolution);
	if (using_box) {
		rect_corners.z = posX;
		rect_corners.w = posY;
		drawRect(rect_corners.x, rect_corners.y, rect_corners.z, rect_corners.w);
	}
}

function fireSuvived(x, y) {
	let neighbors = new Array(8);
	let flamableNeighbors = [];
	let flamableNeighborsIndices = [];
	let result = false;
	neighbors_indices.forEach((item, index) => {
		neighbors.push(grid[x + item.x][y + item.y]);
	});
	neighbors.forEach((item, index) => {
		if (flamables.includes(item)) {
			flamableNeighbors.push(index);
			result = true;
		}
	});
	return [result, flamableNeighbors];
}
