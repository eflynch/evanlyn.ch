import update from 'immutability-helper';
import {Lookup, AncestorsOf, DeleteItem} from '../immutable-tree';
import {IndentItem, OutdentItem, MakeEmptyTree, ParentOf, SetCollapsed, NewChild} from '../immutable-tree';
import {PredOf, SuccOf, MoveItemUp, MoveItemDown, NewItemAbove, NewItemBelow, Undo, Redo, SetValue} from '../immutable-tree';

const setHead = (state, child) => {
    return update(state, {
        headSerial: {$set: child.serial},
        focusSerial: {$set: child.serial}
    });
};

const setFocus = (state, child) => {
    if (child === undefined || child === null) {
        return setFocus(state, Lookup(state.tree, state.headSerial));
    }

    const currentHead = Lookup(state.tree, state.headSerial);
    if (AncestorsOf(state.tree, child).indexOf(currentHead) < 0) {
        if (child !== currentHead) {
            return state;
        }
    }

    return update(state, {focusSerial: {$set: child.serial}});
};

const magnolia = (state, action) => {
    if (action === undefined) {
        const tree = MakeEmptyTree(()=>{
                return {
                    title: "",
                    link:"",
                    content: ""
                };
            });
        return {
            tree: tree,
            headSerial: tree.trunk.serial,
            focusSerial: tree.trunk.serial
        };
    }
    switch (action.type) {
        case 'DELETE':
            if (Lookup(state.tree, state.headSerial) === action.child) {
                return state;
            }

            const intermediate = setFocus(state, PredOf(state.tree, action.child));
            return update(intermediate, {
                tree: {$set: DeleteItem(intermediate.tree, action.child)}
            });
        case 'INDENT':
            return update(state, {
                tree: {$set: IndentItem(state.tree, action.child)}
            });
        case 'OUTDENT':
            return update(state, {
                tree: {$set: OutdentItem(state.tree, action.child)}
            });
        case 'SET_FOCUS':
            return setFocus(state, action.child);
        case 'FOCUS_UP':
            return setFocus(state, PredOf(state.tree, action.child));
        case 'FOCUS_DOWN':
            if (action.child === Lookup(state.tree, state.headSerial)) {
                return setFocus(state, action.child.childs[0]);
            }
            const successor = SuccOf(state.tree, action.child);
            if (successor === undefined) {
                return state;
            }
            return setFocus(state, successor);
        case 'SHIFT_UP':
            return update(state, {
                tree: {$set: MoveItemUp(state.tree, action.child)}
            });
        case 'SHIFT_DOWN':
            let newTree = MoveItemDown(state.tree, action.child);
            if (state.tree === newTree) {
                newTree = IndentItem(state.tree, action.child);
            }
            return update(state, {
                tree: {$set: newTree}
            });
        case 'NEW_ABOVE': {
            const {tree, newItem} = NewItemAbove(state.tree, action.child);
            return setFocus(update(state, {
                tree: {$set: tree}
            }), newItem);
        }
        case 'NEW_BELOW': {
            const head = Lookup(state.tree, state.headSerial);
            if (action.child === head) {
                const {tree, newItem} = NewChild(state.tree, action.child);
                return setFocus(update(state, {
                    tree: {$set: tree}
                }), newItem);
            }
            const {tree, newItem} = NewItemBelow(state.tree, action.child);
            return setFocus(update(state, {
                tree: {$set: tree}
            }), newItem);
        }
        case 'NEW': {
            // Try outdenting if we aren't a child of head
            const head = Lookup(state.tree, state.headSerial);
            if (head !== ParentOf(state.tree, action.child)) {
                const tree = OutdentItem(state.tree, action.child);
                if (state.tree !== tree) {
                    return update(state, {tree: {$set: tree}});
                }
            }

            // otherwise just newItemBelow
            const {tree, newItem} = NewItemBelow(state.tree, action.child);
            return setFocus(update(state, {
                    tree: {$set: tree}
                }), newItem);
        }
        case 'UNDO':
            return update(state, {tree: {$set: Undo(state.tree, action.child)}});
        case 'REDO':
            return update(state, {tree: {$set: Redo(state.tree, action.child)}});
        case 'MODIFY':
            return update(state, {tree: {$set: SetValue(state.tree, action.child, action.value)}});
        case 'SET_COLLAPSED':
            return update(state, {tree: {$set: SetCollapsed(state.tree, action.child, action.collapsed)}});
        case 'SET_HEAD':
            return setHead(state, action.child);
        case 'DELVE_IN':
            return setFocus(setHead(state, action.child), action.child.childs[0]);
        case 'DELVE_OUT':
            const head = Lookup(state.tree, state.headSerial);
            if (head === state.tree.trunk) {
                return state;
            }
            return setFocus(setHead(state, ParentOf(state.tree, head)), head);
        default:
            return state;
    }
}
export default magnolia;