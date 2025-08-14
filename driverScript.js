import { Tree, prettyPrint } from './main.js';

function randomArray() {
	let arr = [];

	for (let i = 0; i < 100; i++) {
		const n = Math.floor(Math.random() * 1000);
		arr.push(n);
	}

	return arr;
}

const Stree = new Tree(randomArray());
console.log(Stree.isBalanced());
prettyPrint(Stree.root);
Stree.levelOrderForEach((node) => {
	console.log(node.data);
});
Stree.preOrderForEach((node) => {
	console.log(node.data);
});
Stree.postOrderForEach((node) => {
	console.log(node.data);
});
Stree.inOrderForEach((node) => {
	console.log(node.data);
});

const extraArr = randomArray();

for (let i = 0; i < 100; i++) {
	Stree.insert(extraArr[i]);
}

console.log(Stree.isBalanced());

Stree.rebalance();

console.log(Stree.isBalanced());

Stree.levelOrderForEach((node) => {
	console.log(node.data);
});
Stree.preOrderForEach((node) => {
	console.log(node.data);
});
Stree.postOrderForEach((node) => {
	console.log(node.data);
});
Stree.inOrderForEach((node) => {
	console.log(node.data);
});
