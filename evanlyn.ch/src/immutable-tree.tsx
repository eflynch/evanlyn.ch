import update from 'immutability-helper';

export type Trunk = {
    childs: Trunk[],
    value: any,
    collapsed: boolean,
    serial: string,
    parent: string|null,
};

export type PartialTrunk = {
    childs: PartialTrunk[],
    value: any,
    collapsed?: boolean,
    serial?: string,
    parent?: string|null,
}

export type Tree = {
    undo: {forwardHash:any, backwardHash:any}[],
    redo: {forwardHash:any, backwardHash:any}[],
    trunk: Trunk,
    lookup: any,
    createBaseValue: ()=>any,
    makeSerial:()=>string
};

export const CreateSerialGenerator = (size:number) => () => {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var text = (function() {
        var results = [];
        for (var i=0; i < size; i++) {
            results.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        }
        return results;
    })();
    return text.join('');
};

export function ParseTrunk(trunk:Trunk|PartialTrunk, createBaseValue:()=>any, makeSerial=CreateSerialGenerator(5)):Tree {
    const lookup:any = {}; 
    const formatChild = (child:Trunk|PartialTrunk, parent:string|null) => {
        if (child.value === undefined || child.value === null){
            child.value = createBaseValue();
        }
        if (child.childs === undefined){
            child.childs = [];
        }
        if (child.collapsed === undefined){
            child.collapsed = false;
        }

        child.parent = parent;
        if (child.serial === undefined){
            child.serial = makeSerial();
        }
        lookup[child.serial] = child;
        for (var i=0; i < child.childs.length; i++){
            formatChild(child.childs[i] as Trunk, child.serial);
        }
    };
    formatChild(trunk, null);
    return {
        undo: [],
        redo: [],
        trunk: trunk as Trunk,
        lookup: lookup,
        createBaseValue: createBaseValue,
        makeSerial: makeSerial
    };
};

export function MakeEmptyTree(createBaseValue:()=>any, makeSerial=CreateSerialGenerator(5)):Tree {
    return ParseTrunk({
        childs: [{childs:[], collapsed: false, value: undefined}],
        value: undefined,
        collapsed: false
    }, createBaseValue, makeSerial);
};

const updateLookup = (tree:Tree, deletedSerials:string[]) => {
    const hash:any = {
        lookup: {
            $unset: []
        }
    };

    const fixNodeHash = (trunk:Trunk) => {
        if (tree.lookup[trunk.serial] === undefined) {
            hash.lookup[trunk.serial] = {$set: trunk}
        } else if (tree.lookup[trunk.serial] === trunk) {
            return;
        }
        hash.lookup[trunk.serial] = {$set: trunk};
        trunk.childs.forEach((child)=>{
            fixNodeHash(child as Trunk);
        });
    };
    fixNodeHash(tree.trunk);
    if (deletedSerials !== undefined) {
        deletedSerials.forEach(serial => {
            hash.lookup["$unset"].push(serial);
        });
    }

    return update(tree, hash);
};
export function ApplyHash(tree:Tree, forwardHash:any, backwardHash:any):Tree {
    const hash:any = {
        undo: {$push: [{forwardHash, backwardHash}]},
        redo: {$set: []}
    };
    if (forwardHash.trunkHash){
        hash.trunk = forwardHash.trunkHash;
    }
    return updateLookup(update(tree, hash), forwardHash.deletedSerials);
}

export const Undo = (tree:Tree) => {
    if (tree.undo.length) {
        const {forwardHash, backwardHash} = tree.undo[tree.undo.length - 1];
        return updateLookup(update(tree, {
            trunk: backwardHash.trunkHash,
            undo: {$splice: [[tree.undo.length - 1, 1]] },
            redo: {$push: {forwardHash, backwardHash}},
        }), backwardHash.deletedSerials);
    } else {
        return tree;
    }
};

export const Redo = (tree:Tree) => {
    if (tree.redo.length) {
        const {forwardHash, backwardHash} = tree.redo[tree.redo.length - 1];
        return updateLookup(update(tree, {
            trunk: forwardHash.trunkHash,
            undo: {$push: {forwardHash, backwardHash}},
            redo: {$splice: [[tree.redo.length - 1, 1]] },
        }), forwardHash.deletedSerials);
    } else {
        return tree;
    }
};


const makeChild = (makeSerial:()=>any, parentSerial:string) => {
    return {
        value: undefined,
        collapsed: false,
        serial: makeSerial(),
        parent: parentSerial,
        childs: []
    }
};


export function ParentOf(tree:Tree, child:Trunk):Trunk|undefined {
    if (child.parent === undefined){
        return undefined;
    }
    return tree.lookup[child.parent as string];
};

export function IndexOf(tree:Tree, child:Trunk):number {
    if (child.parent === undefined){return 0;}
    return (ParentOf(tree, child) as Trunk).childs.indexOf(child);
};

