import {ReactElement} from 'react';
import './Whose.css';

type WhoseProps = {
    changeWhose: (x:string) => void;
    reset:()=>void;
    whose: string;
}

  
function Whose(props:WhoseProps): ReactElement {
    const {changeWhose, whose} = props;
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex"}}>
                <button title="my version of this website" onClick={()=>changeWhose("mine")} style={{
                    color: whose === "mine" ? "#807861" : "",
                }}>mine</button>
                <button title="your version of this website you get to edit" onClick={()=>changeWhose("yours")} style={{
                color: whose === "yours" ? "#807861" : "",
            }}>yours</button>
            </div>
            <button title="erase your version of this website and get back to mine" onClick={()=>props.reset()} >reset</button>
        </div>
    );
};
export default Whose;
