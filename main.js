import { mergeSort, removeDupes } from './mergeSort.js';

/// Classes

class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
	}
}

class Tree {
	constructor(arr) {
		this.root = buildTree(removeDupes(mergeSort(arr))); // Sort and clean up array, then build tree from array
	}

	/// Helper methods

	// Check left values and try insertion
	checkLeftValues(value, node) {
		let cur = node;

		while (value < cur.data) {
			// If value is less than end node, and node has no left child -> create new end note on the left
			if (cur.left === null) {
				cur.left = new Node(value);
				return false;
			}

			cur = cur.left; // Move on if value is less than node, and node has a left child
		}

		// If value is greater than current node, check the right values - return the return value of checkRightValues()
		if (value > cur.data) {
			return this.checkRightValues(value, cur);
		}

		if (this.valueEqualsRoot(value, cur.data)) return true; // Cancel if value equals root
	}

	// Check right values and try insertion
	checkRightValues(value, node) {
		let cur = node;

		while (value > cur.data) {
			// If value is greater than end node, and node has no right child -> create new end note on the right
			if (cur.right === null) {
				cur.right = new Node(value);
				return false;
			}

			cur = cur.right; // Move on if value is greater than node, and node has a right child
		}

		// If value is less than current node, check the left values - return the return value of checkLeftValues()
		if (value < cur.data) {
			return this.checkLeftValues(value, cur);
		}

		if (this.valueEqualsRoot(value, cur.data)) return true; // Cancel if value equals root
	}

	// Check if value and node are equal
	valueEqualsRoot(value, rootData) {
		if (value === rootData) return true;
		return false;
	}

	// Search left and return match
	searchLeft(value, node) {
		let curNode = node;
		let prevNode = node;

		// Go down left branches until value isn't less than current iteration of node
		while (value < curNode.data) {
			if (curNode.left === null) {
				return false; // Return false if current node doesn't have a left child
			}

			prevNode = curNode;
			curNode = curNode.left;
		}

		if (value === curNode.data) {
			return [curNode, prevNode]; // Return the current node and previous node if value matches
		}

		if (value > curNode.data) {
			return this.searchRight(value, curNode); // Go down right branch if value is greater than current node
		}
	}

	// Search right and return match
	searchRight(value, node) {
		let curNode = node;
		let prevNode = node;

		// Go down right branches until value isn't greater than current iteration of node
		while (value > curNode.data) {
			if (curNode.right === null) {
				return false; // Return false if current node doesn't have a right child
			}

			prevNode = curNode;
			curNode = curNode.right;
		}

		if (value === curNode.data) {
			return [curNode, prevNode]; // Return the current node and previous node if value matches
		}

		if (value < curNode.data) {
			return this.searchLeft(value, curNode); // Go down left branch if value is less than current node
		}
	}

	// Pre order traversal
	preOrderTraversal(node, cb) {
		if (node === null) return;

		cb(node);
		this.preOrderTraversal(node.left, cb);
		this.preOrderTraversal(node.right, cb);
	}

	// In order traversal
	inOrderTraversal(node, cb) {
		if (node === null) return;

		this.inOrderTraversal(node.left, cb);
		cb(node);
		this.inOrderTraversal(node.right, cb);
	}

	// Post order traversal
	postOrderTraversal(node, cb) {
		if (node === null) return;

		this.postOrderTraversal(node.left, cb);
		this.postOrderTraversal(node.right, cb);
		cb(node);
	}

	/// Functional methods

	// Insertion
	insert(value) {
		if (this.valueEqualsRoot(value, this.root.data)) return null; // Cancel if value equals root

		// Value is less than root:
		if (value < this.root.data) {
			let valueIsDupe = this.checkLeftValues(value, this.root); // Check left subtree - If value is a duplicate, return true to variable
			if (valueIsDupe) return null; // Cancel if value is a dupe
		}

		// Value is greater than root:
		if (value > this.root.data) {
			let valueIsDupe = this.checkRightValues(value, this.root); // Check right subtree - If value is a duplicate, return true to variable
			if (valueIsDupe) return null; // Cancel if value is a dupe
		}
	}