export function AncestorsOf(tree:Tree, target:Trunk|null):Trunk[] {
    if (target === null){
        return [];
    }
    var ancestors = [];
    var parent = ParentOf(tree, target);
    while (parent !== undefined){
        ancestors.unshift(parent);
        parent = ParentOf(tree, parent);
    }
    return ancestors;
};

export function PredOf (tree:Tree, child:Trunk):Trunk|undefined{
    if (child === tree.trunk){
        return undefined;
    }
    if (IndexOf(tree, child) === 0){
        return ParentOf(tree, child);
    }
    const lowestOpenLeaf:(trunk:Trunk)=>Trunk = (trunk:Trunk) => {
        if (trunk.collapsed || trunk.childs.length === 0){
            return trunk;
        }
        return lowestOpenLeaf(trunk.childs[trunk.childs.length - 1] as Trunk);
    }
    const parent:Trunk = ParentOf(tree, child) as Trunk;
    return lowestOpenLeaf(parent.childs[IndexOf(tree, child) - 1 as number] as Trunk);
};

export function SuccOf(tree:Tree, child:Trunk) {
    if (!child.collapsed && child.childs.length > 0){
        return child.childs[0];
    }

    const parent = ParentOf(tree, child) as Trunk;
    const childIdx = IndexOf(tree, child);
    if (childIdx < parent.childs.length - 1){
        return parent.childs[childIdx + 1];
    }

    const findIt:(trunk:Trunk)=>Trunk|undefined = (trunk:Trunk) => {
        if (trunk === tree.trunk){
            return undefined;
        }
        const parent = ParentOf(tree, trunk) as Trunk;
        const childIdx = IndexOf(tree, trunk);
        if (childIdx < parent.childs.length - 1){
            return parent.childs[childIdx + 1];
        }

        return findIt(parent);
    };

    return findIt(ParentOf(tree, child) as Trunk);
};

export function Lookup(tree:Tree, serial:string):Trunk|undefined {
    return tree.lookup[serial];
};

function generateTrunkHash(tree:Tree, target:Trunk, callback:(hash:any)=>void):any {
    let parents = AncestorsOf(tree, target);
    parents.push(target);
    const hash:any = {};
    let iter = hash;
    for (let i=1; i < parents.length; i++){
        let previousParent = parents[i-1];
        let parent = parents[i];
        let parentIdx = previousParent.childs.indexOf(parent);
        let newHash = {};
        iter.childs = {
            [parentIdx]: newHash
        };
        iter = newHash;
    }
    callback(iter);
    return hash;
};

export function SetCollapsed(tree:Tree, child:Trunk, state:boolean):Tree {
    const oldState = child.collapsed;
    const forwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.collapsed = {$set: state}
    });
    const backwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.collapsed = {$set: oldState}
    });
    return ApplyHash(tree, {trunkHash: forwardTrunkHash}, {trunkHash: backwardTrunkHash});
};

export function SetValue(tree:Tree, child:Trunk, value:any):Tree {
    const oldValue = child.value;
    if (value === oldValue){return tree;}

    // Weird hack
    if (value.title !== undefined && value.title === "<br>"){
        value.title = "";
    }

    const forwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.value = {$set: value};
    });
    const backwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.value = {$set: oldValue};
    });
    return ApplyHash(tree, {trunkHash: forwardTrunkHash}, {trunkHash: backwardTrunkHash});
};


export function NewChild(tree:Tree, child:Trunk):{tree:Tree, newItem:Trunk} {
    const newItem = makeChild(tree.makeSerial, child.serial);
    newItem.value = tree.createBaseValue();


    const forwardTrunkHash:any = generateTrunkHash(tree, child, targetHash => {
        targetHash.childs = {$splice: [[0, 0, newItem]]};
    });

    const backwardTrunkHash:any  = generateTrunkHash(tree, child, targetHash => {
        targetHash.childs = {$splice: [[0, 1]]};
    });
    return {
        tree: ApplyHash(tree,
            {trunkHash: forwardTrunkHash},
            {trunkHash: backwardTrunkHash, deletedSerials: [newItem.serial]}),
        newItem: newItem
    };
};

export function NewSibling(tree:Tree, child:Trunk, index:number):{tree:Tree, newItem:Trunk|undefined} {
    if (child === tree.trunk){
        return {tree:tree, newItem:undefined};
    }
    const parent = ParentOf(tree, child) as Trunk;

    const newItem = makeChild(tree.makeSerial, child.parent as string);
    newItem.value = tree.createBaseValue();


    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[index, 0, newItem]]};
    });

    const backwardTrunkHash  = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[index, 1]]};
    });
    return {
        tree: ApplyHash(tree,
            {trunkHash: forwardTrunkHash},
            {trunkHash: backwardTrunkHash, deletedSerials: [newItem.serial]}),
        newItem: newItem
    };
};

