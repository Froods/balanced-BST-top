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

	/// Functional methos

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
	deleteItem(value) {}
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
prettyPrint(test.root);