	// Deletion
	deleteItem(value) {
		// Check if value equals root
		if (this.valueEqualsRoot(value, this.root.data)) {
			// If root is the only node in tree
			if (this.root.left === null && this.root.right === null) {
				return;
			}

			if (this.root.left !== null && this.root.right === null)
				this.root = this.root.left; // If root only has left node

			if (this.root.left === null && this.root.right !== null)
				this.root = this.root.right; // If root only has right node

			// If root has two children
			if (this.root.left !== null && this.root.right !== null) {
				let curNode = this.root.right;
				let prevNode = this.root;
				let root = this.root;

				while (curNode.left !== null) {
					// Go down to the lowest value on right branch
					prevNode = curNode;
					curNode = curNode.left;
				}

				// If roots right child is a leaf
				if (curNode.left === null && prevNode === root) {
					this.root = curNode;
					curNode.left = root.left;
					return;
				}

				if (curNode.right !== null) {
					// If lowest value has a right child, make it the left child of the previous node
					prevNode.left = curNode.right;
				} else {
					prevNode.left = null;
				}

				// Set new roots children as old roots children and set new root as the root
				this.root = curNode;
				curNode.right = root.right;
				curNode.left = root.left;
			}
		}

		/// ### find node matching input value
		let nodeArr = false;
		let unwantedNode = false;
		let prevNode = null;

		// --- Value lower than root
		if (value < this.root.data) {
			nodeArr = this.searchLeft(value, this.root);
		}

		// --- Value greater than root
		if (value > this.root.data) {
			nodeArr = this.searchRight(value, this.root);
		}

		// --- Assign unwanted node and previous node to variables
		if (nodeArr === false) {
			return null; // Cancel if no node matched
		} else {
			prevNode = nodeArr[1];
			unwantedNode = nodeArr[0];
		}

		/// ### Cases if node exists

		// --- If node is a leaf
		if (unwantedNode.left === null && unwantedNode.right === null) {
			if (unwantedNode.data < prevNode.data) {
				prevNode.left = null;
			}

			if (unwantedNode.data > prevNode.data) {
				prevNode.right = null;
			}
		}

		// --- If node has one child
		// Unwanted node has right child
		if (unwantedNode.left === null) {
			if (unwantedNode.data < prevNode.data) {
				prevNode.left = unwantedNode.right;
			}

			if (unwantedNode.data > prevNode.data) {
				prevNode.right = unwantedNode.right;
			}
		}
		// Unwanted node has left child
		if (unwantedNode.right === null) {
			if (unwantedNode.data < prevNode.data) {
				prevNode.left = unwantedNode.left;
			}

			if (unwantedNode.data > prevNode.data) {
				prevNode.right = unwantedNode.left;
			}
		}

		// --- If node has two children
		if (unwantedNode.left !== null && unwantedNode.right !== null) {
			let curNode = unwantedNode.right;
			let prevToCurNode = unwantedNode;

			// If unwanted nodes right child is leaf
			if (curNode.left === null && curNode.right === null) {
				if (unwantedNode.data > prevNode.data) {
					unwantedNode.right = null;
					curNode.left = unwantedNode.left;
					prevNode.right = curNode;
				}
				if (unwantedNode.data < prevNode.data) {
					unwantedNode.right = null;
					curNode.left = unwantedNode.left;
					prevNode.left = curNode;
				}
				return;
			}

			// Else
			while (curNode.left !== null) {
				prevToCurNode = curNode;
				curNode = curNode.left;
			}

			if (unwantedNode.data > prevNode.data) {
				prevToCurNode.left = null;
				curNode.left = unwantedNode.left;
				curNode.right = unwantedNode.right;
				prevNode.right = curNode;
			}
			if (unwantedNode.data < prevNode.data) {
				prevToCurNode.left = null;
				curNode.left = unwantedNode.left;
				curNode.right = unwantedNode.right;
				prevNode.left = curNode;
			}
		}
	}

	// Find a given value
	find(value) {
		let curNode = this.root;

		// Search through tree
		while (curNode !== null) {
			// Return current node if value matches
			if (value === curNode.data) {
				return curNode;
			}

			// If value is less than current node, go left
			if (value < curNode.data) {
				curNode = curNode.left;
				continue;
			}

			// If value is greater than current node, go right
			if (value > curNode.data) {
				curNode = curNode.right;
				continue;
			}
		}

		return null;
	}

	// Apply function to each node (breadth first)
	levelOrderForEach(cb) {
		// Throw error if cb isn't a function
		if (typeof cb !== 'function') {
			throw new Error('A callback is required for this function!');
		}

		const queue = [this.root];

		// Go through queue
		while (queue.length > 0) {
			// If node has children, add them to queue
			if (queue[0].left !== null) queue.push(queue[0].left);
			if (queue[0].right !== null) queue.push(queue[0].right);

			// Perform callback on node and remove it from queue
			cb(queue[0]);
			queue.shift();
		}
	}

