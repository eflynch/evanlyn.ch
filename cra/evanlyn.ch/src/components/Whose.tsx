import React, {ReactElement} from 'react';

type WhoseProps = {
    changeWhose: (x:string) => void,
    whose: string
}

  
function Whose(props:WhoseProps): ReactElement {
    const {changeWhose, whose} = props;
    return (
        <div>
            <span onClick={()=>changeWhose("mine")} style={{
                color: whose === "mine" ? "#807861" : "",
                cursor: "pointer"
            }}>mine</span> | <span onClick={()=>changeWhose("yours")} style={{
                color: whose === "yours" ? "#807861" : "",
                cursor: "pointer"
            }}>yours</span>
        </div>
    );
};
export default Whose;
