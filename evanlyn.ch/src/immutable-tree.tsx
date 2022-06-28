import update from 'immutability-helper';

export type Trunk = {
    childs: [Trunk?],
    value: any,
    collapsed: boolean,
    _serial?: string,
    _parent?: string|null,
};

export type TrunkCache = {
    undos: [Trunk?],
    redos: [Trunk?],
    current: Trunk,
    nodeHash: Map<string, Trunk>,
    onMutate: (newTrunk: Trunk)=>void,
    createBaseValue: ()=>any
};

function makeSerial(size:number=5):string {
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

function formatTrunk(trunk:Trunk, createBaseValue:()=>any):Map<string, Trunk>{
    let nodeHash:Map<string, Trunk> = new Map<string, Trunk>;
    let formatChild = (child:Trunk, _parent:string|null) => {
        if (child.value === undefined){
            child.value = createBaseValue();
        }
        if (child.childs === undefined){
            child.childs = [];
        }
        if (child.collapsed === undefined){
            child.collapsed = false;
        }

        child._parent = _parent;
        if (child._serial === undefined){
            child._serial = makeSerial();
        }
        nodeHash.set(child._serial, child);
        for (var i=0; i < child.childs.length; i++){
            formatChild(child.childs[i] as Trunk, child._serial);
        }
    };
    formatChild(trunk, null);
    return nodeHash;
};

function makeEmptyTrunk():Trunk {
    return {
        childs: [{childs:[], collapsed: false, value: undefined}],
        value: undefined,
        collapsed: false
    }
};

function makeChild(parentSerial:string):Trunk{
    return {
        value: undefined,
        collapsed: false,
        _serial: makeSerial(),
        _parent: parentSerial,
        childs: []
    }
}

export function CreateTrunkCache(trunk:Trunk, onMutate:(newTrunk: Trunk)=>void, baseValue:object):TrunkCache {
    let createBaseValue = ()=>{JSON.parse(JSON.stringify(baseValue || {}))};
    return {
        undos: [trunk],
        redos: [],
        current:trunk,
        nodeHash: formatTrunk(trunk, createBaseValue),
        onMutate: onMutate,
        createBaseValue: createBaseValue
    };
};

export function GetTrunk(serial:string|undefined, trunkCache:TrunkCache) {
    if (!serial){
        return undefined;
    }
    return trunkCache.nodeHash.get(serial);
}


function fixNodeHash(trunk:Trunk, nodeHash:Map<string, Trunk>){
    if (trunk._serial && trunk === nodeHash.get(trunk._serial as string)) {
        return;
    }
    nodeHash.set(trunk._serial as string, trunk);
    trunk.childs.forEach((child) => {
        fixNodeHash(child as Trunk, nodeHash);
    });
};

function generateHash(target:Trunk, nodeHash:Map<string, Trunk>){
    let parents = ancestorsOf(target, nodeHash);
    parents.push(target);
    let hash:any = {};
    let iter:any = hash;
    for (var i=1; i < parents.length; i++){
        let previousParent = parents[i-1] as Trunk;
        let parent = parents[i];
        let parentIdx = previousParent.childs.indexOf(parent);
        var newHash = {};
        iter.childs = {
            [parentIdx]: newHash
        };
        iter = newHash;
    }
    return {
        hashTrunk: hash,
        target: iter
    };
};

function applyHash(trunkCache:TrunkCache, hash:any){
    var newTrunk = update(trunkCache.current, hash.hashTrunk);
    fixNodeHash(newTrunk, trunkCache.nodeHash);
    trunkCache.onMutate(newTrunk);
    if (trunkCache.undos.length > 10){
        trunkCache.undos.pop();
    }
    trunkCache.undos.unshift(trunkCache.current);
    trunkCache.redos = [];
    trunkCache.current = newTrunk;
};

export function Undo(trunkCache:TrunkCache){
    if (trunkCache.undos.length){
        if (trunkCache.redos.length > 10){
            trunkCache.redos.pop();
        }
        trunkCache.redos.unshift(trunkCache.current);
        let newTrunk = trunkCache.undos.shift();
        fixNodeHash(newTrunk as Trunk, trunkCache.nodeHash);
        trunkCache.onMutate(newTrunk as Trunk);
        trunkCache.current = newTrunk as Trunk;
    }
};

export function Redo(trunkCache:TrunkCache){
    if (trunkCache.redos.length){
        var newTrunk = trunkCache.redos.shift();
        fixNodeHash(newTrunk as Trunk, trunkCache.nodeHash);
        trunkCache.onMutate(newTrunk as Trunk);
        if (trunkCache.undos.length > 10){
            trunkCache.undos.pop();
        }
        trunkCache.undos.unshift(trunkCache.current as Trunk);
        trunkCache.current = newTrunk as Trunk;
    }
};

function ancestorsOf(target:Trunk|undefined, nodeHash:Map<string, Trunk>):[Trunk?]{
    if (target === undefined){
        return [];
    }
    let ancestors = [] as [Trunk?];
    let parent = parentOf(target, nodeHash) as Trunk;
    while (parent !== undefined){
        ancestors.unshift(parent as Trunk);
        parent = parentOf(parent as Trunk, nodeHash) as Trunk;
    }
    return ancestors;
};

export function AncestorsOf(child:Trunk|undefined, trunkCache:TrunkCache):[Trunk?] {
    return ancestorsOf(child, trunkCache.nodeHash);
}

function parentOf(child:Trunk|undefined, nodeHash:Map<string, Trunk>):Trunk|undefined{
    if (child === undefined) {
        return undefined;
    }
    if (child._parent === undefined){
        return undefined;
    }
    return nodeHash.get(child._parent as string);
}

export function ParentOf(child:Trunk|undefined, trunkCache:TrunkCache):Trunk|undefined {
    return parentOf(child, trunkCache.nodeHash);
}

export function PredOf(child:Trunk, trunkCache:TrunkCache):Trunk|undefined{
    if (child === trunkCache.current){
        return undefined;
    }
    if (indexOf(child, trunkCache.nodeHash) === 0){
        return parentOf(child, trunkCache.nodeHash);
    }
    const lowestOpenLeaf = function (trunk:Trunk):Trunk{
        if (trunk.collapsed || trunk.childs.length === 0){
            return trunk;
        }
        return lowestOpenLeaf(trunk.childs[trunk.childs.length - 1] as Trunk);
    }
    return lowestOpenLeaf((parentOf(child, trunkCache.nodeHash) as Trunk).childs[indexOf(child, trunkCache.nodeHash) - 1] as Trunk);
};

export function SuccOf(child:Trunk, trunkCache:TrunkCache):Trunk|undefined{
    if (!child.collapsed && child.childs.length > 0){
        return child.childs[0];
    }

    const childIdx = indexOf(child, trunkCache.nodeHash);
    if (childIdx < (parentOf(child, trunkCache.nodeHash) as Trunk).childs.length - 1){
        return (parentOf(child, trunkCache.nodeHash) as Trunk).childs[childIdx + 1];
    }

    const findIt = function (trunk:Trunk):Trunk|undefined{
        if (trunk === trunkCache.current){
            return undefined;
        }
        const parent = parentOf(trunk, trunkCache.nodeHash);
        const childIdx = indexOf(trunk, trunkCache.nodeHash);
        if (parent && childIdx < parent.childs.length - 1){
            return parent.childs[childIdx + 1];
        }
        if (parent) {
            return findIt(parent);
        }
        return undefined;
    };
    const parent = parentOf(child, trunkCache.nodeHash);
    if (parent) { return findIt(parent);}
    return undefined;
}

function indexOf(child:Trunk, nodeHash:Map<string, Trunk>):number{
    if (child._parent === undefined){return 0;}
    return (parentOf(child, nodeHash) as Trunk).childs.indexOf(child);
}

export function SetCollapsed(child:Trunk, trunkCache:TrunkCache, state:boolean){
    var hash = generateHash(child, trunkCache.nodeHash);
    hash.target.collapsed = {$set: state};
    applyHash(trunkCache, hash);
}

export function SetValue(child:Trunk, trunkCache:TrunkCache, value:any){
    if (child.value === value){return;}
    let hash = generateHash(child, trunkCache.nodeHash);
    if (value.title !== undefined && value.title === "<br>"){
        value.title = "";
    }
    hash.target.value = {$set: value};
    applyHash(trunkCache, hash);
}


export function NewItemBelow(child:Trunk, trunkCache:TrunkCache):undefined|Trunk{
    // Ignore if Trunk
    if (child === trunkCache.current){
        return undefined;
    }

    const childIdx = indexOf(child, trunkCache.nodeHash);
    let newItem = makeChild(child._parent as string);
    newItem.value = trunkCache.createBaseValue();
    trunkCache.nodeHash.set(newItem._serial as string, newItem);
    var hash = generateHash(parentOf(child, trunkCache.nodeHash) as Trunk, trunkCache.nodeHash);
    hash.target.childs = {$splice: [[childIdx + 1, 0, newItem]]};
    applyHash(trunkCache, hash);
    return newItem;
}

export function NewItemAbove(child:Trunk, trunkCache:TrunkCache):undefined|Trunk {
    // Ignore if Trunk
    if (child === trunkCache.current){
        return undefined;
    }

    const childIdx = indexOf(child, trunkCache.nodeHash);
    let newItem = makeChild(child._parent as string);
    newItem.value = trunkCache.createBaseValue();
    trunkCache.nodeHash.set(newItem._serial as string, newItem);
    var hash = generateHash(parentOf(child, trunkCache.nodeHash) as Trunk, trunkCache.nodeHash);
    hash.target.childs = {$splice: [[childIdx, 0, newItem]]};
    applyHash(trunkCache, hash);
    return newItem;
}

export function DeleteItem(child:Trunk, trunkCache:TrunkCache):boolean {
    // Ignore if Trunk
    if (child === trunkCache.current){
        return false;
    }

    if (parentOf(child, trunkCache.nodeHash) === trunkCache.current && trunkCache.current.childs.length === 1){
        return false;
    }
    const childIdx = indexOf(child, trunkCache.nodeHash);

    var hash = generateHash(parentOf(child, trunkCache.nodeHash) as Trunk, trunkCache.nodeHash);
    hash.target.childs = {$splice: [[childIdx, 1]]};
    applyHash(trunkCache, hash);

    return true;
}

export function IndentItem(child:Trunk, trunkCache:TrunkCache):boolean {
    // Ignore if Trunk
    if (child === trunkCache.current){
        return false;
    }
    // Ignore if First Child
    var childIdx = indexOf(child, trunkCache.nodeHash);
    if (childIdx === 0){
        return false;
    }

    const parent = parentOf(child, trunkCache.nodeHash) as Trunk;
    const newChild = update(
        child,
        {_parent: {
            $set: (parent.childs[childIdx - 1] as Trunk)._serial as string}});
    var hash = generateHash(parent, trunkCache.nodeHash);
    hash.target.childs = {
        $splice: [[childIdx,1]],
        [childIdx - 1]: {
            childs: {$push: [newChild]},
            collapsed: {$set: false}
        },
    };
    applyHash(trunkCache, hash);

    return true;
}

export function OutdentItem(child:Trunk, trunkCache:TrunkCache):boolean{
    // Ignore if Trunk
    if (child === trunkCache.current){
        return false;
    }

    // Ignore if Child of Trunk
    if (parentOf(child, trunkCache.nodeHash) === trunkCache.current){
        return false;
    }

    const parent = parentOf(child, trunkCache.nodeHash) as Trunk;
    const parentIdx = indexOf(parent, trunkCache.nodeHash);
    const childIdx = indexOf(child, trunkCache.nodeHash);

    const grandParent = parentOf(parent, trunkCache.nodeHash) as Trunk;

    const newChild = update(child, {_parent: {$set: grandParent._serial as string}});

    const hash = generateHash(grandParent, trunkCache.nodeHash);
    hash.target.childs = {
        $splice: [[parentIdx + 1, 0, newChild]],
        [parentIdx]: {
            childs: {$splice: [[childIdx,1]]}
        }
    };
    applyHash(trunkCache, hash);

    return true;
}

export function MoveItemUp(child:Trunk, trunkCache:TrunkCache):boolean{
    // Ignore if Trunk
    if (child === trunkCache.current){
        return false;
    }

    const childIdx = indexOf(child, trunkCache.nodeHash);

    // Ignore if top Child
    if (childIdx === 0){
        return false;
    }

    let hash = generateHash(parentOf(child, trunkCache.nodeHash) as Trunk, trunkCache.nodeHash);
    hash.target.childs = {
        $splice: [[childIdx, 1], [childIdx - 1, 0, child]]
    }
    applyHash(trunkCache, hash);
    return true;
}

export function MoveItemDown(child:Trunk, trunkCache:TrunkCache):boolean{
    // Ignore if Trunk
    if (child === trunkCache.current){
        return false;
    }

    const parent = parentOf(child, trunkCache.nodeHash) as Trunk;
    const childIdx = indexOf(child, trunkCache.nodeHash);

    // Ignore if bottom Child
    if (childIdx === parent.childs.length - 1){
        return false;
    }

    const hash = generateHash(parent, trunkCache.nodeHash);

    hash.target.childs = {
        $splice: [[childIdx, 1], [childIdx + 1, 0, child]]
    }
    applyHash(trunkCache, hash);
    return true;
}
