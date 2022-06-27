import FontAwesome from 'react-fontawesome';
import { Trunk } from '../immutable-tree';

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
    return <FontAwesome name={name} className="MAGNOLIAL_decoration" onClick={onClick}/>
}

export default Decoration;