export function NewItemBelow(tree:Tree, child:Trunk):{tree:Tree, newItem:Trunk|undefined} {
    return NewSibling(tree, child, IndexOf(tree, child) + 1); 
};

export function NewItemAbove(tree:Tree, child:Trunk):{tree:Tree, newItem:Trunk|undefined} {
    return NewSibling(tree, child, IndexOf(tree, child)); 
};

export function DeleteItem(tree:Tree, child:Trunk):Tree {
    if (child === tree.trunk) {
        return tree;
    }

    const parent = ParentOf(tree, child) as Trunk;
    if (parent === tree.trunk && tree.trunk.childs.length === 1) {
        return tree;
    }

    const childIndex = IndexOf(tree, child);

    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[childIndex, 1]]};
    });
    const backwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[childIndex, 0, child]]};
    });

    return ApplyHash(tree,
        {trunkHash: forwardTrunkHash, deletedSerials: [child.serial]},
        {trunkHash: backwardTrunkHash});
};

export function IndentItem(tree:Tree, child:Trunk):Tree {
    if (child === tree.trunk){
        return tree;
    }
    const parent = ParentOf(tree, child) as Trunk;

    const oldIndex = IndexOf(tree, child);
    if (oldIndex === 0){
        return tree;
    }

    const newParent = parent.childs[oldIndex - 1];
    const newParentOldCollapsedState = newParent.collapsed;
    const newParentOldChildCount = newParent.childs.length;

    const newChild = update(child, {
        parent: {$set: newParent.serial}
    });

    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {
            [oldIndex - 1]: {
                childs: {$push: [newChild]},
                collapsed: {$set: false}
            },
            $splice: [[oldIndex, 1]],
        };
    });

    const backwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {
            [oldIndex - 1]: {
                childs: {$splice: [newParentOldChildCount, 1]},
                collapsed: {$set: newParentOldCollapsedState}
            },
            $splice: [[oldIndex, 0, child]],
        };
    });

    return ApplyHash(tree,
        {trunkHash: forwardTrunkHash},
        {trunkHash: backwardTrunkHash});
}

export function OutdentItem(tree:Tree, child:Trunk):Tree {
    if (child === tree.trunk){
        return tree;
    }
    const parent = ParentOf(tree, child) as Trunk;

    if (parent === tree.trunk) {
        return tree;
    }
    const newParent = ParentOf(tree, parent) as Trunk; 

    const childIndex = IndexOf(tree, child);
    const parentIndex = IndexOf(tree, parent);


    const newChild = update(child, {
        parent: {$set: newParent.serial}
    });

    const forwardTrunkHash = generateTrunkHash(tree, newParent, targetHash => {
        targetHash.childs = {
            $splice: [[parentIndex + 1, 0, newChild]],
            [parentIndex]: {
                childs: {$splice: [[childIndex, 1]]}
            }
        };
    });

    const backwardTrunkHash = generateTrunkHash(tree, newParent, targetHash => {
        targetHash.childs = {
            $splice: [[parentIndex + 1, 1]],
            [parentIndex]: {
                childs: {$splice: [[childIndex, 0, child]]}
            }
        };
    });

    return ApplyHash(tree,
        {trunkHash: forwardTrunkHash},
        {trunkHash: backwardTrunkHash});
}

export function MoveItem(tree:Tree, child:Trunk, index:number):Tree {
    if (child === tree.trunk){
        return tree;
    }
    const parent = ParentOf(tree, child) as Trunk;

    let newIndex = Math.max(index, 0);
    if (index >= parent.childs.length) {
        newIndex = parent.childs.length - 1;
    }
    const oldIndex = IndexOf(tree, child);

    if (oldIndex === newIndex) {
        return tree;
    }

    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        let spliceOp;
        if (oldIndex > newIndex) {
            spliceOp = [[oldIndex, 1], [newIndex, 0, child]];
        } else {
            spliceOp = [[newIndex, 0, child], [oldIndex, 1]];
        }
        targetHash.childs = {$splice : spliceOp};
    });

    const backwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        let spliceOp;
        if (newIndex > oldIndex) {
            spliceOp = [[newIndex, 1], [oldIndex, 0, child]];
        } else {
            spliceOp = [[oldIndex, 0, child], [newIndex, 1]];
        }
        targetHash.childs = {$splice : spliceOp};
    });

    return ApplyHash(tree, {trunkHash: forwardTrunkHash}, {trunkHash: backwardTrunkHash});
};

export function MoveItemUp(tree:Tree, child:Trunk):Tree {
    const newIndex = IndexOf(tree, child) - 1;
    return MoveItem(tree, child, newIndex);
};

export function MoveItemDown(tree:Tree, child:Trunk):Tree {
    const newIndex = IndexOf(tree, child) + 1;
    return MoveItem(tree, child, newIndex);
};