	// Apply function to each node (depth first - pre order)
	preOrderForEach(cb) {
		// Throw error if cb isn't a function
		if (typeof cb !== 'function') {
			throw new Error('A callback is required for this function!');
		}

		this.preOrderTraversal(this.root, cb);
	}

	// Apply function to each node (depth first - in order)
	inOrderForEach(cb) {
		// Throw error if cb isn't a function
		if (typeof cb !== 'function') {
			throw new Error('A callback is required for this function!');
		}

		this.inOrderTraversal(this.root, cb);
	}

	// Apply function to each node (depth first - post order)
	postOrderForEach(cb) {
		// Throw error if cb isn't a function
		if (typeof cb !== 'function') {
			throw new Error('A callback is required for this function!');
		}

		this.postOrderTraversal(this.root, cb);
	}

	// Height
	height(value) {
		let node = this.find(value);
		if (node === null) return null; // If node doesn't exist in tree, return null

		if (node.left === null && node.right === null) return 0; // If node is a leaf, return 0

		let height = 0;
		let queue = [];
		let children = [];
		let endReached = false;

		// Push children into queue
		if (node.left !== null) {
			queue.push(node.left);
		}
		if (node.right !== null) {
			queue.push(node.right);
		}

		// Until all queued nodes are leafnotes, increase height for each level
		while (!endReached) {
			height++;

			// Check children of each node in queue, only push children into array if they aren't null
			for (let i = 0; i < queue.length; i++) {
				if (queue[i].left !== null) {
					children.push(queue[i].left);
				}

				if (queue[i].right !== null) {
					children.push(queue[i].right);
				}
			}

			// If all array is empty, all children are null, which means we're at the last level -> so exit loop
			if (children.length === 0) {
				endReached = true;
				continue;
			}

			// Clear the queue -> Push children into queue -> Clear children array
			queue.length = 0;
			for (let child of children) {
				queue.push(child);
			}
			children.length = 0;
		}

		return height;
	}

	// Depth
	depth(value, init = true, curNode = this.root) {
		// Initialization: Check if node exists
		if (init === true) {
			let node = this.find(value);
			if (node === null) return null;
		}

		// Exit recursion when current node matches value
		if (curNode.data === value) return 0;

		// Go left and increase depth if value is less than current node
		if (value < curNode.data) {
			return this.depth(value, false, curNode.left) + 1;
		}

		// Go right and increase depth if value is greater than current node
		if (value > curNode.data) {
			return this.depth(value, false, curNode.right) + 1;
		}
	}

	// Chech if tree is balanced
	isBalanced() {
		let arr = [];

		this.preOrderForEach((node) => {
			if (node.left === null && node.right === null) {
				arr.push(this.depth(node.data));
			}
		});

		let low = arr[0];
		let high = 0;

		for (let depth of arr) {
			if (depth < low) low = depth;
			if (depth > high) high = depth;
		}

		if (high - low <= 1) return true;
		if (high - low > 1) return false;
	}

	// Rebalance tree
	rebalance() {
		let arr = [];

		this.preOrderForEach((node) => {
			arr.push(node.data);
		});

		this.root = buildTree(removeDupes(mergeSort(arr)));
	}
}

/// Functions

// Build tree
function buildTree(arr, start = 0, end = arr.length - 1) {
	if (start > end) {
		return null;
	}

	const mid = start + Math.floor((end - start) / 2); // Find mid index in array

	const root = new Node(arr[mid]); // Set root to mid index in array

	// Recursively order tree with left and right values for each node
	root.left = buildTree(arr, start, mid - 1);
	root.right = buildTree(arr, mid + 1, end);

	return root;
}

// Pretty print
const prettyPrint = (node, prefix = '', isLeft = true) => {
	if (node === null) {
		return;
	}
	if (node.right !== null) {
		prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
	}
	console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
	if (node.left !== null) {
		prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
	}
};

const test = new Tree([5, 4, 2, 6, 7, 8, 9, 9, 43, 2]);
test.insert(41);
//prettyPrint(test.root);

test.deleteItem(9);
test.insert(44);
test.insert(42);
test.insert(42.5);
prettyPrint(test.root);

test.rebalance();
prettyPrint(test.root);
