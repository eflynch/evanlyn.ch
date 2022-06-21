import update from 'immutability-helper';
import { stringify } from 'querystring';

type Trunk {
    childs: [Trunk]|[],
    value: any,
    collapsed: boolean,
    _serial?: string,
    _parent?: string|null,
};

type TrunkCache {
    undos: [Trunk]|[],
    redos: [Trunk]|[],
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
            formatChild(child.childs[i], child._serial);
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

function fixNodeHash(trunk:Trunk, nodeHash:Map<string, Trunk>){
    if (trunk._serial && trunk === nodeHash.get(trunk._serial as string)) {
        return;
    }
    nodeHash.set(trunk._serial as string, trunk);
    trunk.childs.forEach((child) => {
        fixNodeHash(child, nodeHash);
    });
};

function generateHash(target:Trunk){
    var parents = ancestorsOf(target);
    parents.push(target);
    var hash:any = {};
    var iter:any = hash;
    var previousParent;
    for (var i=1; i < parents.length; i++){
        var previousParent = parents[i-1];
        var parent = parents[i];
        var parentIdx = previousParent.childs.indexOf(parent);
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
    (trunkCache.undos as [Trunk]).unshift(trunkCache.current);
    trunkCache.redos = [];
    trunkCache.current = newTrunk;
};

function undo(trunkCache:TrunkCache){
    if (trunkCache.undos.length){
        if (trunkCache.redos.length > 10){
            trunkCache.redos.pop();
        }
        (trunkCache.redos as [Trunk]).unshift(trunkCache.current);
        var newTrunk = trunkCache.undos.shift();
        fixNodeHash(newTrunk as Trunk, trunkCache.nodeHash);
        trunkCache.onMutate(newTrunk as Trunk);
        trunkCache.current = newTrunk as Trunk;
    }
};

function redo(trunkCache:TrunkCache){
    if (trunkCache.redos.length){
        var newTrunk = trunkCache.redos.shift();
        fixNodeHash(newTrunk as Trunk, trunkCache.nodeHash);
        trunkCache.onMutate(newTrunk as Trunk);
        if (trunkCache.undos.length > 10){
            trunkCache.undos.pop();
        }
        (trunkCache.undos as [Trunk]).unshift(trunkCache.current as Trunk);
        trunkCache.current = newTrunk as Trunk;
    }
};

function ancestorsOf(target:Trunk|undefined){
    if (target === undefined){
        return [];
    }
    var ancestors = [];
    var parent = parentOf(target);
    while (parent !== undefined){
        ancestors.unshift(parent);
        parent = parentOf(parent);
    }
    return ancestors;
}

    parentOf(child){
        if (child._parent === undefined){
            return undefined;
        }
        return this.nodeHash[child._parent];
    }

    predOf(child){
        if (child === this.trunk){
            return undefined;
        }
        if (this.indexOf(child) === 0){
            return this.parentOf(child);
        }
        var lowestOpenLeaf = function (trunk){
            if (trunk.collapsed || trunk.childs.length === 0){
                return trunk;
            }
            return lowestOpenLeaf(trunk.childs[trunk.childs.length - 1]);
        }
        return lowestOpenLeaf(this.parentOf(child).childs[this.indexOf(child) - 1]);

    }

    succOf(child){
        if (!child.collapsed && child.childs.length > 0){
            return child.childs[0];
        }

        var childIdx = this.indexOf(child);
        if (childIdx < this.parentOf(child).childs.length - 1){
            return this.parentOf(child).childs[childIdx + 1];
        }

        var findIt = function (trunk){
            if (trunk === this.trunk){
                return undefined;
            }
            var parent = this.parentOf(trunk);
            var childIdx = this.indexOf(trunk);
            if (childIdx < parent.childs.length - 1){
                return parent.childs[childIdx + 1];
            }

            return findIt(parent);
        }.bind(this);
        return findIt(this.parentOf(child));

    }

    indexOf(child){
        if (child._parent === undefined){return 0;}
        return this.parentOf(child).childs.indexOf(child);
    }

    getTrunk(){
        return this.trunk;
    }

    setCollapsed(child, state){
        var hash = this.generateHash(child);
        hash.target.collapsed = {$set: state};
        this.applyHash(hash);
    }

    setValue(child, value){
        if (child.value === value){return;}
        var hash = this.generateHash(child);
        if (value.title !== undefined && value.title === "<br>"){
            value.title = "";
        }
        hash.target.value = {$set: value};
        this.applyHash(hash);
    }


    newItemBelow(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }

        var childIdx = this.indexOf(child);
        var newItem = ImmutableTree.makeChild(child._parent);
        newItem.value = this.createBaseValue();
        this.nodeHash[newItem._serial] = newItem;
        var hash = this.generateHash(this.parentOf(child));
        hash.target.childs = {$splice: [[childIdx + 1, 0, newItem]]};
        this.applyHash(hash);
        return newItem;
    }

    newItemAbove(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }

        var childIdx = this.indexOf(child);
        var newItem = ImmutableTree.makeChild(child._parent);
        newItem.value = this.createBaseValue();
        this.nodeHash[newItem._serial] = newItem;
        var hash = this.generateHash(this.parentOf(child));
        hash.target.childs = {$splice: [[childIdx, 0, newItem]]};
        this.applyHash(hash);
        return newItem;
    }

    deleteItem(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }
        if (this.parentOf(child) === this.trunk && this.trunk.childs.length === 1){
            return false;
        }
        var childIdx = this.indexOf(child);

        var hash = this.generateHash(this.parentOf(child));
        hash.target.childs = {$splice: [[childIdx, 1]]};
        this.applyHash(hash);

        return true;
    }

    indentItem(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }
        // Ignore if First Child
        var childIdx = this.indexOf(child);
        if (childIdx === 0){
            return false;
        }

        var newChild = update(child, {_parent: {$set: this.parentOf(child).childs[childIdx - 1]._serial}});
        var hash = this.generateHash(this.parentOf(child));
        hash.target.childs = {
            $splice: [[childIdx,1]],
            [childIdx - 1]: {
                childs: {$push: [newChild]},
                collapsed: {$set: false}
            },
        };
        this.applyHash(hash);

        return true;
    }

    outdentItem(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }

        // Ignore if Child of Trunk
        if (this.parentOf(child) === this.trunk){
            return false;
        }

        var parentIdx = this.indexOf(this.parentOf(child));
        var childIdx = this.indexOf(child);

        var newChild = update(child, {_parent: {$set: this.parentOf(this.parentOf(child))._serial}});

        var hash = this.generateHash(this.parentOf(this.parentOf(child)));
        hash.target.childs = {
            $splice: [[parentIdx + 1, 0, newChild]],
            [parentIdx]: {
                childs: {$splice: [[childIdx,1]]}
            }
        };
        this.applyHash(hash);

        return true;
    }

    moveItemUp(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }

        var childIdx = this.indexOf(child);

        // Ignore if top Child
        if (childIdx === 0){
            return false;
        }

        var hash = this.generateHash(this.parentOf(child));
        hash.target.childs = {
            $splice: [[childIdx, 1], [childIdx - 1, 0, child]]
        }
        this.applyHash(hash);
        return true;
    }

    moveItemDown(child){
        // Ignore if Trunk
        if (child === this.trunk){
            return false;
        }

        var childIdx = this.indexOf(child);

        // Ignore if bottom Child
        if (childIdx === this.parentOf(child).childs.length - 1){
            return false;
        }

        var hash = this.generateHash(this.parentOf(child));
        hash.target.childs = {
            $splice: [[childIdx, 1], [childIdx + 1, 0, child]]
        }
        this.applyHash(hash);
        return true;
    }
}

module.exports = ImmutableTree;
