import { Trunk } from '../immutable-tree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import {
    library,
    IconName,
    findIconDefinition
} from '@fortawesome/fontawesome-svg-core'

 
library.add(fas)
const getIcon = (name:IconName) => {
    return findIconDefinition({prefix: 'fas', iconName: name});
}

type DecorationProps = {
    trunk:Trunk;
    setHead:(head:Trunk|undefined)=>void;
    setFocus:(focus:Trunk|undefined)=>void;
    hasContent:boolean;
    hasLink:boolean;
    collapseable:boolean;
    collapsed:boolean;
    toggleCollapsed:()=>void;
};

function Decoration(props:DecorationProps):JSX.Element {
    const onClick = (e:any) => {
        if (e.metaKey){
            props.setHead(props.trunk);
        } else if (props.collapseable) {
            props.toggleCollapsed();
        } else if (props.hasContent) {
            props.setHead(props.trunk);
        } else if (props.hasLink) {
            window.location = props.trunk.value.link; 
        } else {
            props.setFocus(props.trunk);
        }
    };
    const name = props.collapseable ? props.collapsed ? 'chevron-circle-right' : "chevron-down" : 'circle';
    return <FontAwesomeIcon icon={getIcon(name)} className="magnolia_decoration" onClick={onClick}/>
}

export default Decoration;
